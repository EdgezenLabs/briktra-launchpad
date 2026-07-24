# Briktra — In-Depth Test Cases by Login Role

**Created:** 23 July 2026  
**App under test:** Briktra Flutter Web ERP (`/app/`)  
**Local run:**  
- Marketing site: http://localhost:8080/  
- Flutter app: http://localhost:4173/app/  
- Production entry: https://briktra.com → **Login to Briktra** → https://briktra.com/app/  
**API (from client bundle):** `https://bybdg06o5b.execute-api.ap-south-1.amazonaws.com/qa`  
**Method:** Local servers started + live API login attempts + deep static analysis of role routing, dashboards, menus, and modules  

---

## 0. Live Login Attempt Results (Blocking Discovery)

**Updated:** 24 July 2026

| Role | Email | Account on QA? | Login with shared password |
|------|-------|----------------|----------------------------|
| Tenant | tenant@yopmail.com | **YES** (`User already exists`) | **401 Invalid credentials** |
| Manager | briktramanager@yopmail.com | **YES** | **401 Invalid credentials** |
| Supervisor | briktrasupervisor@yopmail.com | **YES** | **401 Invalid credentials** |
| Employee | briktraemployee@yopmail.com | **YES** | **401 Invalid credentials** |

### Auth contract confirmed against API

| Check | Result |
|-------|--------|
| Correct body keys | `username` + `password` (required) |
| Wrong field names (`email`, `phone`, …) | **400** — “Email/Phone number and password are required” |
| Wrong password | **401** — “Invalid credentials” |
| Register with same email | **400** — “User already exists” (proves accounts exist) |
| OTP request `{ destination: email }` | **200** — “OTP sent successfully” (tested for tenant) |
| OTP activate missing destination | **500** — backend SQL binding bug |

**Implication:** Accounts exist on QA; **passwords do not match** the shared values. Role UI walkthrough is blocked until passwords are reset or correct secrets are provided.

See also: `docs/role-exploration/LOGIN_BLOCKER.md`  
Automation: `node scripts/explore-one-role.mjs <Role>`

---

## 1. Application Understanding (Role Model)

### 1.1 Roles

| UI label | Internal role key | Default landing route |
|----------|-------------------|------------------------|
| Tenant / Admin | `tenant_admin` | `/dashboard` |
| Manager | `manager` | `/dashboard` |
| Supervisor | `supervisor` | `/dashboard` |
| Employee | `employee` | `/employeeAttendanceTap` |
| Super Admin | `super_admin` | `/superAdmin` (platform; not in your set) |

### 1.2 Auth lifecycle (client)

1. Login screen → `POST /auth/login`  
2. Store `access_token`, `refresh_token`, `id_token`, `token_expiry`  
3. Load profile → `GET /auth/me`  
4. Route by role (table above)  
5. Auto refresh via `POST /auth/refresh` near expiry  
6. Logout → `POST /auth/logout` + clear local tokens  

### 1.3 Role-specific dashboard “Role Tasks” (from client)

| Role | Role-task cards shown |
|------|------------------------|
| **tenant_admin** | New Project → `/createProject` · Team → `/employees` · Reports (finance) → `/reportsDashboard` |
| **manager** | Mark Attendance (06:00–20:00) → `/addAttendance` · Projects → `/projects` · Reports (expense) → `/reportsDashboard` |
| **supervisor** | Log Expense → quick expense · My Projects → `/projects` |
| **employee** | Tap Attendance (06:00–20:00) → `/employeeAttendanceTap` · My Salary → salary report |

### 1.4 Shared quick-action grid (elevated roles)

Routes wired in client quick actions:

| Label | Route |
|-------|-------|
| Projects | `/projects` |
| Employees | `/employees` |
| Suppliers | `/suppliers` |
| Contractors | `/contractors` |
| Reports | `/reportsDashboard` |
| Stock | `/stockManagement` |
| Wallet | `/documentWallet` |
| Bills | `/billsList` |
| Payroll | `/payrollList` |
| Expenses | `__quick_expense` |

### 1.5 Bottom navigation (typical non-employee)

Home · Contractors · Wallet · Reports · Stock · Profile  

### 1.6 Tenant-only settings (profile)

