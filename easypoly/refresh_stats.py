#!/usr/bin/env python3
"""
Refresh 30-day stats for all traders in ep_tracked_traders.
Scrapes each trader's Polymarket profile page to get the REAL 1M PnL
(same number shown on polymarket.com), plus trade activity from the data API.

Usage:
    python3 refresh_stats.py
    python3 refresh_stats.py --dry-run
"""

import argparse
import asyncio
import json
import os
import re
from datetime import datetime, timezone, timedelta

import httpx
from supabase import create_client

DATA_API = "https://data-api.polymarket.com"
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ljseawnwxbkrejwysrey.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

REQUEST_DELAY = 0.5  # be polite to Polymarket


async def fetch_real_pnl(client: httpx.AsyncClient, address: str) -> dict:
    """Scrape Polymarket profile page to get real 1M PnL from portfolio-pnl series."""
    result = {"pnl_1m": None, "portfolio_start": None, "portfolio_end": None}
    try:
        resp = await client.get(
            f"https://polymarket.com/profile/{address}",
            follow_redirects=True,
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"},
        )
        if resp.status_code != 200:
            return result

        match = re.search(r'\{"props":\{"pageProps"', resp.text)
        if not match:
            return result

        start = match.start()
        end = resp.text.find("</script>", start)
        nd = json.loads(resp.text[start:end])

        queries = nd.get("props", {}).get("pageProps", {}).get("dehydratedState", {}).get("queries", [])
        for q in queries:
            key_str = json.dumps(q.get("queryKey", ""))
            if "portfolio-pnl" in key_str and "1M" in key_str:
                data = q["state"]["data"]
                if data and len(data) >= 2:
                    first = data[0]["p"]
                    last = data[-1]["p"]
                    result["pnl_1m"] = last - first
                    result["portfolio_start"] = first
                    result["portfolio_end"] = last
                break
    except Exception as e:
        result["error"] = str(e)

    return result


