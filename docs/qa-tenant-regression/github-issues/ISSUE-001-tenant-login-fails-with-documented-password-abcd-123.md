# Tenant login fails with documented password Abcd@123

## Summary
Company Owner account tenant@yopmail.com cannot authenticate with password Abcd@123 as specified in QA test plan. API returns 401 Invalid credentials after client-side PBKDF2 hashing (matches production Flutter client).

## Steps to Reproduce
1. Open https://briktra.com/app/index.html#/login
2. Enter email tenant@yopmail.com
3. Enter password Abcd@123
4. Click Login
(or POST /auth/login with hashed password)

## Expected Result
200 OK, redirect to Dashboard, session tokens issued

## Actual Result
401 Invalid credentials â€” {"message":"Invalid credentials"}

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes â€” login screen with error snackbar/dialog

## Possible Root Cause
Password mismatch on QA tenant record, outdated test credentials, or password changed without updating test data

## Acceptance Criteria
Abcd@123 successfully logs in tenant@yopmail.com on QA/live, or official credentials doc updated to match DB

**Flow Sheet:** Login Page → Login Button → Dashboard
**Module:** Authentication
**Detected:** 2026-08-22T14:44:52.183Z