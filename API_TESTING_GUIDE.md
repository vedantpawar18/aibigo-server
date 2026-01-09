# API Testing Guide

## Overview
This guide explains how to test all APIs defined in Swagger to ensure they work correctly with actual data.

## Prerequisites

1. **Server Running**: The server must be running before testing
   ```bash
   npm run dev
   # or
   npm start
   ```

2. **Database Connected**: Ensure MongoDB is connected and accessible

3. **Seed Data** (Optional but recommended): Run seed script to create test data
   ```bash
   npm run seed:all
   ```

## Running Tests

### Automated Test Script

Run the comprehensive test script that tests all 25+ endpoints:

```bash
npm run test:apis
```

This will:
- Test all authentication endpoints
- Test all system endpoints
- Test all platform admin endpoints
- Create test data as needed
- Report pass/fail status for each endpoint

### Manual Testing via Swagger UI

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open Swagger UI:
   ```
   http://localhost:3000/api-docs
   ```

3. Test endpoints in this order:

#### Step 1: Authentication
1. **Register Student** (`POST /api/v1/auth/register`)
   ```json
   {
     "email": "teststudent@email.com",
     "password": "TestStudent123"
   }
   ```

2. **Login** (`POST /api/v1/auth/login`)
   ```json
   {
     "email": "platformadmin@email.com",
     "password": "platformAdmin123"
   }
   ```
   - Copy the `accessToken` from response
   - Click "Authorize" button in Swagger UI
   - Paste token: `Bearer <your-token>`

3. **Forgot Password** (`POST /api/v1/auth/forgot-password`)
   ```json
   {
     "email": "platformadmin@email.com"
   }
   ```

#### Step 2: System APIs
1. **Create Admin User** (`POST /api/v1/system/admin-users`)
   - Requires authentication
   ```json
   {
     "name": "Test Admin",
     "email": "testadmin@email.com",
     "role": "OPERATIONS_ADMIN"
   }
   ```

#### Step 3: Platform Admin APIs

**Dashboard:**
- `GET /api/v1/platform-admin/dashboard/overview`

**Academics (in order):**
1. `POST /api/v1/platform-admin/academics/universities`
   ```json
   {
     "name": "Test University",
     "code": "TU001",
     "state": "Maharashtra",
     "country": "India",
     "isActive": true
   }
   ```
   - Save the `_id` from response

2. `GET /api/v1/platform-admin/academics/universities`

3. `POST /api/v1/platform-admin/academics/programs`
   ```json
   {
     "universityId": "<university-id-from-step-1>",
     "name": "B.E Computer Engineering",
     "code": "BE-COMP",
     "durationYears": 4,
     "isActive": true
   }
   ```
   - Save the `_id` from response

4. `GET /api/v1/platform-admin/academics/programs`

5. `POST /api/v1/platform-admin/academics/subjects`
   ```json
   {
     "programId": "<program-id-from-step-3>",
     "universityId": "<university-id-from-step-1>",
     "academicYear": 2,
     "subjectName": "Operating Systems",
     "subjectCode": "OS"
   }
   ```
   - Save the `_id` from response

6. `GET /api/v1/platform-admin/academics/subjects`

7. `POST /api/v1/platform-admin/academics/chapters`
   ```json
   {
     "subjectId": "<subject-id-from-step-5>",
     "programId": "<program-id-from-step-3>",
     "universityId": "<university-id-from-step-1>",
     "chapterNumber": 1,
     "chapterTitle": "Introduction to OS"
   }
   ```

8. `GET /api/v1/platform-admin/academics/chapters`

**Engagement:**
1. `POST /api/v1/platform-admin/engagement/opportunities`
   ```json
   {
     "type": "JOB",
     "title": "Software Engineer",
     "organization": "Tech Company",
     "description": "Job description",
     "applyUrl": "https://example.com/apply",
     "expiryDate": "2024-12-31T23:59:59.000Z"
   }
   ```

2. `GET /api/v1/platform-admin/engagement/opportunities`

3. `POST /api/v1/platform-admin/engagement/industry-partners`
   ```json
   {
     "name": "TCS",
     "description": "Tata Consultancy Services",
     "website": "https://www.tcs.com"
   }
   ```
   - Save the `_id` from response

4. `GET /api/v1/platform-admin/engagement/industry-partners`

5. `POST /api/v1/platform-admin/engagement/assessments`
   ```json
   {
     "partnerId": "<partner-id-from-step-3>",
     "name": "Technical Assessment",
     "skillCategory": "TECHNICAL",
     "timeLimit": 60
   }
   ```

