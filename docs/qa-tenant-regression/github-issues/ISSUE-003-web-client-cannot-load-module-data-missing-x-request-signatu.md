# ISSUE-003 — API signature requirement (UPDATED)

## Status: **RECLASSIFIED — not a UI login/module blocker**

## Summary
Direct API calls without `X-Request-Signature` return 401 on both QA and PROD. However, the **live web UI successfully loads** Projects, Employees, Bills, Stock, etc. after login — so the Flutter web client is able to call modules (signing configured in live build, or alternate path).

## Impact
- Blocks **headless API-only** automation unless signing secret is provided
- Does **not** block Tenant UI manual/Playwright testing on briktra.com

## Acceptance for API automation
Provide `BRIKTRA_SIGNING_SECRET` for scripts, or document how web obtains signature.

**Module:** Platform / API
