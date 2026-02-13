"""
Pick Resolver — Checks active picks and auto-closes on:
- Market resolution (W/L)
- Stop-loss hit
- Target hit
- Expired (past time horizon)
"""
from __future__ import annotations

import requests
from datetime import datetime, timezone, timedelta

from config import GAMMA_API
from db.queries import PickQueries, MarketQueries
from utils.logger import log
from utils.rate_limiter import rate_limiter


class PickResolver:
    def resolve_all(self) -> dict:
        """Check all active picks for resolution."""
        active = PickQueries.get_active_picks()
        if not active:
            return {"checked": 0}

        log("info", f"Checking {len(active)} active picks for resolution", source="pick_resolver")

        stats = {"checked": len(active), "resolved": 0, "stopped": 0, "target_hit": 0, "expired": 0, "total_closed": 0}

        for pick in active:
            result = self._check_pick(pick)
            if result:
                stats[result] += 1
                stats["total_closed"] += 1

        if stats["total_closed"] > 0:
            log("info",
                f"Closed {stats['total_closed']} picks: {stats['resolved']} resolved, {stats['stopped']} stopped, {stats['target_hit']} targets, {stats['expired']} expired",
                source="pick_resolver")

        return stats

    def _check_pick(self, pick: dict) -> str | None:
        """Check a single pick. Returns close reason or None."""
        market_id = pick["market_id"]

        # Get current market data
        market = MarketQueries.get_market_by_id(market_id)
        if not market:
            return None

        current_price = market.get("yes_price", 0.5) if pick["direction"] == "YES" else market.get("no_price", 0.5)

        # Check market resolution
        resolution = self._fetch_market_resolution(market_id)
        if resolution:
            self._close_resolved(pick, resolution)
            return "resolved"

        # Check stop-loss
        stop = pick.get("stop_loss", 0)
        if stop > 0:
            if pick["direction"] == "YES" and current_price <= stop:
                self._close_pick(pick, "stopped", current_price)
                log("info", f"STOPPED OUT: {market_id[:50]} — entry={pick['entry_price']*100:.1f}c exit={current_price*100:.1f}c", source="pick_resolver")
                return "stopped"
            elif pick["direction"] == "NO" and (1 - current_price) <= stop:
                self._close_pick(pick, "stopped", current_price)
                log("info", f"STOPPED OUT: {market_id[:50]} — entry={pick['entry_price']*100:.1f}c exit={current_price*100:.1f}c", source="pick_resolver")
                return "stopped"

        # Check target
        target = pick.get("target_price", 0)
        if target > 0:
            if pick["direction"] == "YES" and current_price >= target:
                self._close_pick(pick, "won", current_price)
                log("info", f"TARGET HIT: {market_id[:50]} — entry={pick['entry_price']*100:.1f}c exit={current_price*100:.1f}c", source="pick_resolver")
                return "target_hit"
            elif pick["direction"] == "NO" and (1 - current_price) >= target:
                self._close_pick(pick, "won", current_price)
                log("info", f"TARGET HIT: {market_id[:50]} — entry={pick['entry_price']*100:.1f}c exit={current_price*100:.1f}c", source="pick_resolver")
                return "target_hit"

        # Check expiry
        try:
            created_str = str(pick["created_at"]).replace("Z", "+00:00")
            created = datetime.fromisoformat(created_str)
            horizon = pick.get("time_horizon", "days")
            max_hours = {"hours": 12, "days": 72, "weeks": 336}.get(horizon, 72)
            if datetime.now(timezone.utc) - created > timedelta(hours=max_hours):
                self._close_pick(pick, "expired", current_price)
                return "expired"
        except Exception:
            pass

        return None

    def _close_resolved(self, pick, outcome):
        """Close a pick based on market resolution."""
        won = (pick["direction"] == outcome)
        exit_price = 1.0 if won else 0.0
        status = "won" if won else "lost"
        self._close_pick(pick, status, exit_price)

    def _close_pick(self, pick, status, exit_price):
        """Close a pick with given status and exit price."""
        try:
            PickQueries.close_pick(pick["id"], status, exit_price)
        except Exception as e:
            log("warning", f"Failed to close pick {pick['id']}: {e}", source="pick_resolver")

    def _fetch_market_resolution(self, market_id: str) -> str | None:
        """Check if a market has resolved via Gamma API."""
        try:
            rate_limiter.wait("polymarket")
            response = requests.get(
                f"{GAMMA_API}/markets/{market_id}",
                timeout=10,
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("resolved"):
                    return data.get("outcome", data.get("resolution", None))
        except Exception:
            pass
        return None
