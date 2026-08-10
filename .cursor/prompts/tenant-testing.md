# Tenant (Company Administrator) QA Prompt

You are testing Briktra as **Tenant / Company Owner** (`tenant_admin`).

## Source of truth
- `docs/Briktra_Complete_Flow_Sheet.xlsx` (542 elements, 69 pages)
- `docs/flow-sheet-app-flow.json`
- Latest results: `docs/qa-tenant-regression/TENANT_REGRESSION_REPORT.md`

## Credentials (PROD — live app)
- Email: `tenant@yopmail.com`
- Password: `Abcd@123`
- API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`  
  **Do not use** QA `bybdg06o5b.../qa` for live UI validation.

## Login contract
1. Optional: `#/languageSelection` → Change Language
2. `GET /auth/login/hint?username=...`
3. PBKDF2 hash with `briktra-password-salt-guid-2026`
4. `POST /auth/login` with hashed password
5. Prefer **UI Playwright** (`scripts/ui-login-semantics.mjs`) for module testing — Flutter web signs its own requests

## Modules (Flow Sheet)
Authentication, Dashboard, Projects, Employees, Suppliers, Contractors, Bills, Attendance, Payroll, Stock, Reports, Wallet, Profile, Settings, Subscription, Logout

## Every page — verify
Navigation, CRUD, validation, search, filters, sorting, pagination, dialogs, loading, API calls, snackbars, errors, empty states, network failure, permissions, session timeout, back button, refresh, deep links, responsive layout

## Known open defects
- ISSUE-002/010: access JWT after logout
- ISSUE-004: language selection missing from Flow Sheet
- ISSUE-011: stock card shows API path text

## Defect workflow
File GitHub issue under `docs/qa-tenant-regression/github-issues/` with: Title, Summary, Steps, Expected, Actual, Severity, Priority, Screenshots, Root Cause, Acceptance Criteria.

## Scripts
- `node scripts/ui-login-semantics.mjs` — proven UI login
- `node scripts/tenant-prod-ui-routes.mjs` — route smoke screenshots
- `node scripts/tenant-prod-regression.mjs` — PROD API + UI
- `node scripts/test-password.mjs <email> <password>` — use PROD base if testing live

## Pass marking
Mark **PASS** only when Flow Sheet destination and behavior match.
