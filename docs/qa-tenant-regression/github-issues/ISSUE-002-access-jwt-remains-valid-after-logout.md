# ISSUE-002 — Access JWT remains valid after logout

## Status: **OPEN** (confirmed on PROD 2026-08-10)

## Summary
POST /auth/logout returns 200 but subsequent GET /auth/me with the same access_token still returns 200. Session is not fully terminated server-side. Reproduced on production API `b05vnm4akk.../prod`.

## Steps to Reproduce
1. Login as tenant@yopmail.com / Abcd@123 (PROD)
2. POST /auth/logout with refresh_token
3. GET /auth/me with original access_token

## Expected Result
401 Unauthorized — access token revoked or expired

## Actual Result
GET /auth/me returns 200 with user profile

## Severity
High

## Priority
P1

## Screenshots Required
Optional — network tab showing 200 after logout

## Possible Root Cause
Access tokens not invalidated on logout; only refresh token may be cleared client-side

## Acceptance Criteria
After logout, access_token rejected within TTL or explicit revocation list enforced

**Flow Sheet:** Profile → Logout  
**Module:** Authentication  
**API:** prod  
**Also tracked as:** ISSUE-010  
**Detected:** 2026-08-10
