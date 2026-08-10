# Employee nav exposes Reports, Wallet, and Stock modules

## Summary
Employee role home and Profile show a left rail with **Reports**, **Wallet**, and **Stock** in addition to Home/Profile. Employee business scope is attendance / profile / notifications — financial reports and stock should be denied. Reports deep-link already confirmed fully open (see EMP-ISSUE-001).

## Steps to Reproduce
1. Login as employee
2. Observe left navigation on `#/employeeAttendanceTap` or `#/profile`
3. Open Reports from nav or `#/reportsDashboard`

## Expected Result
Employee nav limited to Home (attendance), Notifications/Profile only — no Reports/Wallet/Stock

## Actual Result
Rail includes Reports, Wallet, Stock. Reports opens Project Reports with Profitability/Manpower/Salaries tabs. Screenshots: `emp-01-after-login.png`, `emp-neg-Reports.png`

## Severity
High

## Priority
P1

## Screenshots Required
Yes

## Possible Root Cause
Shared shell nav not filtered by role=employee

## Acceptance Criteria
Employee cannot see or open Reports/Wallet/Stock; permission denied if deep-linked

**Flow Sheet:** Restricted — Open Reports / Employee home IA  
**Module:** RBAC / Navigation  
**Role:** employee  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Detected:** 2026-08-10T12:08:24.514Z