- Role Login Settings: allow Manager / Supervisor / Employee login  
- Project Creation Permissions (which roles may create projects)  
- Biometric settings, company details, language, change password, subscription cancel  

### 1.7 Tenant login gates

If Tenant disables a role’s login, that role must fail authentication even with valid password.

---

## 2. Shared Authentication Test Suite (run for EVERY role)

Use a **fresh Incognito window** per role. Entry: Login to Briktra.

| ID | Title | Steps | Expected |
|----|-------|-------|----------|
| AUTH-01 | Valid login | Enter email + password → Login | Success toast; land on role home |
| AUTH-02 | Wrong password | Correct email + wrong password | Error; stay on login; no token |
| AUTH-03 | Unknown user | Fake email + any password | Same generic error as AUTH-02 |
| AUTH-04 | Empty fields | Submit blank | Client validation; no API call or 400 |
| AUTH-05 | Email format | Invalid email string | Validation message |
| AUTH-06 | Password visibility | Toggle eye icon | Mask/unmask works |
| AUTH-07 | Forgot password | Link → enter email → OTP | OTP flow; no account leak |
| AUTH-08 | OTP login link | Login with OTP | Phone OTP required (API: phone required) |
| AUTH-09 | Session persist | Login → refresh browser | Still logged in |
| AUTH-10 | Hard reload | Ctrl+Shift+R after login | Session restored or re-login |
| AUTH-11 | Logout confirm | Profile → Logout → Cancel | Stay logged in |
| AUTH-12 | Logout confirm | Logout → Confirm | Tokens cleared; `/login` |
| AUTH-13 | Post-logout deep link | After logout open `/dashboard` | Redirect to login |
| AUTH-14 | Token refresh | Stay idle until near expiry / force refresh | Silent refresh or re-login |
| AUTH-15 | Concurrent browser | Login same user in Chrome + Edge | Document allowed or forced logout |
| AUTH-16 | Multiple tabs | Login in tab A; open app in tab B | Shared session |
| AUTH-17 | SQL injection username | `' OR '1'='1` | 401; no stack trace |
| AUTH-18 | SQL injection password | Same payloads in password | 401; no bypass |
| AUTH-19 | XSS in username | `<script>alert(1)</script>` | Escaped / rejected |
| AUTH-20 | Role-disabled login | Tenant disables role → try login | Denied with clear message |

---

## 3. Tenant (`tenant_admin`) — Deep Test Scenarios

**Account:** tenant@yopmail.com / Tenant@123  
**Expected home:** `/dashboard` with New Project, Team, Finance Reports tasks  

### 3.1 Login & home

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-01 | Landing | Login | Dashboard; welcome with name |
| TEN-02 | Plan badge | Observe trial/plan chip | Free Trial / plan label accurate |
| TEN-03 | Role tasks | See 3 role-task cards | New Project, Team, Reports |
| TEN-04 | Quick actions | Open Launch / quick grid | Projects, Employees, Suppliers, Contractors, Reports, Stock, Wallet, Bills, Payroll, Expenses |
| TEN-05 | Bottom nav | Tap each tab | Home/Contractors/Wallet/Reports/Stock/Profile work |

### 3.2 Projects module

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-P01 | List projects | Open Projects | List or empty state |
| TEN-P02 | Create project | New Project → fill wizard → save | Project created; appears in list |
| TEN-P03 | Project limit | Create beyond plan limit | Limit error / upgrade nudge |
| TEN-P04 | Edit project | Open project → edit | Saves; validation works |
| TEN-P05 | Sub-projects | Create nested sub-project (Pro+) | Allowed per plan |
| TEN-P06 | Delete project | Delete with confirm | Removed or soft-deleted |
| TEN-P07 | Empty state CTA | No projects → Create first | CTA visible for tenant |
| TEN-P08 | Assign team | Assign manager/supervisor/employee | Assignments persist |

### 3.3 Employees / roles

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-E01 | Employee list | Open Employees | Directory loads |
| TEN-E02 | Add Manager | Create user role=manager + password | Created; can login if allowed |
| TEN-E03 | Add Supervisor | Create supervisor | Created |
| TEN-E04 | Add Employee | Create employee | Created |
| TEN-E05 | Role filter | Filter by role | Correct subsets |
| TEN-E06 | Deactivate user | Soft-delete / deactivate | Cannot login |
| TEN-E07 | Bulk import | Import CSV if available | Validates + imports |
| TEN-E08 | Wage setup | Set daily/monthly wage | Saved |
| TEN-E09 | Project assign bulk | Bulk assign projects | Succeeds |

