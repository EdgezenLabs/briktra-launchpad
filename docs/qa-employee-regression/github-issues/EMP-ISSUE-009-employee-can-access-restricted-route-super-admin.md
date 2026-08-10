# Employee can access restricted route: Super Admin

## Summary
Employee deep-link stayed on https://briktra.com/app/index.html#/superAdmin for restricted action "Super Admin"

## Steps to Reproduce
1. Login as employee (employee.briktra@yopmail.com)
2. Open https://briktra.com/app/index.html#/superAdmin
3. Observe UI

## Expected Result
Permission denied / redirect / lock — no admin CRUD

## Actual Result
Remained on https://briktra.com/app/index.html#/superAdmin. Semantics: Welcome, Super AdminShow menuHome
Tab 1 of 5Reports
Tab 2 of 5Wallet
Tab 3 of 5Stock
Tab 4 of 5Profile
Tab 5 of 5RetryShow menu | Welcome, Super AdminShow menuHome
Tab 1 of 5Reports
Tab 2 of 5Wallet
Tab 3 of 5Stock
Tab 4

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — emp-neg-SuperAdmin.png

## Possible Root Cause
Missing RBAC route guard for employee role

## Acceptance Criteria
Employee cannot use admin-only screens; clear permission denied

**Flow Sheet:** Restricted — Super Admin
**Module:** RBAC
**Role:** employee
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod
**Detected:** 2026-08-10T12:09:04.600Z