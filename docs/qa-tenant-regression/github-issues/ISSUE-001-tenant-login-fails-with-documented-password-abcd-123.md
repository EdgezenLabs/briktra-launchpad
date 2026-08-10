# ISSUE-001 — Tenant login Abcd@123

## Status: **CLOSED — PASS**

## Resolution
UI login with `tenant@yopmail.com` / `Abcd@123` **PASS** on production.

Prior FAIL was caused by QA automation calling the **wrong API**:
- Wrong: `bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa`
- Correct (live app): `b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`

Confirmed 2026-08-10 via Playwright UI login → Dashboard.

User: Test Tenant Admin · tenant_admin · TenantAdmin Builders · PREMIUM