### 3.4 Attendance & payroll

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-A01 | Mark attendance | Add Attendance for team | Present/Absent/Half-day |
| TEN-A02 | GPS attendance | Mark with location (Pro+) | GPS stored if enabled |
| TEN-A03 | Attendance report | Open reports | Daily/weekly/monthly |
| TEN-A04 | Payroll list | Open Payroll | List/wizard |
| TEN-A05 | Salary advance | Create advance (Karzaa) | Tracks & deducts |
| TEN-A06 | Export payroll | Export PDF/Excel | File downloads |

### 3.5 Expenses, bills, suppliers, stock

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-X01 | Quick expense | Log expense + photo | Saved to project |
| TEN-X02 | Bills list | Open Bills | Status tracking |
| TEN-X03 | Mark bill paid | Mark as paid | Allowed for tenant_admin |
| TEN-X04 | Suppliers | CRUD supplier | Works |
| TEN-X05 | Contractors | CRUD contractor | Works |
| TEN-X06 | Stock | Add stock / low stock | Works per plan |
| TEN-X07 | Wallet | Upload document | Stored & listable |

### 3.6 Reports & analytics

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-R01 | Reports dashboard | Open Reports | Finance summaries |
| TEN-R02 | Project P&L | Open project reports | Cost vs budget |
| TEN-R03 | Export report | PDF/Excel | Downloads |

### 3.7 Tenant admin settings (unique)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-S01 | Role login settings | Disable employee login → Employee tries login | Employee blocked |
| TEN-S02 | Re-enable employee login | Enable → Employee login | Succeeds |
| TEN-S03 | Manager login toggle | Disable manager login | Manager blocked |
| TEN-S04 | Supervisor login toggle | Disable supervisor login | Supervisor blocked |
| TEN-S05 | Project creation roles | Allow only tenant_admin | Manager create project denied |
| TEN-S06 | Company details | Update GST, name, location | Saved; GST validation |
| TEN-S07 | Change password | Old → new → confirm | Success; re-login with new |
| TEN-S08 | Language EN/HI/TA | Switch language | UI strings change |
| TEN-S09 | Biometric prompt | Enable/disable | Web may skip; no crash |
| TEN-S10 | Subscription / plans | Open plans / upgrade | Cashfree checkout path |
| TEN-S11 | Cancel subscription | Cancel flow | Confirm + reset messaging |
| TEN-S12 | Referral code | View my referral | Code shown |

### 3.8 Negative / security (Tenant)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TEN-N01 | Open `/superAdmin` | Deep link | Denied (not platform admin) |
| TEN-N02 | Access other tenant id | API `/tenants/{other}` | 403 |
| TEN-N03 | Logout then API | Call `/auth/me` with old token | 401 |

---

## 4. Manager — Deep Test Scenarios

**Account:** briktramanager@yopmail.com / Manager@123  
**Expected home:** `/dashboard` with attendance (daytime), projects, expense reports  

### 4.1 Login & visibility

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| MGR-01 | Landing | Login | Dashboard (not employee tap screen) |
| MGR-02 | Role tasks | Inspect cards | Mark Attendance (6am–8pm), Projects, Reports |
| MGR-03 | No tenant settings | Open Profile | **No** Role Login Settings / Project Creation Permissions admin toggles |
| MGR-04 | No super admin | Open `/superAdmin` | Denied |
| MGR-05 | No tenants CRUD | Open `/tenants` or create tenant | Denied / hidden |

### 4.2 Operational modules

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| MGR-P01 | View projects | Projects list | Sees assigned / allowed projects |
| MGR-P02 | Create project | If policy allows | Success; else denied with message |
| MGR-P03 | Create project denied | When tenant removed manager from creation roles | Clear permission error |
| MGR-E01 | Manage team | Employees | Can add supervisor/employee (not elevate to tenant_admin) |
| MGR-E02 | Cannot create tenant_admin | Try role=tenant_admin | Blocked |
| MGR-A01 | Mark team attendance | `/addAttendance` | Works |
| MGR-A02 | Night restriction | Outside 06–20 | Attendance card may hide; direct route still tested |
| MGR-X01 | Expenses | Log / view | Works |
| MGR-B01 | Mark bill paid | Bills → mark paid | Allowed (manager) |
| MGR-R01 | Reports | Expense summaries | Works |
| MGR-S01 | Stock / wallet / contractors | Navigate | Access per plan + assignment |

