(MASTER FILE – derived from your PRD)

Purpose

Defines Platform-Admin role, all APIs, payloads, permissions, and data ownership.

Role: Platform-Admin (SUPER_ADMIN)
Allowed

Academic masters

Institutes

Engagement modules

Subscriptions & payments

Admin users

Platform settings

Analytics triggers

Not Allowed

Faculty onboarding

Student onboarding

Faculty content upload

Institute-level configuration

API BASE PATH
/api/v1/platform-admin


JWT Required: ✅
Role Required: SUPER_ADMIN

🔹 DASHBOARD
GET Dashboard Metrics
GET /dashboard/overview


Response

{
  "institutes": {
    "total": 120,
    "active": 98,
    "inactive": 22
  },
  "subscriptionsExpiring": 14,
  "studentsCount": 24500,
  "activeOpportunities": 32,
  "activeAssessments": 11,
  "monthlyRevenue": 840000
}

🔹 ACADEMIC SETUP
Universities
Create University
POST /academics/universities

{
  "name": "Savitribai Phule Pune University",
  "code": "SPPU",
  "state": "Maharashtra",
  "country": "India",
  "isActive": true
}

List Universities
GET /academics/universities

Degree Programs
Create Program
POST /academics/programs

{
  "universityId": "ObjectId",
  "name": "B.E Computer Engineering",
  "code": "BE-COMP",
  "durationYears": 4,
  "isActive": true
}

Syllabus Manager (CRITICAL)
Create Subject
POST /academics/subjects

{
  "programId": "ObjectId",
  "academicYear": 2,
  "subjectName": "Operating Systems",
  "subjectCode": "OS",
  "recommendedBooks": [
    {
      "title": "Operating System Concepts",
      "author": "Silberschatz"
    }
  ]
}

Add Chapter
POST /academics/chapters

{
  "subjectId": "ObjectId",
  "chapterNumber": 1,
  "chapterTitle": "Process Management"
}


❗ No pedagogy, outcomes, MCQs here — metadata only.

🔹 ENGAGEMENT
Opportunities
Create Opportunity
POST /engagement/opportunities

{
  "type": "JOB",
  "title": "Backend Developer Intern",
  "organization": "TCS",
  "description": "...",
  "applyUrl": "https://...",
  "eligibility": {
    "programs": ["ObjectId"],
    "years": [3,4],
    "plans": ["PREMIUM"]
  },
  "expiryDate": "2026-03-31"
}

Industry Assessments
Add Partner
POST /engagement/industry-partners

Upload Assessment
POST /engagement/assessments

{
  "partnerId": "ObjectId",
  "name": "Node.js Skill Test",
  "skillCategory": "Backend",
  "timeLimit": 60
}

🔹 INSTITUTES
Add Institute
POST /institutes

{
  "name": "XYZ Engineering College",
  "state": "MH",
  "universityId": "ObjectId",
  "subscriptionPlanId": "ObjectId"
}

🔹 BUSINESS
Subscription Plans
Create Plan
POST /business/subscription-plans

{
  "name": "PREMIUM",
  "features": {
    "aiSummary": true,
    "industryAssessments": true
  },
  "limits": {
    "students": 5000,
    "aiUsage": 100000
  },
  "price": 250000
}

🔹 SYSTEM
Admin Users
POST /system/admin-users

{
  "name": "Ops Admin",
  "email": "ops@focused.ai",
  "role": "OPERATIONS_ADMIN"
}

Audit Logs (Read Only)
GET /system/audit-logs