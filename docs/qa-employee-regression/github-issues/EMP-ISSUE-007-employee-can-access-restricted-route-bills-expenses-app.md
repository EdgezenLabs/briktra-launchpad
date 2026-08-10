# Employee can access restricted route: Bills / Expenses Approval related

## Summary
Employee deep-link stayed on https://briktra.com/app/index.html#/billsList for restricted action "Bills / Expenses Approval related"

## Steps to Reproduce
1. Login as employee (employee.briktra@yopmail.com)
2. Open https://briktra.com/app/index.html#/billsList
3. Observe UI

## Expected Result
Permission denied / redirect / lock — no admin CRUD

## Actual Result
Remained on https://briktra.com/app/index.html#/billsList. Semantics: BackBills ManagementFiltersStatus
AllType
AllCreate BillNo bills found | BackBills ManagementFiltersStatus
AllType
AllCreate BillNo bills found | BackBills ManagementFiltersStatus
AllType
AllCreate BillNo bills found | B

## Severity
High

## Priority
P1

## Screenshots Required
Yes — emp-neg-Bills.png

## Possible Root Cause
Missing RBAC route guard for employee role

## Acceptance Criteria
Employee cannot use admin-only screens; clear permission denied

**Flow Sheet:** Restricted — Bills / Expenses Approval related
**Module:** RBAC
**Role:** employee
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod
**Detected:** 2026-08-10T12:08:53.860Z