### 4.3 Authorization negatives

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| MGR-N01 | Delete tenant | API/UI | 403 |
| MGR-N02 | Change role login settings | Profile | Not visible / 403 |
| MGR-N03 | Access unassigned project | Open foreign project | 403 / empty |
| MGR-N04 | Impersonate tenant | Edit company GST as owner | Denied if restricted |

---

## 5. Supervisor — Deep Test Scenarios

**Account:** briktrasupervisor@yopmail.com / Supervisor@123  
**Expected home:** `/dashboard` with Log Expense + My Projects  

### 5.1 Login & visibility

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SUP-01 | Landing | Login | Dashboard |
| SUP-02 | Role tasks | Inspect | Log Expense, My Projects (**no** New Project / Team manage cards) |
| SUP-03 | No payroll admin | Look for payroll export / auto payroll | Hidden or read-only |
| SUP-04 | No role login settings | Profile | Not present |
| SUP-05 | Bills mark paid | Try mark paid | **Denied** (client gate: manager/tenant only) |

### 5.2 Field operations

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SUP-F01 | My projects | Open projects | Assigned sites only |
| SUP-F02 | Daily notes | Add note + photo | Saved |
| SUP-F03 | Log expense | Quick expense | Saved against project |
| SUP-F04 | Attendance | Mark team if permitted | Works or denied per policy |
| SUP-F05 | Document wallet | Upload site doc | Works if allowed |
| SUP-F06 | Suppliers view | Open suppliers | View vs edit per policy |

### 5.3 Negatives

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SUP-N01 | Create project | `/createProject` | Denied unless policy allows |
| SUP-N02 | Manage employees | Add manager | Denied |
| SUP-N03 | Open `/tenantAdmin` | Deep link | Denied |
| SUP-N04 | Billing / plans admin | Cancel subscription | Denied |
| SUP-N05 | API `/users/bulk` | With supervisor token | 403 |

---

## 6. Employee — Deep Test Scenarios

**Account:** briktraemployee@yopmail.com / Employee@123  
**Expected home:** `/employeeAttendanceTap` (not full dashboard)  

### 6.1 Login & shell

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| EMP-01 | Landing | Login | Employee attendance tap screen |
| EMP-02 | No admin dashboard | Should not see tenant quick-action grid | Minimal UI |
| EMP-03 | Role tasks if any | Tap Attendance (daytime), My Salary | Present |
| EMP-04 | Bottom nav | Limited tabs | No contractors/stock admin if hidden |
| EMP-05 | Profile | Change password, language | Allowed; no role login toggles |

### 6.2 Self-service flows

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| EMP-A01 | Tap attendance | Mark self present | Success; geo if required |
| EMP-A02 | Duplicate mark | Mark twice same day | Error already marked |
| EMP-A03 | Outside hours | After 20:00 | Card may hide; direct action tested |
| EMP-S01 | My salary | Open salary report | Own payslips only |
| EMP-S02 | Cannot see others’ salary | Try peer user id | 403 |
| EMP-P01 | Assigned projects | View status | Read-only |
| EMP-P02 | Cannot create project | `/createProject` | Denied |
| EMP-X01 | Log own expense? | If UI allows | Only own/assigned; else denied |

### 6.3 Hard negatives (critical)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| EMP-N01 | `/employees` | Deep link | Denied / redirect |
| EMP-N02 | `/payrollList` | Deep link | Denied |
| EMP-N03 | `/tenants` | Deep link | Denied |
| EMP-N04 | `/billsList` mark paid | Attempt | Denied |
| EMP-N05 | `/users/bulk` API | POST | 403 |
| EMP-N06 | `/tenants/{id}` PATCH | API | 403 |
| EMP-N07 | Delete another user | API | 403 |
| EMP-N08 | Open manager project unassigned | API | 403 |

