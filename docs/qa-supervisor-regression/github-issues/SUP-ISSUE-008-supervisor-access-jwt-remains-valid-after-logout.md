# Supervisor access JWT remains valid after logout

## Summary
POST /auth/logout succeeds but GET /auth/me with same access_token still returns 200 for supervisor on PROD.

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com
2. POST /auth/logout
3. GET /auth/me with access_token

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
Access tokens not revoked on logout

## Acceptance Criteria
Access token rejected after logout

**Flow Sheet:** Profile → Logout  
**Module:** Authentication  
**Role:** supervisor
