# Employee can access restricted route: Subscription

## Summary
Employee deep-link stayed on https://briktra.com/app/index.html#/plans for restricted action "Subscription"

## Steps to Reproduce
1. Login as employee (employee.briktra@yopmail.com)
2. Open https://briktra.com/app/index.html#/plans
3. Observe UI

## Expected Result
Permission denied / redirect / lock — no admin CRUD

## Actual Result
Remained on https://briktra.com/app/index.html#/plans. Semantics: BackSubscription PlansCompare PlansPayment HistoryHome
Tab 1 of 5Reports
Tab 2 of 5Wallet
Tab 3 of 5Stock
Tab 4 of 5Profile
Tab 5 of 5PREMIUM Plan · ActiveYour subscription is active. You enjoy full access to all feature

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — emp-neg-Subscription.png

## Possible Root Cause
Missing RBAC route guard for employee role

## Acceptance Criteria
Employee cannot use admin-only screens; clear permission denied

**Flow Sheet:** Restricted — Subscription
**Module:** RBAC
**Role:** employee
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod
**Detected:** 2026-08-10T12:08:39.507Z