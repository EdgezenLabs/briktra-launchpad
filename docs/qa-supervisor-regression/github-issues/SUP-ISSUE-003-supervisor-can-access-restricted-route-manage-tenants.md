# Supervisor Tenants list — data denied but FAB still shown

## Summary
`#/tenants` correctly shows **"Error: You don't have permission to access this resource"** for supervisor (data access denied). However, an orange **+** FAB and Retry remain visible — incomplete deny UX (same pattern as Manager).

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com
2. Open `#/tenants`

## Expected Result
Deny screen without create FAB

## Actual Result
Permission error + Retry + + FAB

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — `screenshots/sup-neg-Tenants.png`

## Possible Root Cause
Shared scaffold not cleared on permission error

## Acceptance Criteria
On deny, no create FAB; clean permission-only UI

**Flow Sheet:** Restricted — Manage Tenants  
**Module:** RBAC / UX  
**Role:** supervisor  
**Note:** Data access deny is working; UX polish required
