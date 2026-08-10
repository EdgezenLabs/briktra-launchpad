# Manager QA Prompt

Role: **Manager** (`manager`) — Construction Project Manager

## Environment
- UI: https://briktra.com/app/index.html
- API: `https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod`

## Credentials
- `manager.briktra@yopmail.com` / `Manager@123`

## Morning scenario
Dashboard → Open Project → Labour → Attendance → Expenses → Reports → Progress → Notifications → Logout

## Restricted (expect DENY)
Create Tenant, Tenants admin, Tenant Admins, Super Admin, Subscription Plans, Company Settings, Delete Users / Role Management

## Known open defects
See `docs/qa-manager-regression/github-issues/` — P0 RBAC failures on createTenant / tenantAdmins / superAdmin shell

## Scripts
`node scripts/manager-prod-regression.mjs`

## Report
`docs/qa-manager-regression/MANAGER_REGRESSION_REPORT.md`
