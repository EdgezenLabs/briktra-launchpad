# Login blocker — RESOLVED (PROD)

**Status:** Tenant UI + PROD API login works with `tenant@yopmail.com` / `Abcd@123`.

## Resolution (2026-08-10)

| Item | Detail |
|------|--------|
| Credentials | `tenant@yopmail.com` / `Abcd@123` |
| Live API | `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod` |
| Obsolete API | `https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa` |
| Role | `tenant_admin` — Test Tenant Admin — TenantAdmin Builders — PREMIUM |

Prior 401s were from calling **QA** instead of **PROD**.

## Remaining blockers for full sign-off

1. Deep Flow Sheet CRUD / every-button testing still pending  
2. ISSUE-002/010 — logout does not revoke access JWT  
3. ISSUE-011 — stock card shows API path text  
4. Direct API module probes need signing secret (UI already works)

See: `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`
