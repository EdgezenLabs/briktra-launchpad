# Manager Super Admin shell shows "Welcome, Super Admin"

## Summary
When manager opens `#/superAdmin`, UI renders Super Admin chrome: header **"Welcome, Super Admin"** and platform tabs (Tenants, Tenant Admins, Promos, Broadcaster, Plans, Usage, Banners, Referrals). Data call fails with permission error, but the chrome incorrectly elevates perceived role.

## Steps to Reproduce
1. Login as manager.briktra@yopmail.com
2. Navigate to `#/superAdmin`

## Expected Result
Hard deny / redirect — no Super Admin navigation chrome

## Actual Result
Welcome Super Admin header + admin tabs; center error "You don't have permission…"; + FAB still visible

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/mgr-neg-SuperAdmin.png`

## Possible Root Cause
Super Admin layout not role-gated; only data fetch checks permissions

## Acceptance Criteria
Manager never sees Super Admin shell; immediate deny without admin nav

**Flow Sheet:** Restricted — Super Admin  
**Module:** RBAC  
**Role:** manager  
**Detected:** 2026-08-10
