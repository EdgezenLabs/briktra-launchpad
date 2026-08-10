# Supervisor can view Tenant Admins (Manage Users)

## Summary
`#/tenantAdmins` loads Tenant Admins list with Test Tenant Admin card and + FAB. Supervisor must not manage users/roles at tenant-admin level.

## Steps to Reproduce
1. Login as supervisor
2. Open `#/tenantAdmins`

## Expected Result
Access denied

## Actual Result
Tenant Admins directory + add FAB

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/sup-neg-TenantAdmins.png`

## Possible Root Cause
Missing RBAC on tenantAdmins route

## Acceptance Criteria
Supervisor cannot open Tenant Admins or create admins

**Flow Sheet:** Restricted — Manage Users  
**Module:** RBAC  
**Role:** supervisor
