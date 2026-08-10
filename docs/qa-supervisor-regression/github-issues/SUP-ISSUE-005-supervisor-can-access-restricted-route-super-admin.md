# Supervisor Super Admin shell shows "Welcome, Super Admin"

## Summary
Opening `#/superAdmin` as supervisor renders Super Admin chrome with header **"Welcome, Super Admin"** and platform tabs, while data shows permission error. Same critical defect as Manager.

## Steps to Reproduce
1. Login as supervisior.briktra@yopmail.com
2. Open `#/superAdmin`

## Expected Result
Hard deny — no Super Admin navigation

## Actual Result
Welcome Super Admin + admin tabs + permission error + FAB

## Severity
Critical

## Priority
P0

## Screenshots Required
Yes — `screenshots/sup-neg-SuperAdmin.png`

## Possible Root Cause
Super Admin layout not role-gated

## Acceptance Criteria
Never show Super Admin shell unless role is super_admin

**Flow Sheet:** Restricted — Super Admin  
**Module:** RBAC  
**Role:** supervisor