async def fetch_activity(client: httpx.AsyncClient, address: str, days: int = 30) -> dict:
    """Fetch trade activity stats from Polymarket data API."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    cutoff_ts = int(cutoff.timestamp())

    stats = {
        "trades_count": 0,
        "markets_traded": 0,
        "total_volume": 0.0,
        "wins": 0,
        "losses": 0,
        "win_rate_30d": 0.0,
    }

    try:
        # Trades
        resp = await client.get(f"{DATA_API}/trades", params={"user": address, "limit": 1000})
        resp.raise_for_status()
        all_trades = resp.json()
        trades = [t for t in all_trades if int(t.get("timestamp", 0)) >= cutoff_ts]
        stats["trades_count"] = len(trades)
        markets = set(t.get("conditionId") for t in trades if t.get("conditionId"))
        stats["markets_traded"] = len(markets)
        for trade in trades:
            stats["total_volume"] += float(trade.get("size", 0)) * float(trade.get("price", 1))

        await asyncio.sleep(REQUEST_DELAY)

        # Closed positions (resolved markets)
        resp = await client.get(f"{DATA_API}/closed-positions", params={"user": address, "limit": 1000})
        resp.raise_for_status()
        all_closed = resp.json()
        closed = [p for p in all_closed if int(p.get("timestamp", 0)) >= cutoff_ts]
        for pos in closed:
            pnl = float(pos.get("realizedPnl", 0))
            if pnl > 0:
                stats["wins"] += 1
            elif pnl < 0:
                stats["losses"] += 1

        await asyncio.sleep(REQUEST_DELAY)

        # Open positions — count profitable vs losing for realistic win rate
        resp = await client.get(f"{DATA_API}/positions", params={"user": address, "limit": 500})
        resp.raise_for_status()
        open_positions = resp.json()
        for pos in open_positions:
            cash_pnl = float(pos.get("cashPnl", 0))
            if cash_pnl > 0:
                stats["wins"] += 1
            elif cash_pnl < 0:
                stats["losses"] += 1

        total = stats["wins"] + stats["losses"]
        if total > 0:
            stats["win_rate_30d"] = (stats["wins"] / total) * 100

    except Exception as e:
        stats["error"] = str(e)

    return stats


def classify_bankroll_tier(volume: float, trade_count: int) -> str:
    if trade_count <= 0:
        return "micro"
    avg = volume / trade_count
    if avg >= 20_000:
        return "whale"
    if avg >= 2_000:
        return "mid"
    if avg >= 200:
        return "small"
    return "micro"


def classify_trading_style(trade_count: int, win_rate: float, avg_size: float) -> str:
    if avg_size >= 10_000:
        return "whale"
    if trade_count <= 10 and win_rate >= 65:
        return "sniper"
    if trade_count >= 50:
        return "degen"
    return "grinder"


async def main():
    parser = argparse.ArgumentParser(description="Refresh trader stats from Polymarket")
    parser.add_argument("--dry-run", action="store_true", help="Print changes without writing")
    parser.add_argument("--days", type=int, default=30, help="Lookback days (default: 30)")
    args = parser.parse_args()

    if not args.dry_run and not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY env var")
        return

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    result = sb.table("ep_tracked_traders").select("id, alias, wallet_address, source").execute()
    traders = result.data
    print(f"Refreshing {len(traders)} traders (real 1M PnL + activity)...\n")

    now = datetime.now(timezone.utc).isoformat()
    updated = 0
    deactivated = 0

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, trader in enumerate(traders, 1):
            name = trader.get("alias") or trader["wallet_address"][:12]
            address = trader["wallet_address"]

            # Get real PnL from profile page
            pnl_data = await fetch_real_pnl(client, address)
            await asyncio.sleep(REQUEST_DELAY)

            # Get activity stats from data API
            activity = await fetch_activity(client, address, args.days)
            await asyncio.sleep(REQUEST_DELAY)

            pnl_1m = pnl_data.get("pnl_1m")
            portfolio_start = pnl_data.get("portfolio_start", 0) or 0
            trades_count = activity["trades_count"]
            markets = activity["markets_traded"]
            volume = activity["total_volume"]
            wr = activity["win_rate_30d"]
            avg_size = volume / trades_count if trades_count > 0 else 0

            # ROI = 1M PnL / portfolio value at start of month, capped at 500%
            roi = 0.0
            if pnl_1m is not None and portfolio_start > 100:
                # Only use portfolio_start if it's meaningful (>$100)
                roi = (pnl_1m / portfolio_start) * 100
            elif pnl_1m is not None and volume > 0:
                roi = (pnl_1m / volume) * 100
            # No cap — if someone made 2300% ROI, show it

            # Active = has trades and positive 1M PnL
            active = trades_count >= 5 and (pnl_1m is None or pnl_1m > 0)
            if pnl_1m is not None and pnl_1m <= 0:
                active = False

            status = "GEM" if active and roi > 5 else "ACTIVE" if active else "DOWN"
            marker = "" if active else " <<<<<"
            pnl_str = f"${pnl_1m:>12,.0f}" if pnl_1m is not None else "     N/A    "

            print(f"  [{i:>3d}/100] {name:25s} ROI={roi:>8.1f}%  1M_PnL={pnl_str}  trades={trades_count:>4d}  markets={markets:>3d}  {status}{marker}")

            if args.dry_run:
                if not active:
                    deactivated += 1
                updated += 1
                continue

            # Consistency score
            diversity = min(markets / 10, 1.0) * 100
            activity_score = min(trades_count / 20, 1.0) * 100
            consistency = diversity * 0.5 + activity_score * 0.5

            meta = {
                "consistency_score": round(consistency, 2),
                "pnl_1m": round(pnl_1m, 2) if pnl_1m is not None else None,
                "portfolio_start_1m": round(portfolio_start, 2),
                "refreshed_at": now,
            }

            update = {
                "roi": round(roi, 2),
                "win_rate": round(wr, 2),
                "total_pnl": round(pnl_1m, 2) if pnl_1m is not None else 0,
                "trade_count": trades_count,
                "markets_traded": markets,
                "estimated_bankroll": round(portfolio_start, 2) if portfolio_start > 0 else round(volume, 2),
                "avg_position_size": round(avg_size, 2),
                "bankroll_tier": classify_bankroll_tier(volume, trades_count),
                "trading_style": classify_trading_style(trades_count, wr, avg_size),
                "active": active,
                "last_updated": now,
                "profile_summary": json.dumps(meta),
            }

            try:
                sb.table("ep_tracked_traders").update(update).eq("id", trader["id"]).execute()
                updated += 1
                if not active:
                    deactivated += 1
            except Exception as e:
                print(f"    DB ERROR: {e}")

            await asyncio.sleep(REQUEST_DELAY)

    gems = updated - deactivated
    print(f"\nDone! {updated}/{len(traders)} updated. {gems} gems, {deactivated} marked down/inactive.")


if __name__ == "__main__":
    asyncio.run(main())
