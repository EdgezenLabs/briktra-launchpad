# Supervisor Profile displays wrong email address

## Summary
Login username is `supervisior.briktra@yopmail.com` but Profile UI shows email `supervisor.briktra@yopmail.com` (missing 'i' in supervisior). Name badge shows "supervisior". Data inconsistency.

## Steps to Reproduce
1. Login with supervisior.briktra@yopmail.com / Supervisior@123
2. Open Profile

## Expected Result
Email matches authenticated account exactly

## Actual Result
Profile email = supervisor.briktra@yopmail.com (different from login)

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — `screenshots/sup-profile-before-logout.png`

## Possible Root Cause
Stale profile field; wrong column mapped; duplicate user records

## Acceptance Criteria
Profile email equals login identity /auth/me email

**Flow Sheet:** Profile  
**Module:** Profile  
**Role:** supervisor
