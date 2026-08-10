# Tenants list deny still exposes Retry FAB for Manager

## Summary
`#/tenants` correctly shows permission error for manager, but still renders an orange **+** FAB. Retry button may re-hit forbidden API. Deny UX incomplete.

## Steps to Reproduce
1. Login as manager
2. Open `#/tenants`

## Expected Result
Deny screen without create FAB or admin actions

## Actual Result
Error: You don't have permission… + Retry + bottom-right + FAB

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — `screenshots/mgr-neg-Tenants.png`

## Possible Root Cause
Shared scaffold with FAB not cleared on permission error

## Acceptance Criteria
On deny, no create FAB; Retry does not spam forbidden calls

**Flow Sheet:** Restricted — Tenants  
**Module:** RBAC / UX  
**Role:** manager  
**Detected:** 2026-08-10
