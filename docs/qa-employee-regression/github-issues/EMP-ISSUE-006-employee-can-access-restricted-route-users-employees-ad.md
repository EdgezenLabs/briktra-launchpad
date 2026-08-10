# Employee can access restricted route: Users / Employees admin

## Summary
**Reclassified:** `#/employees` for employee role correctly shows a lock screen ("The employee directory is only available to managers and above") with **Go Back**. Content access is denied. This is **PASS** for permission messaging (not a privilege leak).

## Steps to Reproduce
1. Login as employee (`employee.briktra@yopmail.com` / `Employee@123`)
2. Open https://briktra.com/app/index.html#/employees

## Expected Result
Permission denied for employee directory

## Actual Result
Lock UI: "Employee Directory — The employee directory is only available to managers and above." + Go Back. Screenshot: `emp-neg-Users-Employees.png`

## Severity
Low (informational / false positive from automated shell-stay heuristic)

## Priority
P3

## Screenshots Required
emp-neg-Users-Employees.png

## Possible Root Cause
N/A — expected deny path works

## Acceptance Criteria
Keep clear deny; optionally redirect to Home instead of shell title "Employees (4)"

**Status:** CLOSED — False positive  
**Flow Sheet:** Restricted — Users  
**Module:** RBAC  
**Role:** employee  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Detected:** 2026-08-10T12:08:24.514Z
