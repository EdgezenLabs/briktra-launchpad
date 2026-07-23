# Briktra — Authentication, Authorization & Security QA Report

**Auditor role:** Principal QA Engineer (Enterprise ERP)  
**Application:** Briktra Web App — https://briktra.com/app/index.html  
**API environment (from live client bundle):** `https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa`  
**Audit date:** 23 July 2026  
**Scope:** Role-based auth, session, security controls, RBAC, unauthorized access  
**Code changes:** **None** (documentation and analysis only)

---

## 1. Executive Summary

This audit was requested to test **four roles independently** (Tenant, Manager, Supervisor, Employee) through **Login to Briktra**, covering authentication, logout, session/token lifecycle, injection attacks, concurrent login, menu visibility, and unauthorized API access.

### Execution status

| Layer | Status |
|-------|--------|
| Live browser UI testing (click-through per role) | **NOT EXECUTED** — no browser automation available in audit environment |
| Live API authentication with provided credentials | **NOT EXECUTED** — blocked in automated environment |
| Static analysis of deployed Flutter bundle (`main.dart.js`) | **COMPLETED** |
| Architecture & test-case design | **COMPLETED** |
| Manual re-test scripts for your team | **INCLUDED** |

### Headline verdict

| Area | Score (1–10) | Status |
|------|-------------:|--------|
| Authentication design | **7** | Appears sound (JWT + refresh + `/auth/me`) — **needs live confirmation** |
| Session management design | **7** | Token expiry + auto-refresh implemented — **needs live confirmation** |
| Authorization / RBAC design | **7** | Role gates present in client — **server enforcement must be verified live** |
| Security hardening | **5** | QA API in prod client, client-side RBAC reliance, signing secret handling unclear |
| **Overall Auth Security Score** | **6 / 10** | **Conditional — pending live execution** |

> **Important:** The production web client points at a **`/qa` API host**. This is a **Major** finding for a live commercial deployment and Cashfree review.

---

## 2. Test Accounts (Provided)

| Role | Email | Password | Expected internal role |
|------|-------|----------|------------------------|
| Tenant | tenant@yopmail.com | *(provided)* | `tenant_admin` |
| Manager | briktramanager@yopmail.com | *(provided)* | `manager` |
| Supervisor | briktrasupervisor@yopmail.com | *(provided)* | `supervisor` |
| Employee | briktraemployee@yopmail.com | *(provided)* | `employee` |

**Test entry point:** Marketing site → **Login to Briktra** → `https://briktra.com/app/index.html`

---

## 3. Authentication Architecture (Static Analysis)

### 3.1 Login flow (observed in bundle)

```
1. POST /auth/login/hint   { username }
   → returns hash_identifier (likely for biometric / hint UX)

2. POST /auth/login        { username, password, fcm_token? }
   → 200/201: { access_token, refresh_token, id_token }
   → 401: "invalid credentials"
   → 403: inactive account

3. Tokens persisted client-side (access_token, refresh_token, id_token, token_expiry)

4. GET /auth/me              Authorization: Bearer {access_token}
   → current user profile + role context

5. POST /auth/refresh        { refresh_token }
   → new tokens; 401 triggers re-login

6. POST /auth/logout         { refresh_token }
   → clears local tokens
```

### 3.2 Request security headers

When a signing secret is configured, requests include:

- `Authorization: Bearer {access_token}`
- `X-Request-Timestamp`
- `X-Request-Signature` (HMAC over method + path + timestamp + body)

At app bootstrap, signing secret initializes as **empty string** (`$.b3t = ""`). Signature headers are only attached when non-empty. **Live test needed:** Are API calls accepted without signature on web?

### 3.3 Token storage (web)

Tokens stored via client persistence layer (Flutter shared preferences / local storage equivalent):

- `access_token`
- `refresh_token`
- `id_token`
- `token_expiry` (default offset ~86400s if not returned)

**Risk:** Web localStorage is readable by XSS. Mitigation depends on CSP + input sanitization + short-lived tokens.

---

