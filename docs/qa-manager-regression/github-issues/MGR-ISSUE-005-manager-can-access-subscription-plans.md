# Manager can access Subscription Plans (should be denied)

## Summary
Manager opens `#/plans` and sees full Subscription Plans UI including PREMIUM Active banner, upgrade messaging, Monthly/Annual toggle, and Free Trial plan card. Test plan requires Subscription restricted for manager.

## Steps to Reproduce
1. Login as manager
2. Open `#/plans`

## Expected Result
Permission denied / hidden from manager

## Actual Result
Full subscription management UI loads

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/mgr-neg-Plans.png`

## Possible Root Cause
Plans route not restricted by role; inherits tenant premium context

## Acceptance Criteria
Manager cannot open subscription/billing management screens

**Flow Sheet:** Restricted — Subscription  
**Module:** Subscription / RBAC  
**Role:** manager  
**Detected:** 2026-08-10
