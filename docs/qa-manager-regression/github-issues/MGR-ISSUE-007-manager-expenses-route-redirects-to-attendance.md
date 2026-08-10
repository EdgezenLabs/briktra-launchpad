# Manager #/expenses deep link redirects to Attendance

## Summary
Navigating to `#/expenses` while logged in as manager lands on `#/addAttendance` (Attendance Overview) instead of Expenses. Approving/reviewing expenses (morning scenario) cannot be reached via this path.

## Steps to Reproduce
1. Login as manager.briktra@yopmail.com / Manager@123
2. Go to https://briktra.com/app/index.html#/expenses
3. Observe URL and screen

## Expected Result
Expenses module (project-scoped expenses list / approve flow) per Flow Sheet

## Actual Result
URL becomes `#/addAttendance`; UI shows Attendance Overview empty state

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/mgr-route-Expenses.png`

## Possible Root Cause
Invalid/unregistered `/expenses` route falls through to attendance; or intentional remap without Flow Sheet update; Quick Expense uses different route

## Acceptance Criteria
- `#/expenses` opens expenses UI, or Flow Sheet documents correct manager expense route
- Manager can complete “Approve Expenses” morning step

**Flow Sheet:** Expenses(Project Scope) / Quick Expense  
**Module:** Expenses  
**Role:** manager  
**Detected:** 2026-08-10
