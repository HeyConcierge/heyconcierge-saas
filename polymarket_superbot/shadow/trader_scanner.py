"""
Trader Scanner — Discovers and tracks top Polymarket traders.

Data sources:
1. Polymarket Data API leaderboard (official endpoint)
2. Gamma API profiles for enrichment
3. Seed list of known whales from config

Stores results in ep_tracked_traders for the copy trading engine.
"""
from __future__ import annotations

import requests
import json
from datetime import datetime, timezone
from typing import Optional

from config import WHALE_WALLETS, GAMMA_API, CLOB_HOST
from db.queries import TraderQueries, AuditLog
from utils.logger import log
from utils.rate_limiter import rate_limiter

DATA_API = "https://data-api.polymarket.com"


class TraderScanner:
    """Discovers top traders from multiple sources and upserts them into ep_tracked_traders."""

    def scan_all(self) -> list[dict]:
        all_traders: dict[str, dict] = {}

        # Source 1: Official Polymarket leaderboard (ALL time, by PnL)
        leaderboard = self._fetch_leaderboard()
        for t in leaderboard:
            addr = t.get("wallet_address", "").lower()
            if addr:
                all_traders[addr] = t

        # Source 1b: Weekly top movers for recency
        weekly = self._fetch_leaderboard(time_period="WEEK")
        for t in weekly:
            addr = t.get("wallet_address", "").lower()
            if addr:
                if addr in all_traders:
                    all_traders[addr]["pnl_7d"] = t.get("total_pnl", 0)
                else:
                    all_traders[addr] = t

        # Source 2: Seed whales from config
        seed = self._seed_whales()
        for t in seed:
            addr = t.get("wallet_address", "").lower()
            if addr and addr not in all_traders:
                all_traders[addr] = t

        traders_list = list(all_traders.values())
        ranked = self._compute_ranks(traders_list)

        saved = 0
        for t in ranked:
            try:
                TraderQueries.upsert_trader(t)
                saved += 1
            except Exception as e:
                log("warning", f"Failed to upsert trader {t.get('alias', '?')}: {e}", source="trader_scanner")

        log("info", f"Scanned {len(ranked)} traders, saved {saved}", source="trader_scanner", audit=True)
        AuditLog.log("trader_scan", {
            "total": len(ranked), "saved": saved,
            "from_leaderboard": len(leaderboard),
            "from_weekly": len(weekly),
            "from_seed": len(seed)
        }, source="trader_scanner")
        return ranked

    def _fetch_leaderboard(self, time_period: str = "ALL", category: str = "OVERALL") -> list[dict]:
        traders = []
        try:
            rate_limiter.wait("polymarket")
            response = requests.get(
                f"{DATA_API}/v1/leaderboard",
                params={"timePeriod": time_period, "category": category, "orderBy": "PNL", "limit": 50, "offset": 0},
                timeout=15,
            )
            if response.status_code == 200:
                data = response.json()
                items = data if isinstance(data, list) else data.get("data", [])
                for item in items:
                    trader = self._parse_leaderboard_trader(item, time_period)
                    if trader:
                        traders.append(trader)
                log("info", f"Fetched {len(traders)} traders from Data API (period={time_period})", source="trader_scanner")
            else:
                log("warning", f"Data API leaderboard returned {response.status_code}", source="trader_scanner")
        except Exception as e:
            log("warning", f"Data API leaderboard failed: {e}", source="trader_scanner")
        return traders

    def _parse_leaderboard_trader(self, data: dict, time_period: str = "ALL") -> Optional[dict]:
        try:
            address = data.get("proxyWallet", data.get("user", ""))
            if not address:
                return None
            name = data.get("userName", "")
            if not name:
                name = f"{address[:6]}...{address[-4:]}"
            pnl = float(data.get("pnl", 0))
            vol = float(data.get("vol", 0))
            return {
                "wallet_address": address.lower(),
                "alias": name,
                "total_pnl": pnl,
                "pnl_30d": pnl if time_period == "MONTH" else 0,
                "pnl_7d": pnl if time_period == "WEEK" else 0,
                "win_rate": 0,
                "trade_count": 0,
                "avg_position_size": vol / max(int(data.get("rank", 1)), 1) if vol > 0 else 0,
                "market_categories": [],
                "active": True,
            }
        except Exception:
            return None

    def _seed_whales(self) -> list[dict]:
        traders = []
        for name, config in WHALE_WALLETS.items():
            traders.append({
                "wallet_address": config["address"].lower(),
                "alias": name,
                "total_pnl": float(config.get("profit", 0)),
                "pnl_30d": 0, "pnl_7d": 0, "win_rate": 0, "trade_count": 0,
                "avg_position_size": float(config.get("min_position_usd", 0)),
                "market_categories": [config.get("specialty", "general")],
                "profile_summary": f"Known whale — specialty: {config.get('specialty', 'general')}",
                "active": True,
            })
        return traders

    def _compute_ranks(self, traders: list[dict]) -> list[dict]:
        if not traders:
            return []
        max_pnl = max(abs(t.get("total_pnl", 0)) for t in traders) or 1
        max_trades = max(t.get("trade_count", 0) for t in traders) or 1
        for t in traders:
            pnl_score = max(0, t.get("total_pnl", 0)) / max_pnl
            wr_score = t.get("win_rate", 0) / 100 if t.get("win_rate", 0) > 1 else t.get("win_rate", 0)
            trade_score = t.get("trade_count", 0) / max_trades
            recency = 0.5
            if t.get("pnl_7d", 0) > 0:
                recency = 1.0
            elif t.get("pnl_30d", 0) > 0:
                recency = 0.7
            t["composite_rank"] = round(0.40 * pnl_score + 0.25 * wr_score + 0.20 * trade_score + 0.15 * recency, 4)
        traders.sort(key=lambda t: t.get("composite_rank", 0), reverse=True)
        return traders
