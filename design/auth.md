1. AUTH OVERVIEW
Authentication Type

Email + Password

JWT-based (Access + optional Refresh)

Role-Based Access Control (RBAC)

Scope-based permissions (future-proof)

Supported Clients

Web (Platform Admin)

Web (Operations Admin)

Web / Mobile (Faculty, Students)

2. USER ROLES (SYSTEM-WIDE)
Role Code	Description	Created By
SUPER_ADMIN	Platform Admin	System Seed
OPERATIONS_ADMIN	Institute Ops	SUPER_ADMIN
FACULTY	Teaching Staff	OPERATIONS_ADMIN
STUDENT	End User	Institute / Self
INDUSTRY_ADMIN	Industry Partner (future)	SUPER_ADMIN

⚠️ Roles are system constants — never editable via UI.

3. USER ENTITY (DB MODEL)
{
  "_id": "ObjectId",
  "email": "user@email.com",
  "passwordHash": "bcrypt_hash",
  "role": "STUDENT",
  "status": "ACTIVE",
  "linkedEntity": {
    "type": "INSTITUTE | FACULTY | INDUSTRY | NONE",
    "id": "ObjectId"
  },
  "lastLoginAt": "Date",
  "createdAt": "Date"
}

Status Values

ACTIVE

SUSPENDED

LOCKED

4. REGISTRATION FLOWS
4.1 Student Self Registration
POST /api/v1/auth/register


Payload

{
  "email": "student@email.com",
  "password": "StrongPassword123"
}


Rules

Role = STUDENT

No institute assigned initially

Email verification (future)

Rate limited

4.2 Admin User Creation (No Self Signup)

Admins cannot self-register.

Role	Created By
SUPER_ADMIN	Seed Script
OPERATIONS_ADMIN	SUPER_ADMIN
FACULTY	OPERATIONS_ADMIN
POST /api/v1/system/admin-users

{
  "name": "Admin Name",
  "email": "admin@focused.ai",
  "role": "OPERATIONS_ADMIN"
}


Password is auto-generated and emailed OR set via reset flow.

5. LOGIN FLOW
POST /api/v1/auth/login


Payload

{
  "email": "user@email.com",
  "password": "password"
}

Steps

Validate email exists

Check status ≠ SUSPENDED / LOCKED

bcrypt.compare

Generate JWT

Update lastLoginAt

6. JWT STRUCTURE
Access Token (24h)
{
  "sub": "userId",
  "role": "SUPER_ADMIN",
  "permissions": ["ACADEMICS:WRITE", "INSTITUTES:READ"],
  "iat": 1700000000,
  "exp": 1700086400
}

Refresh Token (Optional)

7–30 days

Stored hashed in DB

One per device (future)

7. PERMISSIONS MODEL (RBAC + SCOPES)
Permission Format
MODULE:ACTION


Examples:

ACADEMICS:READ

ACADEMICS:WRITE

INSTITUTES:WRITE

PAYMENTS:READ

USERS:MANAGE

Role → Permission Mapping
SUPER_ADMIN
*

OPERATIONS_ADMIN
INSTITUTES:WRITE
FACULTY:WRITE
STUDENTS:WRITE

FACULTY
SYLLABUS:READ
AI:GENERATE
CONTENT:WRITE

STUDENT
LEARNING:READ
ASSESSMENTS:ATTEMPT
JOBS:APPLY


Permissions are resolved dynamically at login and embedded in JWT.

8. AUTH MIDDLEWARES
8.1 authenticateJWT

Verifies token

Attaches req.user

8.2 authorizeRoles(...roles)
authorizeRoles("SUPER_ADMIN", "OPERATIONS_ADMIN")

8.3 authorizePermissions(...perms)
authorizePermissions("ACADEMICS:WRITE")

9. PASSWORD SECURITY
Hashing

bcrypt

Salt rounds: 10–12

Rules

Minimum 8 chars

Uppercase + number recommended

No plaintext storage

10. PASSWORD RESET FLOW
Request Reset
POST /api/v1/auth/forgot-password

Reset
POST /api/v1/auth/reset-password


Rules:

Token expires in 15 mins

Single-use token

Invalidates all active JWTs

11. ACCOUNT LOCKING
Trigger

5 consecutive failed logins

Action

Status = LOCKED

Admin unlock required

12. AUDIT LOGGING (MANDATORY)

Logged Events:

Login success / failure

Password reset

Role assignment

Admin creation

Account suspension

{
  "userId": "ObjectId",
  "action": "LOGIN_SUCCESS",
  "ip": "x.x.x.x",
  "timestamp": "Date"
}

13. MULTI-TENANCY SUPPORT (FUTURE-SAFE)

Every request carries:

x-institute-id


Used to:

Isolate students

Scope faculty access

Apply subscription rules

SUPER_ADMIN ignores tenant scope.

14. SECURITY HARDENING

Rate limit login & register

Helmet headers

CORS allowlist

Brute-force protection

IP logging

15. SEED DATA (MANDATORY)

Initial SUPER_ADMIN:

{
  "email": "admin@focused.ai",
  "role": "SUPER_ADMIN"
}


Seed script only.
Never via API.