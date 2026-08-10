# Supervisor QA Prompt

Role: **Supervisor** (`supervisor`) — Site Supervisor

## Environment
- UI: https://briktra.com/app/index.html
- API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`

## Credentials
- `supervisior.briktra@yopmail.com` / `Supervisior@123`  
  (spelling as stored in PROD — note “supervisior”)

## Site scenario
Arrive → Mark Attendance → Add Labour → Upload Photos → Daily Progress → Create Expense → Upload Bills → View Assigned Project → Logout

## Restricted (expect DENY)
Delete/Create Project, Delete Company / Create Tenant, Manage Subscription, Manage Users, Super Admin, Company Settings

## Known open defects
See `docs/qa-supervisor-regression/github-issues/` — P0 RBAC + no project assignment + expenses route remap

## Scripts
`node scripts/supervisor-prod-regression.mjs`

## Report
`docs/qa-supervisor-regression/SUPERVISOR_REGRESSION_REPORT.md`
