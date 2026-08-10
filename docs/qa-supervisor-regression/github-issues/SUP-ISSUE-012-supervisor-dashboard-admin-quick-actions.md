# Supervisor Dashboard exposes admin Quick Actions beyond role tasks

## Summary
Supervisor Dashboard correctly shows role tasks **Log Expense** and **My Projects**, but the Quick Actions grid also includes **Add Projects**, **Add Employees**, **Payroll Management**, etc. These exceed typical supervisor scope and conflict with restricted-action expectations.

## Steps to Reproduce
1. Login as supervisor
2. View Dashboard Quick Actions grid

## Expected Result
Only supervisor-appropriate actions (expense, projects, attendance/docs as allowed)

## Actual Result
Full quick-action set including Add Projects, Add Employees, Payroll Management

## Severity
Medium

## Priority
P2

## Screenshots Required
Yes — `screenshots/sup-01-after-login.png`

## Possible Root Cause
Quick actions not filtered by role; shared tenant_admin grid

## Acceptance Criteria
Dashboard quick actions match supervisor role matrix / Flow Sheet

**Flow Sheet:** Dashboard  
**Module:** Dashboard / RBAC UI  
**Role:** supervisor
