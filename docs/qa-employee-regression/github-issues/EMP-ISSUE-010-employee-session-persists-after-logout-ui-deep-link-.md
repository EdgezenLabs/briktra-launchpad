# Employee session persists after logout (UI deep link)

## Summary
After Profile → Logout, if the confirmation dialog is not confirmed, session remains. After confirmed Logout (lands on Login), deep-linking to `#/employeeAttendanceTap` does **not** force the Login screen — it shows an unauthenticated / plan-lock shell ("Attendance Locked" / Free Trial upgrade) instead of requiring credentials.

## Steps to Reproduce
1. Login as `employee.briktra@yopmail.com` / `Employee@123`
2. Open Profile → Logout → confirm **Logout** on dialog
3. Confirm URL is `#/login`
4. Navigate to `#/employeeAttendanceTap`

## Expected Result
Unauthenticated deep links redirect to Login

## Actual Result
`#/employeeAttendanceTap` renders "Attendance Locked / Free Trial" upgrade UI without requiring login. Screenshots: `emp-after-logout-confirmed.png`, `emp-post-logout-confirmed.png`

## Severity
High

## Priority
P1

## Screenshots Required
Yes — emp-after-logout-confirmed.png, emp-post-logout-confirmed.png, emp-logout-dialog.png

## Possible Root Cause
Route guard missing for employee attendance when session cleared; paywall shown instead of auth gate

## Acceptance Criteria
Any authenticated-only route redirects to Login when no valid session

**Flow Sheet:** Profile → Logout / Session  
**Module:** Authentication  
**Role:** employee  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Detected:** 2026-08-10T12:15:00.000Z