## 4. Role Model & Expected Behavior

### 4.1 Roles identified in client

| Role key | UI label | Notes |
|----------|----------|-------|
| `tenant_admin` | Admin / Tenant | Highest tenant-level access |
| `manager` | Manager | Project + team management |
| `supervisor` | Supervisor | Field/site operations |
| `employee` | Employee | Limited field access |
| `super_admin` | Platform | Route `/superAdmin` — not in your test set |

### 4.2 Post-login routing (client)

| Role | Default landing route |
|------|----------------------|
| `employee` | `/employeeAttendanceTap` |
| `tenant_admin`, `manager`, `supervisor` | `/dashboard` |

### 4.3 Tenant-configurable login gates

Tenant admin can toggle (profile settings):

- `allow_employee_login`
- `allow_manager_login`
- `allow_supervisor_login`

**Test implication:** If Tenant disabled employee login, Employee account should fail even with valid password.

### 4.4 Client-side permission patterns (must be verified server-side)

| Feature / area | Roles with client gate |
|----------------|------------------------|
| Tenant management (`/tenants`, create/edit) | `tenant_admin` |
| Super admin console | `super_admin` |
| Project creation permissions | Configurable per tenant (`project_creation_roles`) |
| Bills “mark as paid” | `tenant_admin`, `manager` (not supervisor/employee) |
| Broadcaster / notifications targeting | `tenant_admin`, `manager`, `supervisor`, `employee` filters |
| Profile: role login settings, biometric | `tenant_admin` only |
| Some admin menus hidden from employee | `employee` → restricted routes |

**Critical QA rule:** Passing client UI checks is **not sufficient**. Every restricted API must return **403** when called with a lower-privilege token.

---

## 5. Application Routes (Attack Surface Map)

### 5.1 Flutter web routes (client router)

```
/login, /register, /otp*, /forgotPassword, /resetPassword, /changePassword
/dashboard, /projects, /project, /createProject, /editProject
/employees, /addAttendance, /employeeAttendanceTap
/suppliers, /contractors, /billsList, /expenses, /documentWallet
/profile, /company-details, /expired-plan
/tenants, /tenantAdmins, /createTenant, /editTenant, /tenantDetail
/superAdmin, /tenantAdmin
... (additional module routes)
```

### 5.2 Sensitive API endpoints (sample from bundle)

| Endpoint | Method | Privilege concern |
|----------|--------|-------------------|
| `/auth/login` | POST | Public |
| `/auth/me` | GET | Authenticated |
| `/auth/refresh` | POST | Refresh token |
| `/auth/logout` | POST | Authenticated |
| `/tenants/{id}` | GET/PATCH/DELETE | Tenant admin |
| `/tenants/{id}/project-settings` | GET/PATCH | Tenant admin |
| `/users/bulk` | POST | Admin/manager |
| `/users/{id}` | PATCH/DELETE | Admin/manager |
| `/users/{id}/projects/bulk-assign` | POST | Elevated |
| `/projects/{id}` | GET/PATCH/DELETE | Role-scoped |
| `/projects/{id}/smart-assign` | POST | Pro feature |
| `/users/biometric-settings` | PATCH | Self |

---

## 6. Test Matrix — Per Role (Manual Execution Required)

Use a **private/incognito window per role**. Clear site data between roles.

### 6.1 Tenant (`tenant_admin`)

| # | Test | Steps | Expected | Live result |
|---|------|-------|----------|-------------|
| T1 | Login | Login to Briktra → email/password | Dashboard, no error | **PENDING** |
| T2 | Session | Refresh page | Stays logged in until token expiry | **PENDING** |
| T3 | `/auth/me` | DevTools → Network after login | 200 + role `tenant_admin` | **PENDING** |
| T4 | Menu | Inspect nav/drawer | Tenants, employees, projects, settings, billing | **PENDING** |
| T5 | Hidden routes | Navigate to `/superAdmin` | Denied unless platform super admin | **PENDING** |
| T6 | Logout | Profile → Logout → confirm | Tokens cleared; `/login` | **PENDING** |
| T7 | Post-logout API | Replay old access token | 401 | **PENDING** |
| T8 | Role settings | Toggle allow_employee_login off | Employee login fails | **PENDING** |

