# Manager can open Create Tenant form (RBAC bypass)

## Summary
Construction Project Manager (`role=manager`) deep-linking to `#/createTenant` loads a full **Create Tenant** form (Tenant Name field + Create Tenant button) instead of permission denied. Managers must not create tenants.

## Steps to Reproduce
1. Login as manager.briktra@yopmail.com / Manager@123
2. Navigate to https://briktra.com/app/index.html#/createTenant
3. Observe page content

## Expected Result
Permission denied / redirect to Dashboard / lock screen — no tenant creation UI

## Actual Result
Header "Create Tenant"; editable Tenant Name field; orange "Create Tenant" submit button available

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/mgr-neg-Create-Tenant.png`

## Possible Root Cause
Missing client route guard and/or server authorization for manager on tenant create endpoints

## Acceptance Criteria
- Manager cannot view or submit Create Tenant
- API POST /tenants returns 403 for manager

**Flow Sheet:** Restricted — Create Tenant / Role Management  
**Module:** RBAC / Tenants  
**Role:** manager  
**Detected:** 2026-08-10
