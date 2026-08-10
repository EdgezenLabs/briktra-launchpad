# Employee has zero assigned projects — cannot complete Mark Attendance

## Summary
Site Employee home (`#/employeeAttendanceTap`) shows **"No projects are assigned to you. Please contact your management."** Mark Attendance cannot be completed (also blocked by Location Not Available in headless). Business scenario steps Mark Attendance / View Assigned Tasks are blocked by missing assignment data.

## Steps to Reproduce
1. Login as `employee.briktra@yopmail.com` / `Employee@123`
2. Land on `#/employeeAttendanceTap` (or Home)
3. Observe Select Project warning

## Expected Result
At least one assigned project/site so employee can mark today's attendance per Flow Sheet

## Actual Result
Yellow warning: No projects assigned. TAP TO MARK ATTENDANCE present but no project selectable. Screenshots: `emp-01-after-login.png`, `emp-route-Attendance-Home.png`

## Severity
High

## Priority
P1

## Screenshots Required
Yes — emp-01-after-login.png

## Possible Root Cause
Employee user not linked to any project in PROD tenant TenantAdmin Builders; seed/assignment missing

## Acceptance Criteria
Employee has ≥1 assigned project; Mark Attendance can select project and submit when GPS available

**Flow Sheet:** Attendance - Mark Attendance / Employee home  
**Module:** Attendance / Assignments  
**Role:** employee  
**API:** https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod  
**Detected:** 2026-08-10T12:08:24.514Z
