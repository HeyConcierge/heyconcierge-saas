"""
Copy Detector — Monitors top traders for new positions.
Detects when tracked traders enter new markets and generates copy signals.
"""
from __future__ import annotations

import requests
from datetime import datetime, timezone

from config import CLOB_HOST, GAMMA_API
from db.client import get_supabase
from db.queries import TraderQueries, MarketQueries
from utils.logger import log
from utils.rate_limiter import rate_limiter

DATA_API = "https://data-api.polymarket.com"


class CopyDetector:
    def __init__(self, max_traders: int = 10):
        self.max_traders = max_traders

    def detect_signals(self) -> list[dict]:
        top_traders = TraderQueries.get_top_traders(limit=self.max_traders)
        if not top_traders:
            return []
        log("info", f"Monitoring {len(top_traders)} top traders for new positions", source="copy_detector")
        signals = []
        for trader in top_traders:
            try:
                new_positions = self._check_trader(trader)
                signals.extend(new_positions)
            except Exception as e:
                log("warning", f"Error checking trader {trader.get('alias', '?')}: {e}", source="copy_detector")
        if signals:
            log("info", f"Detected {len(signals)} new copy signals", source="copy_detector")
        return signals

    def _check_trader(self, trader: dict) -> list[dict]:
        wallet = trader.get("wallet_address", "")
        if not wallet:
            return []
        rate_limiter.wait("polymarket")
        positions = self._fetch_positions(wallet)
        if not positions:
            return []

        sb = get_supabase()
        existing = sb.table("ep_trader_trades").select("market_id, direction").eq("trader_id", trader["id"]).execute()
        seen_keys = {(t["market_id"], t["direction"]) for t in (existing.data or [])}

        new_signals = []
        for pos in positions:
            market_id = pos.get("slug", pos.get("eventSlug", pos.get("market", "")))
            if not market_id and isinstance(pos.get("asset"), dict):
                market_id = pos["asset"].get("market", "")
            outcome = pos.get("outcome", "")
            direction = "YES" if outcome == "Yes" else "NO"
            current_value = float(pos.get("currentValue", 0))
            size = float(pos.get("size", 0))
            price = float(pos.get("avgPrice", pos.get("price", 0)))
            value = current_value if current_value > 0 else size * price if price > 0 else size

            if not market_id or value < 100:
                continue
            key = (market_id, direction)
            if key in seen_keys:
                continue

            trade_record = {
                "trader_id": trader["id"],
                "market_id": market_id,
                "direction": direction,
                "amount": value,
                "price": price,
                "trade_type": "entry",
            }
            try:
                TraderQueries.insert_trader_trade(trade_record)
            except Exception as e:
                log("warning", f"Failed to save trader trade: {e}", source="copy_detector")

            market = MarketQueries.get_market_by_id(market_id)
            question = market.get("question", market_id) if market else market_id
            signal = {
                "trader_alias": trader.get("alias", wallet[:10]),
                "trader_address": wallet,
                "trader_pnl": trader.get("total_pnl", 0),
                "trader_rank": trader.get("composite_rank", 0),
                "market_id": market_id,
                "question": question,
                "direction": direction,
                "size": value,
                "price": price,
                "detected_at": datetime.now(timezone.utc).isoformat(),
            }
            new_signals.append(signal)
            log("info", f"COPY SIGNAL: {trader.get('alias', '?')} → {direction} {market_id[:30]} (${value:,.0f})", source="copy_detector")
        return new_signals

    def _fetch_positions(self, wallet_address: str) -> list[dict]:
        try:
            response = requests.get(
                f"{DATA_API}/positions",
                params={"user": wallet_address, "sizeThreshold": 100, "limit": 50},
                timeout=15,
            )
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data if isinstance(data, list) else data.get("positions", [])
        except Exception:
            pass
        try:
            response = requests.get(f"{CLOB_HOST}/positions", params={"user": wallet_address}, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data if isinstance(data, list) else data.get("positions", [])
        except Exception:
            pass
        return []

    def format_copy_signal(self, signal: dict) -> dict:
        return {
            "question": f"🔄 {signal['trader_alias']} copied: {signal['question']}",
            "side": signal["direction"],
            "price": signal["price"],
            "confidence": "Medium",
            "reasoning": (
                f"Top trader {signal['trader_alias']} (PnL: ${signal['trader_pnl']:,.0f}) "
                f"entered {signal['direction']} position worth ${signal['size']:,.0f}. "
                f"Trader rank: {signal['trader_rank']:.2f}/1.0."
            ),
            "tokenId": "",
            "createdAt": signal["detected_at"],
        }