### 6.2 Manager

| # | Test | Steps | Expected | Live result |
|---|------|-------|----------|-------------|
| M1 | Login | Valid credentials | `/dashboard` | **PENDING** |
| M2 | Menu | Compare to Tenant | No tenant provisioning / super admin | **PENDING** |
| M3 | Projects | Create/edit project | Allowed if tenant policy permits manager | **PENDING** |
| M4 | Employees | Add employee | Allowed | **PENDING** |
| M5 | Bills | Mark as paid | Allowed | **PENDING** |
| M6 | API escalation | Call `DELETE /tenants/{id}` with Manager token | **403** | **PENDING** |
| M7 | Logout | Logout | Session ended | **PENDING** |

### 6.3 Supervisor

| # | Test | Steps | Expected | Live result |
|---|------|-------|----------|-------------|
| S1 | Login | Valid credentials | `/dashboard` | **PENDING** |
| S2 | Attendance | Mark attendance | Allowed | **PENDING** |
| S3 | Expenses/bills | Create site expense | Allowed | **PENDING** |
| S4 | Admin | Open `/tenants` URL directly | Blocked in UI + API 403 | **PENDING** |
| S5 | Payroll | Access payroll export | Denied or partial per plan | **PENDING** |
| S6 | Logout | Logout | Session ended | **PENDING** |

### 6.4 Employee

| # | Test | Steps | Expected | Live result |
|---|------|-------|----------|-------------|
| E1 | Login | Valid credentials | `/employeeAttendanceTap` | **PENDING** |
| E2 | Menu | Inspect nav | Minimal: attendance, assigned project views | **PENDING** |
| E3 | Hidden URL | Open `/projects` or `/employees` | Redirect/deny | **PENDING** |
| E4 | API | `POST /users/bulk` with Employee token | **403** | **PENDING** |
| E5 | Logout | Logout | Session ended | **PENDING** |

---

## 7. Security Test Cases

### 7.1 Authentication

| Test | Payload / action | Expected | Live result |
|------|------------------|----------|-------------|
| Incorrect password | Valid email + `WrongPass@999` | 401, generic error, no user enumeration leak | **PENDING** |
| Unknown email | `notexist@yopmail.com` | 401 same message as wrong password | **PENDING** |
| Empty fields | Blank submit | Client validation blocks | **PENDING** |
| Account lockout | 10+ failed logins | Rate limit / temporary lock (if implemented) | **PENDING** |
| OTP login bypass | `/otpLogin` without password | Only with valid OTP flow | **PENDING** |

### 7.2 SQL injection (login)

Test in **username** and **password** fields (UI + direct API):

```
' OR '1'='1
" OR "1"="1
admin'--
tenant@yopmail.com'; DROP TABLE users;--
1; SELECT * FROM users
```

**Expected:** 401 invalid credentials, no stack trace, no SQL error text, no auth bypass.  
**Live result:** **PENDING**

### 7.3 XSS (stored & reflected)

| Vector | Example payload | Expected |
|--------|-----------------|----------|
| Employee name | `<script>alert(1)</script>` | Escaped on display |
| Project name | `<img src=x onerror=alert(1)>` | No script execution |
| Daily note / expense description | HTML injection | Sanitized |

**Flutter web note:** UI is canvas/HTML hybrid; still test any web-exposed text fields and exported PDFs.  
**Live result:** **PENDING**

### 7.4 CSRF

API uses **Bearer tokens** (not cookie session), so classic CSRF risk is **lower** for JSON API calls.

Still verify:

- No sensitive actions via GET with cookie auth
- Cashfree checkout callbacks use proper origin checks
- Refresh token not accepted from arbitrary origins without CORS

**Live result:** **PENDING**

### 7.5 Session / token expiry

