# Supervisor can open Create Project (RBAC / policy)

## Summary
Site Supervisor (`role=supervisor`) deep-linking to `#/createProject` loads the full Create Project form (name, budget, map, supervisor picker). Per Flow Sheet / role matrix, supervisors should not create projects unless tenant policy explicitly allows — default expect DENY. Dashboard also exposes "Add Projects" quick action.

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com / Supervisior@123
2. Open https://briktra.com/app/index.html#/createProject

## Expected Result
Permission denied / redirect — no create project form (unless policy allows; document policy if intentional)

## Actual Result
Full Create Project wizard with map and required Budget/Location fields

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/sup-neg-Create-Project.png`, `sup-01-after-login.png` (Add Projects tile)

## Possible Root Cause
Missing role guard; quick actions not filtered by role

## Acceptance Criteria
Supervisor cannot create projects by default; UI hides Add Projects if denied

**Flow Sheet:** Create Project (restricted for supervisor)  
**Module:** RBAC / Projects  
**Role:** supervisor
