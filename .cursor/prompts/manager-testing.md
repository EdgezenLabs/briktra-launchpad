# Manager QA Prompt

Role: **Manager** (`manager`)

## Environment
Live API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
UI: https://briktra.com/app/index.html

## Credentials
Confirm via hashed PROD login before deep testing (do not assume QA passwords).

## Flow Sheet focus
Dashboard (attendance daytime), Projects, Reports (expense), Add Attendance — deny tenant CRUD, deny tenant_admin elevation

## Prefer UI
`scripts/ui-login-semantics.mjs` pattern (Flutter semantics Login button)

## Defect template
Same as tenant-testing.md — file to `docs/qa-tenant-regression/github-issues/`