| Test | Method | Expected |
|------|--------|----------|
| Token expiry | Wait until `token_expiry` or shorten in DevTools | Auto refresh or forced re-login |
| Refresh rotation | Call `/auth/refresh` twice with same refresh token | Old token invalidated if rotation enabled |
| Expired access token | API call after expiry | Silent refresh OR 401 → login |
| Revoked refresh | Logout on device A, refresh on device B | 401 on B |

**Live result:** **PENDING**

### 7.6 Multiple / concurrent login

| Test | Steps | Expected |
|------|-------|----------|
| Same user, two browsers | Login Chrome + Firefox | Both sessions valid OR explicit single-session policy |
| Same user, two tabs | Login twice | Shared session store |
| Logout one device | Logout browser A | Browser B behavior documented |

**Live result:** **PENDING**

### 7.7 Unauthorized API access (IDOR / privilege escalation)

Perform with each role’s `access_token` (DevTools → copy Bearer token):

| Request | As Employee | As Supervisor | As Manager | As Tenant |
|---------|-------------|---------------|------------|-----------|
| `GET /tenants/{other_tenant_id}` | 403 | 403 | 403 | 200 own only |
| `DELETE /users/{manager_id}` | 403 | 403 | 403/role-based | 200 if permitted |
| `PATCH /projects/{unassigned_project}` | 403 | 403 if not assigned | 200 if assigned | 200 |
| `POST /users/bulk` | 403 | 403 | 200? | 200 |

**Live result:** **PENDING**

---

## 8. Section Scores (1 Poor – 10 Excellent)

| Section | Score | Rationale |
|---------|------:|-----------|
| Authentication UX | **7** | Email/password + OTP + biometric options; clear error keys in i18n |
| Login security | **6** | 401 handling present; rate-limit unknown; QA API host in prod |
| Logout | **7** | Logout API + local token clear designed |
| Session persistence | **7** | Refresh flow + expiry timestamp |
| Token refresh | **7** | Auto-refresh before expiry window (~5 min) |
| Incorrect password handling | **7** | Mapped to `error.login.invalid_credentials` (verify no enumeration) |
| SQL injection resistance | **6** | Cannot confirm without live API; backend likely parameterized |
| XSS resistance | **6** | Flutter reduces DOM XSS; still test all text inputs |
| CSRF resistance | **7** | Bearer-token API pattern |
| Multiple login policy | **5** | No explicit single-session logic found in client |
| Concurrent login | **5** | Needs live verification |
| Role permissions (RBAC) | **7** | Rich client gates; server must enforce |
| Menu visibility | **7** | Role-based routing and menus in bundle |
| Hidden pages | **6** | URLs exist — must verify server blocks API |
| Unauthorized API access | **5** | **Must be live-tested per endpoint** |
| UI consistency (auth screens) | **8** | Branded auth flow, multilingual |
| Error handling | **7** | 401/403 mapped to user messages |

---

## 9. Overall Scores

| Metric | Score |
|--------|------:|
| **Overall UX Score (auth flows)** | **7 / 10** |
| **Overall UI Score (login & app chrome)** | **8 / 10** |
| **Overall Quality Score (security & RBAC)** | **6 / 10** |

*Scores reflect design/static analysis. Live execution may raise or lower by ±2 points.*

---

## 10. Issues Register

### Critical Issues

| ID | Issue | Evidence | Recommendation |
|----|-------|----------|----------------|
| C1 | **Live role testing not completed in this audit** | No browser/API execution | Run manual matrix §6–7 before release |
| C2 | **Production web client uses QA API host** | `...amazonaws.com/qa` in `main.dart.js` | Point production build to prod API; segregate environments |
| C3 | **Server-side authorization unverified** | Client hides menus; APIs must return 403 | Execute IDOR suite §7.7 for all roles |

### Major Issues

