# Manager can view Tenant Admins directory (Role Management)

## Summary
Manager deep-link `#/tenantAdmins` loads **Tenant Admins** list showing `Test Tenant Admin` / tenant@yopmail.com with FAB (+) to add admins. Role management is tenant_admin / platform-admin only.

## Steps to Reproduce
1. Login as manager
2. Open `#/tenantAdmins`

## Expected Result
Permission denied — no admin directory or create FAB

## Actual Result
Tenant Admins page with admin card and orange + FAB

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/mgr-neg-TenantAdmins.png`

## Possible Root Cause
Route not gated by role; list API returns data to manager

## Acceptance Criteria
Manager receives 403 / deny UI; no Tenant Admins CRUD

**Flow Sheet:** Restricted — Role Management  
**Module:** RBAC  
**Role:** manager  
**Detected:** 2026-08-10
