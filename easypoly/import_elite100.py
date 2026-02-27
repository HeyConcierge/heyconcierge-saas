#!/usr/bin/env python3
"""
Import Elite 100 traders from CSV into ep_tracked_traders.
Replaces stale scanner data, keeps user-added traders.

Usage:
    python3 import_elite100.py
    python3 import_elite100.py --dry-run
    python3 import_elite100.py --csv path/to/elite_100.csv
"""

import argparse
import csv
import json
import os
from datetime import datetime, timezone

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ljseawnwxbkrejwysrey.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Default CSV path
DEFAULT_CSV = os.path.join(os.path.dirname(__file__), "elite_100_CORRECTED.csv")


def classify_bankroll_tier(volume: float, trade_count: int) -> str:
    """Classify based on average trade size."""
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
    """Classify trading style from metrics."""
    if avg_size >= 10_000:
        return "whale"
    if trade_count <= 10 and win_rate >= 65:
        return "sniper"
    if trade_count >= 50:
        return "degen"
    return "grinder"


def compute_gem_score(row: dict) -> float:
    """
    Gem score surfaces consistent, copyable, efficient traders.
    Factors: ROI efficiency, consistency, activity, diversity, copyability.
    """
    roi = float(row.get("roi_30d", 0))
    consistency = float(row.get("consistency_score", 0))
    trades = int(row.get("trades_30d", 0))
    markets = int(row.get("markets_traded", 0))
    volume = float(row.get("total_volume_30d", 0))

    roi_norm = min(roi / 200.0, 1.0)
    consistency_norm = consistency / 100.0
    activity_norm = min(trades / 500.0, 1.0)
    diversity_norm = min(markets / 50.0, 1.0)

    if volume < 100_000:
        copyability = 1.0
    elif volume < 1_000_000:
        copyability = 0.8
    else:
        copyability = 0.6

    return (
        roi_norm * 0.25
        + consistency_norm * 0.25
        + activity_norm * 0.20
        + diversity_norm * 0.15
        + copyability * 0.15
    )


def main():
    parser = argparse.ArgumentParser(description="Import Elite 100 into ep_tracked_traders")
    parser.add_argument("--csv", default=DEFAULT_CSV, help="Path to Elite 100 CSV")
    parser.add_argument("--dry-run", action="store_true", help="Print changes without writing")
    args = parser.parse_args()

    # Read CSV
    with open(args.csv) as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    print(f"Read {len(rows)} traders from {args.csv}")

    if args.dry_run:
        print("\n--- DRY RUN: would delete non-user-added rows and insert elite 100 ---")
        for i, row in enumerate(rows[:10], 1):
            gem = compute_gem_score(row)
            tier = classify_bankroll_tier(float(row["total_volume_30d"]), int(row["trades_30d"]))
            print(f"  #{i} {row['name']:25s} gem={gem:.3f}  roi={float(row['roi_30d']):8.1f}%  tier={tier:6s}  vol=${float(row['total_volume_30d']):>12,.0f}")
        print(f"  ... and {len(rows) - 10} more")
        # Show gem ranking
        scored = [(row["name"], compute_gem_score(row)) for row in rows]
        scored.sort(key=lambda x: x[1], reverse=True)
        print(f"\n--- Top 10 by GEM SCORE (best to copy) ---")
        for i, (name, gem) in enumerate(scored[:10], 1):
            print(f"  #{i} {name:25s} gem={gem:.3f}")
        return

    if not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_SERVICE_KEY env var")
        return

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Step 1: Count existing rows by source
    existing = sb.table("ep_tracked_traders").select("id, source, wallet_address").execute()
    user_added = [r for r in existing.data if r.get("source") == "user_added"]
    scanner = [r for r in existing.data if r.get("source") != "user_added"]
    print(f"Existing: {len(scanner)} scanner rows (will delete), {len(user_added)} user-added (will keep)")

    # Step 2: Delete related trades, then non-user-added traders
    scanner_ids = [r["id"] for r in scanner]
    if scanner_ids:
        # First delete trades referencing these traders
        for i in range(0, len(scanner_ids), 50):
            batch = scanner_ids[i:i+50]
            sb.table("ep_trader_trades").delete().in_("trader_id", batch).execute()
        print(f"Deleted trades for {len(scanner_ids)} stale traders")
        # Now delete the traders themselves
        for i in range(0, len(scanner_ids), 50):
            batch = scanner_ids[i:i+50]
            sb.table("ep_tracked_traders").delete().in_("id", batch).execute()
        print(f"Deleted {len(scanner_ids)} stale scanner rows")

    # Step 3: Compute max elite_score for normalization
    max_elite = max(float(r.get("elite_score", 0)) for r in rows) or 1.0

    # Step 4: Insert elite 100
    now = datetime.now(timezone.utc).isoformat()
    inserted = 0

    for row in rows:
        volume = float(row.get("total_volume_30d", 0))
        trade_count = int(row.get("trades_30d", 0))
        win_rate = float(row.get("win_rate_30d", 0))
        avg_size = volume / trade_count if trade_count > 0 else 0
        elite_score = float(row.get("elite_score", 0))
        gem = compute_gem_score(row)

        record = {
            "wallet_address": row["address"].lower(),
            "alias": row["name"] if row["name"] != "Unknown" else None,
            "roi": round(float(row.get("roi_30d", 0)), 2),
            "win_rate": round(win_rate, 2),
            "total_pnl": round(float(row.get("net_profit_30d", 0)), 2),
            "trade_count": trade_count,
            "markets_traded": int(row.get("markets_traded", 0)),
            "estimated_bankroll": round(volume, 2),
            "avg_position_size": round(avg_size, 2),
            "composite_rank": round((elite_score / max_elite) * 999, 0),
            "bankroll_tier": classify_bankroll_tier(volume, trade_count),
            "trading_style": classify_trading_style(trade_count, win_rate, avg_size),
            "source": "elite100",
            "active": True,
            "last_updated": now,
        }
        # Store consistency_score in profile_summary as JSON metadata
        # (avoids needing new DB columns — gem_score computed at API runtime)
        meta = {
            "consistency_score": round(float(row.get("consistency_score", 0)), 2),
            "elite_score": round(elite_score, 2),
            "gem_score": round(gem, 4),
            "elite_rank": int(row.get("rank", 0)),
        }
        record["profile_summary"] = json.dumps(meta)

        try:
            sb.table("ep_tracked_traders").upsert(
                record, on_conflict="wallet_address"
            ).execute()
            inserted += 1
        except Exception as e:
            print(f"  ERROR inserting {row['name']}: {e}")

    print(f"\nInserted/updated {inserted} elite traders")
    print(f"Total in ep_tracked_traders: {inserted + len(user_added)} ({len(user_added)} user-added + {inserted} elite)")


if __name__ == "__main__":
    main()
