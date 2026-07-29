# Login blocker — RESOLVED (hashing)

**Status:** Tenant login works with client-side PBKDF2 hash.  
**Remaining blocker for module testing:** QA API requires `X-Request-Signature`, but the web Flutter build has an empty signing secret (`$.b3t=""`), so data endpoints all return 401.

See `TENANT_LIVE_TEST.md` for full results and next steps.
