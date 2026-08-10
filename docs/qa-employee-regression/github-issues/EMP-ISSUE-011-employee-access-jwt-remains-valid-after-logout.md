# Employee access JWT remains valid after logout

## Summary
Logout does not revoke access token for employee on PROD

## Steps to Reproduce
Login → POST /auth/logout → GET /auth/me

## Expected Result
401

## Actual Result
200

## Severity
High

## Priority
P1

## Screenshots Required
Optional

## Possible Root Cause
Access token not revoked server-side

## Acceptance Criteria
Access token rejected after logout

**Flow Sheet:** Profile → Logout
**Module:** Authentication
**Role:** employee
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod
**Detected:** 2026-08-10T12:09:22.848Z