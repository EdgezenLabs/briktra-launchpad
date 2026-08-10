# Employee can access restricted route: Company Settings

## Summary
Employee deep-link stayed on https://briktra.com/app/index.html#/company-details for restricted action "Company Settings"

## Steps to Reproduce
1. Login as employee (employee.briktra@yopmail.com)
2. Open https://briktra.com/app/index.html#/company-details
3. Observe UI

## Expected Result
Permission denied / redirect / lock — no admin CRUD

## Actual Result
Remained on https://briktra.com/app/index.html#/company-details. Semantics: BackComplete Company ProfileSkipHome
Tab 1 of 5Reports
Tab 2 of 5Wallet
Tab 3 of 5Stock
Tab 4 of 5Profile
Tab 5 of 5Complete your company profile to unlock all featuresUpload LogoOptional - 15 characters15 characters rem

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — emp-neg-Company-Settings.png

## Possible Root Cause
Missing RBAC route guard for employee role

## Acceptance Criteria
Employee cannot use admin-only screens; clear permission denied

**Flow Sheet:** Restricted — Company Settings
**Module:** RBAC
**Role:** employee
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod
**Detected:** 2026-08-10T12:08:28.105Z