---

## 7. Cross-Role Comparison Matrix

| Capability | Tenant | Manager | Supervisor | Employee |
|------------|:------:|:-------:|:----------:|:--------:|
| Default `/dashboard` | Yes | Yes | Yes | **No** (attendance) |
| Create project | Yes* | Policy | Policy | No |
| Manage team | Yes | Limited | No/limited | No |
| Role login settings | **Yes** | No | No | No |
| Mark bill paid | Yes | Yes | **No** | No |
| Log expense | Yes | Yes | Yes | Limited |
| Self attendance tap | — | — | — | **Yes** |
| My salary | — | — | — | **Yes** |
| Reports dashboard | Finance | Expense | Limited | No |
| Subscription / Cashfree | Yes | No | No | No |
| Super admin | No | No | No | No |

\*Subject to plan limits.

---

## 8. Module-Level Expansion Pack (apply under each allowed role)

For each module the role can open, run:

### Projects
Create · Edit · View · Sub-project · Assign users · Compare · Delete · Empty state · Offline message · Multilingual labels  

### Attendance
Mark individual · Bulk · GPS on/off · Half-day · Report filters · Already-marked error · Location permission denied  

### Expenses
Add with/without photo · Amount validation · Project required · Edit · Delete · Approval workflow (Premium)  

### Bills / Suppliers / Contractors / Stock / Wallet / Payroll / Reports  
CRUD where allowed · Validation · Empty · Error toast · Plan-gated “Upgrade Required” · Coming Soon  

### Profile
Language · Password · Company (tenant) · Logout · Support contact · Biometric  

---

## 9. Session / Security Scenarios (all roles)

| ID | Scenario | Expected |
|----|----------|----------|
| SEC-01 | Refresh token reuse after logout | 401 |
| SEC-02 | Expired access token auto-refresh | New access token or login |
| SEC-03 | CSRF: forged form from other origin | Bearer API ignores cookie CSRF |
| SEC-04 | XSS in project name | No script execution |
| SEC-05 | IDOR project id guessing | 403 |
| SEC-06 | Privilege escalation via role field in PATCH body | Server ignores; stays employee |
| SEC-07 | Concurrent logout | Other device behavior documented |

---

## 10. Priority Execution Order (when credentials work)

1. **Employee** — smallest surface; fastest RBAC negatives  
2. **Supervisor** — field workflows + denied admin  
3. **Manager** — attendance/projects/reports + policy gates  
4. **Tenant** — full admin + login toggles + billing  

Re-run: `node scripts/explore-roles.mjs` after fixing QA users — it will fill `docs/role-exploration/{Role}.md` with redacted `/auth/me` and endpoint matrices.

---

## 11. Local Environment Notes

| Service | URL | Status at audit time |
|---------|-----|----------------------|
| Vite marketing | http://localhost:8080/ | Started |
| Flutter app (static) | http://localhost:4173/app/ | Started (`serve public`) |
| QA API login | `/auth/login` | Reachable; credentials invalid |

**Flutter note:** UI is canvas-based; prefer manual click-through or Flutter driver / semantics for UI automation. API exploration script covers backend RBAC quickly.

---

## 12. Blockers & Next Actions

### Blockers
1. All four provided accounts return **Invalid credentials** on the API the app actually calls (`…/qa`).  
2. Without successful login, UI menus cannot be screenshot-verified live.

### Your next steps
1. Verify users exist in **QA** with exact passwords (or create them as Tenant).  
2. Confirm Tenant has enabled Manager/Supervisor/Employee login toggles.  
3. Re-run `node scripts/explore-roles.mjs`.  
4. Execute suites §2–§6 in Incognito, one role at a time.  
5. Send me redacted `/auth/me` JSON or screenshots — I will mark each case Pass/Fail.

---

## 13. Counts

| Suite | Approx. cases |
|-------|---------------|
| Shared auth | 20 |
| Tenant | ~45 |
| Manager | ~25 |
| Supervisor | ~20 |
| Employee | ~25 |
| Cross-role + security + module pack | 40+ |
| **Total designed** | **150+ scenarios** |

---

*Document status: Test design COMPLETE · Live role walkthrough BLOCKED on credentials · Local servers available for UI once login works.*