6. `GET /api/v1/platform-admin/engagement/assessments`

7. `POST /api/v1/platform-admin/engagement/courses`
   ```json
   {
     "title": "Full Stack Development",
     "description": "Learn full stack development",
     "duration": "40 hours",
     "price": 5000,
     "registrationUrl": "https://example.com/register",
     "isActive": true
   }
   ```

8. `GET /api/v1/platform-admin/engagement/courses`

**Institutes:**
1. `POST /api/v1/platform-admin/business/subscription-plans`
   ```json
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
   ```
   - Save the `_id` from response

2. `GET /api/v1/platform-admin/business/subscription-plans`

3. `POST /api/v1/platform-admin/institutes`
   ```json
   {
     "name": "Test Institute",
     "state": "Maharashtra",
     "universityId": "<university-id>",
     "subscriptionPlanId": "<plan-id-from-step-1>"
   }
   ```
   - Save the `_id` from response

4. `GET /api/v1/platform-admin/institutes`

**Business:**
1. `POST /api/v1/platform-admin/business/payments`
   ```json
   {
     "instituteId": "<institute-id>",
     "subscriptionPlanId": "<plan-id>",
     "amount": 250000,
     "status": "PAID",
     "startDate": "2024-01-01T00:00:00.000Z",
     "endDate": "2024-12-31T23:59:59.000Z",
     "paymentMethod": "BANK_TRANSFER"
   }
   ```

2. `GET /api/v1/platform-admin/business/payments`

**System:**
1. `GET /api/v1/platform-admin/system/admin-users`

2. `GET /api/v1/platform-admin/system/audit-logs`
   - Try with query parameters:
     - `?page=1&limit=10`
     - `?action=LOGIN_SUCCESS`
     - `?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z`

3. `POST /api/v1/platform-admin/system/platform-settings`
   ```json
   {
     "key": "MAX_STUDENTS",
     "value": "1000",
     "description": "Maximum students allowed",
     "targetPlans": ["ALL"]
   }
   ```

4. `GET /api/v1/platform-admin/system/platform-settings`

5. `POST /api/v1/platform-admin/system/analytics`
   ```json
   {
     "triggerType": "DAILY",
     "reportType": "USAGE",
     "isActive": true
   }
   ```

6. `GET /api/v1/platform-admin/system/analytics`

**Logs:**
1. `GET /api/v1/platform-admin/system/logs/files`

2. `GET /api/v1/platform-admin/system/logs/recent?lines=10`

3. `GET /api/v1/platform-admin/system/logs/statistics`

4. `GET /api/v1/platform-admin/system/logs/files/{filename}`
   - Replace `{filename}` with actual log file name from step 1

## Expected Results

### Success Indicators:
- ✅ Status code: 200 (GET), 201 (POST), 204 (OPTIONS)
- ✅ Response contains expected data structure
- ✅ Relationships are populated (e.g., university in program response)
- ✅ No error messages in response

### Common Issues:

1. **401 Unauthorized**
   - Solution: Ensure you're logged in and token is valid
   - Re-login and update token in Swagger UI

2. **403 Forbidden**
   - Solution: Ensure user has PLATFORM_ADMIN role
   - Check user role in database

3. **404 Not Found**
   - Solution: Check if referenced IDs exist
   - Verify data was created successfully

4. **400 Bad Request**
   - Solution: Check request body format
   - Verify all required fields are provided
   - Check data types match schema

5. **500 Internal Server Error**
   - Solution: Check server logs
   - Verify database connection
   - Check for missing dependencies

## Test Data Dependencies

Some endpoints require data from previous endpoints:

```
Universities → Programs → Subjects → Chapters
Industry Partners → Assessments
Universities + Subscription Plans → Institutes → Payments
```

## Verification Checklist

After testing, verify:

- [ ] All authentication endpoints work
- [ ] All CRUD operations work (Create, Read)
- [ ] Relationships are properly populated
- [ ] Error handling works correctly
- [ ] Pagination works (where applicable)
- [ ] Filtering works (where applicable)
- [ ] Audit logs are being created
- [ ] Log files are accessible
- [ ] Dashboard shows correct statistics

## Automated Test Results

The test script (`npm run test:apis`) will output:
- ✅ Passed tests
- ❌ Failed tests with error details
- ⚠️ Skipped tests (if any)

Review failed tests and fix issues before deployment.

## Next Steps

1. Fix any failing tests
2. Add more test cases for edge cases
3. Test with different user roles
4. Test error scenarios
5. Performance testing for large datasets
