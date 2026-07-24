# Live Login Blocker Report — 24 Jul 2026

## Summary

Local app is running. All four shared accounts **exist** on the QA API the Flutter client uses, but **none accept the provided passwords**.

| Role | Email | Register check | Login with shared password |
|------|-------|----------------|----------------------------|
| Tenant | tenant@yopmail.com | **User already exists** | **401 Invalid credentials** |
| Manager | briktramanager@yopmail.com | **User already exists** | **401 Invalid credentials** |
| Supervisor | briktrasupervisor@yopmail.com | **User already exists** | **401 Invalid credentials** |
| Employee | briktraemployee@yopmail.com | **User already exists** | **401 Invalid credentials** |

**API:** `https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa`  
**Login body confirmed:** `{ "username": "<email>", "password": "<password>" }`  
**Local app:** http://localhost:4173/app/  
**Marketing:** http://localhost:8080/

## What this means

- The QA backend is reachable and healthy enough to answer auth routes.
- Accounts were created previously on QA.
- The passwords you shared (`Tenant@123`, `Manager@123`, `Supervisor@123`, `Employee@123`) do **not** match what QA currently has stored.
- Until passwords are reset (or correct passwords / phone OTP are provided), role-by-role UI walkthrough and Pass/Fail marking cannot continue.

## Extra API observations

1. Wrong field names → `400 Email/Phone number and password are required`
2. Wrong password / unknown user → same `401 Invalid credentials` (no user enumeration on login)
3. Register duplicate → `400 User already exists` (enumeration via register)
4. `/auth/otp/activate` returned **500** with SQL binding error (`destination` undefined) — backend defect
5. OTP login send requires **phone number**
6. Only `/qa` stage accepts login attempts; `/prod` etc. return `403 Forbidden`

## What we need from you

Pick one:

1. **Reset passwords** on QA for these four users to the shared values, then say “retry”.
2. Send **current working passwords**.
3. Send **phone numbers** for OTP login for each role.
4. Create **fresh QA users** and share new credentials.

Then I will continue **one role at a time** (Tenant → Manager → Supervisor → Employee), capture `/auth/me` + endpoint matrices, and mark the 150+ test cases Pass/Fail.

## Scripts ready to re-run

```bash
node scripts/explore-one-role.mjs Tenant
node scripts/explore-one-role.mjs Manager
node scripts/explore-one-role.mjs Supervisor
node scripts/explore-one-role.mjs Employee
```

Test case design (already written): `docs/QA_TEST_CASES_BY_ROLE.md`
