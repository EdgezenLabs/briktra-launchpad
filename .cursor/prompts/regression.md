# Regression QA Prompt

Run full role matrix against Flow Sheet after any release.

## Environment
- **Live UI:** https://briktra.com/app/index.html
- **Live API:** `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`
- Do **not** use QA API for live sign-off unless explicitly testing QA.

## Order
1. Tenant (`tenant-testing.md`) — `tenant@yopmail.com` / `Abcd@123`
2. Manager
3. Supervisor
4. Employee

## Artifacts
- `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md` (canonical)
- `docs/qa-tenant-regression/screenshots/prod-*.png`
- Per-role docs under `docs/role-exploration/`
- GitHub issues: `docs/qa-tenant-regression/github-issues/`

## Gates
- **CONDITIONAL GO** if smoke routes PASS and only P2 leftovers
- **NO-GO** if P0/P1 auth, data loss, or cross-tenant leak open
- Currently open P1: logout token revoke (ISSUE-002/010)
