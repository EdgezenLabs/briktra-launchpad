# Supervisor QA Prompt

Role: **Supervisor** (`supervisor`)

## Environment
Live API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
UI: https://briktra.com/app/index.html

## Credentials
Confirm via hashed PROD login before deep testing.

## Flow Sheet focus
Log Expense, My Projects, site expenses — deny `/tenants`, `/employees` admin, deny project create unless policy allows

## Prefer UI Playwright with Flutter semantics (see tenant scripts)
