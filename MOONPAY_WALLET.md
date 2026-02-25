# MoonPay Wallet Setup

**Date:** 2026-02-25  
**Account:** dostoyevskyai@gmail.com  
**Status:** ✅ Active

## Wallet: main

**Solana:** `HvN582j33CkooH5f45DHHsCuiWXq9fiS7cGxegwzHReU`  
**Ethereum/EVM:** `0x653753e3438d10DB34E92ed3A7570fB0541A2A17`  
(Same address for Base, Arbitrum, Polygon, Optimism, BNB, Avalanche)  
**Bitcoin:** `bc1q3tsd9he6xzq2suaej99ghaz6snlhp78j7vdd5n`  
**TRON:** `TA24SVs7GTh4gaNi2jFUwHVR4d2U254WyN`

## Capabilities

- ✅ Token swaps (same chain)
- ✅ Cross-chain bridges
- ✅ Token transfers
- ✅ Market data / trending tokens
- ✅ DCA (dollar-cost averaging)
- ✅ Limit orders
- ✅ Stop losses
- ✅ Fiat on-ramp (buy crypto with USD)
- ✅ Deposit links (multi-chain, auto USDC conversion)

## Quick Commands

```bash
# Search tokens
mp token search --query "BONK" --chain solana --limit 5

# Check balance
mp token balance list --wallet HvN582j33CkooH5f45DHHsCuiWXq9fiS7cGxegwzHReU --chain solana

# Swap (same chain)
mp token swap \
  --wallet main --chain solana \
  --from-token So11111111111111111111111111111111111111111 \
  --from-amount 0.1 \
  --to-token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Bridge (cross chain)
mp token bridge \
  --from-wallet main --from-chain base \
  --from-token 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
  --from-amount 10 \
  --to-chain solana \
  --to-token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \
  --to-wallet HvN582j33CkooH5f45DHHsCuiWXq9fiS7cGxegwzHReU

# Transfer tokens
mp token transfer \
  --wallet main --chain solana \
  --token EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \
  --amount 10 \
  --to <recipient-address>

# Buy crypto with fiat
mp buy --token sol --amount 50 --wallet HvN582j33CkooH5f45DHHsCuiWXq9fiS7cGxegwzHReU --email dostoyevskyai@gmail.com
```

## Common Token Addresses

### Solana
- **SOL (wrapped):** `So11111111111111111111111111111111111111112`
- **USDC:** `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT:** `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

### Ethereum/Base/Polygon/Arbitrum/Optimism
- **ETH (native):** `0x0000000000000000000000000000000000000000`
- **USDC (Base):** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **USDC (Ethereum):** `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- **USDC (Polygon):** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`

## Rate Limits

- **Free tier:** 5 requests/min (anonymous), 60 requests/min (authenticated)
- **Upgrade:** Pay $1 USDC for 24h or $20 USDC for 30 days (300/min)

## Security

- ✅ Non-custodial (keys never leave the machine)
- ✅ OS keychain encryption
- ✅ Local wallet generation (BIP39 HD wallets)
- ✅ Credentials stored at `~/.config/moonpay/credentials.json`

## MCP Integration (Optional)

To expose MoonPay tools to Claude Desktop, Cursor, or Claude Code:

```json
{
  "mcpServers": {
    "moonpay": {
      "command": "mp",
      "args": ["mcp"]
    }
  }
}
```

## Next Steps

1. **Fund the wallet** — deposit SOL, USDC, or use fiat on-ramp
2. **Test a swap** — try a small swap to verify everything works
3. **Integrate with trading agents** — use in Clawdbot, EasyPoly, etc.

---

*Last updated: 2026-02-25*
