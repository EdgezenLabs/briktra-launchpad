# Supervisor can access Subscription Plans

## Summary
`#/plans` loads full Subscription Plans (PREMIUM Active, upgrade UI, Free Trial card). Supervisor must not manage subscription.

## Steps to Reproduce
1. Login as supervisor
2. Open `#/plans`

## Expected Result
Access denied

## Actual Result
Full subscription management UI

## Severity
High

## Priority
P1

## Screenshots Required
Yes — `screenshots/sup-neg-Plans.png`

## Possible Root Cause
Plans route not restricted by role

## Acceptance Criteria
Supervisor cannot open subscription/billing screens

**Flow Sheet:** Restricted — Manage Subscription  
**Module:** Subscription / RBAC  
**Role:** supervisor