| ID | Issue | Evidence | Recommendation |
|----|-------|----------|----------------|
| M1 | **Client-side RBAC is not security** | Role checks in Dart UI | Enforce on every API route |
| M2 | **JWT in web local storage** | Token persistence in client | Short TTL, refresh rotation, CSP, XSS hardening |
| M3 | **Request signing secret empty at boot** | `$.b3t=""` initialization | Confirm whether web skips signing; if yes, rely on TLS + short tokens |
| M4 | **Marketing site deep links still 404** | Prior site QA | Fix before reviewers test legal pages |
| M5 | **Concurrent session policy undefined** | No single-session flag found | Document and test multi-device behavior |

### Minor Issues

| ID | Issue | Evidence | Recommendation |
|----|-------|----------|----------------|
| m1 | Login hint endpoint exposes `hash_identifier` | `/auth/login/hint` | Verify no account enumeration |
| m2 | 7MB `main.dart.js` load | Bundle size | Code-split; improve first login time |
| m3 | Firebase init skipped message in console | Bundle log string | Non-blocking but noisy |
| m4 | Employee default route differs | `/employeeAttendanceTap` | Ensure onboarding explains limited UI |

### Enhancement Suggestions

1. Add **automated E2E** (Playwright) for four roles: login → menu snapshot → logout.  
2. Add **API contract tests** for 403 on privileged endpoints per role.  
3. Implement **refresh token rotation** + reuse detection.  
4. Add **rate limiting** feedback in UI after failed logins.  
5. Publish **session policy** (multi-device allowed or not) in Terms / Security Policy.  
6. Use **httpOnly Secure cookies** for refresh tokens on web (if architecture allows).  
7. Run **OWASP ZAP** / Burp against QA and PROD API separately.  
8. Add synthetic monitor: login as Tenant → `/auth/me` → logout every 15 min.

---

## 11. How to Complete This Audit (Your Team)

### Step-by-step (≈ 2–3 hours)

1. Open Chrome Incognito → https://briktra.com → **Login to Briktra**  
2. Login as **Tenant** → complete matrix §6.1 → Logout → Clear site data  
3. Repeat for Manager, Supervisor, Employee  
4. Open DevTools → Network → filter `execute-api`  
5. Copy `access_token` per role → run API tests §7.7 with curl/Postman  
6. Run injection payloads §7.2–7.3  
7. Record results in the **Live result** columns (copy this doc → `QA_AUTH_SECURITY_AUDIT_RESULTS.md`)

### Sample curl template (replace tokens)

```bash
# Login
curl -s -X POST "https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"tenant@yopmail.com","password":"***"}'

# Me
curl -s "https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa/auth/me" \
  -H "Authorization: Bearer ACCESS_TOKEN"

# Unauthorized test (Employee token on admin endpoint)
curl -s -X DELETE "https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa/tenants/TENANT_ID" \
  -H "Authorization: Bearer EMPLOYEE_ACCESS_TOKEN"
```

---

## 12. Go / No-Go (Auth & Security)

| Gate | Status |
|------|--------|
| All four roles can login via Login to Briktra | **NOT VERIFIED** |
| Logout clears session | **NOT VERIFIED** |
| Token refresh works | **NOT VERIFIED** |
| Wrong password rejected safely | **NOT VERIFIED** |
| SQLi / XSS spot checks pass | **NOT VERIFIED** |
| Role menus differ correctly | **NOT VERIFIED** |
| Privileged APIs return 403 for lower roles | **NOT VERIFIED** |
| Production API host (not `/qa`) | **FAIL (static)** |

**Recommendation:** **NO-GO** for production security sign-off until live matrix is executed and QA API host is resolved.

---

## 13. Related Documents

- [QA_PRODUCTION_AUDIT_REPORT.md](./QA_PRODUCTION_AUDIT_REPORT.md) — Marketing site QA  
- [QA_DOCUMENTATION_INDEX.md](./QA_DOCUMENTATION_INDEX.md) — Index  
- [WEBSITE_ENHANCEMENT_REPORT.md](./WEBSITE_ENHANCEMENT_REPORT.md) — Site implementation report  

---

## 14. Document Control

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Author | Principal QA (automated static audit + manual test design) |
| Live execution | Pending — requires browser + API access |
| Credentials stored in report | No — use secure vault |

---

*End of report.*
