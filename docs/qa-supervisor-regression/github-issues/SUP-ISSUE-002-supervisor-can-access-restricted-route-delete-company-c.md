# Supervisor can open Create Tenant form

## Summary
Supervisor deep-link `#/createTenant` shows Create Tenant form (Tenant Name + Create Tenant button). Site supervisors must not create companies/tenants.

## Steps to Reproduce
1. Login as supervisor
2. Navigate to `#/createTenant`

## Expected Result
Access denied

## Actual Result
Full Create Tenant UI

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/sup-neg-Create-Tenant.png`

## Possible Root Cause
No client/server RBAC on tenant create route

## Acceptance Criteria
Supervisor cannot view or submit Create Tenant; API returns 403

**Flow Sheet:** Restricted — Delete Company / Create Tenant  
**Module:** RBAC  
**Role:** supervisor
