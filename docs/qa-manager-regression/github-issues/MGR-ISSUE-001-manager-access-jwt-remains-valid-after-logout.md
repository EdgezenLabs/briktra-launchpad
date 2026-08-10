# Manager access JWT remains valid after logout

## Summary
POST /auth/logout returns success but GET /auth/me with the same access_token still returns 200 for the manager role on PROD.

## Steps to Reproduce
1. Login as manager.briktra@yopmail.com / Manager@123
2. POST /auth/logout with refresh_token
3. GET /auth/me with original access_token

## Expected Result
401 Unauthorized

## Actual Result
200 with manager profile

## Severity
High

## Priority
P1

## Screenshots Required
Optional — network evidence

## Possible Root Cause
Access tokens not revoked server-side on logout (same as Tenant ISSUE-002)

## Acceptance Criteria
Access token rejected after logout within TTL or via denylist

**Flow Sheet:** Profile → Logout  
**Module:** Authentication  
**Role:** manager  
**API:** prod  
**Detected:** 2026-08-10
