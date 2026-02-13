"""
Conviction Engine — Scores market opportunities using Claude AI.
Uses Claude Sonnet 4 to analyze each opportunity and produce conviction scores.
Integrates Perplexity for real-time news context.
"""
from __future__ import annotations

import json
import anthropic
from datetime import datetime, timezone

from config import ANTHROPIC_API_KEY, PERPLEXITY_API_KEY, CONVICTION_CONFIG, PERPLEXITY_CONFIG
from db.queries import OpportunityQueries, PickQueries, MarketQueries, AuditLog
from utils.logger import log
from utils.rate_limiter import rate_limiter


class ConvictionEngine:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        self.model = CONVICTION_CONFIG["model"]
        self.min_score = CONVICTION_CONFIG["min_conviction_score"]
        self.min_rr = CONVICTION_CONFIG["min_risk_reward"]

    def score_opportunities(self) -> list[dict]:
        """Score unprocessed opportunities and create picks for high-conviction ones."""
        opps = OpportunityQueries.get_unprocessed(limit=20)
        if not opps:
            return []

        log("info", f"Scoring {len(opps)} opportunities with Claude", source="conviction_engine")

        # Skip markets that already have active picks
        active_picks = PickQueries.get_active_picks()
        active_market_ids = {p["market_id"] for p in active_picks}

        picks = []
        for opp in opps:
            if opp["market_id"] in active_market_ids:
                OpportunityQueries.mark_processed(opp["id"])
                continue

            try:
                result = self._analyze_opportunity(opp)
                OpportunityQueries.mark_processed(opp["id"])

                if result and result.get("conviction_score", 0) >= self.min_score:
                    if result.get("risk_reward", 0) >= self.min_rr:
                        pick = self._create_pick(opp, result)
                        if pick:
                            picks.append(pick)
                            active_market_ids.add(opp["market_id"])
                            log("info",
                                f"NEW PICK: {opp['market_id'][:50]} — {result['direction']} @ {result['entry_price']*100:.1f}¢ — score={result['conviction_score']}",
                                source="conviction_engine")
            except Exception as e:
                log("warning", f"Error scoring {opp['market_id'][:30]}: {e}", source="conviction_engine")
                OpportunityQueries.mark_processed(opp["id"])

        log("info", f"Produced {len(picks)} curated picks from {len(opps)} opportunities", source="conviction_engine")
        AuditLog.log("conviction", {"input": len(opps), "output": len(picks)}, source="conviction_engine")
        return picks

    def _analyze_opportunity(self, opp: dict) -> dict | None:
        """Use Claude to analyze a single opportunity."""
        market = MarketQueries.get_market_by_id(opp["market_id"])
        if not market:
            return None

        # Get Perplexity news context if available
        news_context = self._get_news_context(market["question"]) if PERPLEXITY_API_KEY else ""

        signal = opp.get("signal_data", {})
        if isinstance(signal, str):
            try:
                signal = json.loads(signal)
            except Exception:
                signal = {}

        prompt = f"""You are a professional prediction market analyst. Analyze this Polymarket opportunity and provide a trading recommendation.

MARKET:
- Question: {market['question']}
- Category: {market.get('category', 'unknown')}
- Current YES price: {market.get('yes_price', 0.5)}
- Current NO price: {market.get('no_price', 0.5)}
- Volume: ${market.get('volume', 0):,.0f}
- Liquidity: ${market.get('liquidity', 0):,.0f}
- End date: {market.get('end_date', 'unknown')}

SIGNAL DETECTED:
- Type: {opp.get('signal_type', 'unknown')}
- Strength: {opp.get('strength', 0)}
- Data: {json.dumps(signal)[:500]}

{f'RECENT NEWS CONTEXT:{chr(10)}{news_context}' if news_context else ''}

Respond with ONLY valid JSON (no markdown, no explanation):
{{
    "direction": "YES" or "NO",
    "conviction_score": 0-100,
    "entry_price": 0.01-0.99,
    "target_price": 0.01-0.99,
    "stop_loss": 0.01-0.99,
    "risk_reward": float,
    "time_horizon": "hours" or "days" or "weeks",
    "edge_explanation": "string explaining the edge",
    "telegram_summary": "1-2 sentence summary for Telegram",
    "confidence_factors": ["factor1", "factor2"],
    "risk_factors": ["risk1"],
    "position_size_suggestion": "small" or "medium" or "large"
}}"""

        try:
            rate_limiter.wait("anthropic")
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            text = response.content[0].text.strip()
            # Clean up potential markdown wrapper
            if text.startswith("```"):
                text = text.split("\n", 1)[1] if "\n" in text else text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                text = text.strip()
            return json.loads(text)
        except Exception as e:
            log("warning", f"Claude analysis failed: {e}", source="conviction_engine")
            return None

    def _get_news_context(self, question: str) -> str:
        """Get real-time news context from Perplexity."""
        if not PERPLEXITY_API_KEY:
            return ""
        try:
            import requests
            rate_limiter.wait("perplexity")
            response = requests.post(
                "https://api.perplexity.ai/chat/completions",
                headers={
                    "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": PERPLEXITY_CONFIG["model"],
                    "messages": [
                        {"role": "system", "content": "Provide brief, factual news context relevant to this prediction market question. Focus on recent developments that could affect the outcome. Be concise (max 200 words)."},
                        {"role": "user", "content": f"What are the latest developments relevant to: {question}"}
                    ],
                    "max_tokens": PERPLEXITY_CONFIG["max_tokens"],
                },
                timeout=15,
            )
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            log("warning", f"Perplexity failed: {e}", source="conviction_engine")
        return ""

    def _create_pick(self, opp: dict, analysis: dict) -> dict | None:
        """Create a curated pick from analysis results."""
        pick_data = {
            "market_id": opp["market_id"],
            "direction": analysis["direction"],
            "conviction_score": analysis["conviction_score"],
            "entry_price": analysis["entry_price"],
            "target_price": analysis["target_price"],
            "stop_loss": analysis["stop_loss"],
            "risk_reward": analysis.get("risk_reward", 0),
            "edge_explanation": analysis.get("edge_explanation", ""),
            "telegram_summary": analysis.get("telegram_summary", ""),
            "time_horizon": analysis.get("time_horizon", "days"),
            "confidence_factors": analysis.get("confidence_factors", []),
            "risk_factors": analysis.get("risk_factors", []),
            "position_size_suggestion": analysis.get("position_size_suggestion", "small"),
            "status": "active",
        }
        try:
            result = PickQueries.insert_pick(pick_data)
            return result
        except Exception as e:
            log("warning", f"Failed to save pick: {e}", source="conviction_engine")
            return None
