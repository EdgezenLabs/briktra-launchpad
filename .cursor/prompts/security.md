# Security QA Prompt

## Environment
Live API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`

## Auth
- PBKDF2 client hash required; plaintext rejected — **PASS** on PROD
- Logout must revoke access tokens — **FAIL** (ISSUE-002/010)
- Refresh token rotation — retest on PROD

## API
- `X-Request-Signature` required for direct module calls (harness)
- Live UI successfully loads modules (client signs or exempt path)
- Cross-tenant `GET /tenants/{other_id}` → expect 403

## Client
- Confirm live bundle API base is PROD (`cLy()` → b05vnm4akk.../prod)
- RBAC route guards for `/superAdmin`, `/tenants`

## Scripts
`node scripts/tenant-prod-regression.mjs`  
`docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`
