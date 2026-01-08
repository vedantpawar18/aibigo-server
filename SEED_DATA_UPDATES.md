# Seed Data Updates Summary

## ✅ Changes Made

### 1. New Repository Imports Added
- ✅ `CourseRepository`
- ✅ `PaymentRepository`
- ✅ `PlatformSettingRepository`
- ✅ `AnalyticsTriggerRepository`

### 2. New Seed Data Sections

#### Courses (Section 11)
Created 3 sample courses:
- **Full Stack Web Development** - 12 weeks, ₹5000
  - Visible to: BE-COMP, BSC-CS programs
  - Plans: PREMIUM, ENTERPRISE
- **Data Science Fundamentals** - 10 weeks, ₹6000
  - Visible to: BE-COMP program
  - Plans: PREMIUM
- **Cloud Computing with AWS** - 8 weeks, ₹7000
  - Visible to: BE-COMP, BSC-CS programs
  - Plans: ALL

#### Payments (Section 12)
Created 2 payment records for the institute:
- **Payment 1**: ₹250,000 - PAID (2024)
  - Invoice: INV-2024-001
  - Transaction: TXN-2024-001
- **Payment 2**: ₹250,000 - PENDING (2025)
  - Invoice: INV-2025-001

#### Platform Settings (Section 13)
Created 6 platform settings:
- `FEATURE_AI_SUMMARY` - Boolean (true)
  - Plans: PREMIUM, ENTERPRISE
- `FEATURE_INDUSTRY_ASSESSMENTS` - Boolean (true)
  - Plans: PREMIUM, ENTERPRISE
- `FEATURE_RESUME_TOOLS` - Boolean (true)
  - Plans: ALL
- `FEATURE_JOB_BOARD` - Boolean (true)
  - Plans: ALL
- `APP_ANNOUNCEMENT` - Object (announcement data)
  - Plans: ALL
- `MAX_FILE_UPLOAD_SIZE` - Number (10MB in bytes)
  - Plans: ALL

#### Analytics Triggers (Section 14)
Created 4 analytics triggers:
- **Daily Usage Report** - Active
  - Metrics: aiUsage, activeUsers, pageViews
- **Weekly Performance Report** - Active
  - Metrics: responseTime, errorRate, throughput
- **Monthly Revenue Report** - Active
  - Metrics: revenue, subscriptions, churnRate
- **Daily Engagement Report** - Inactive
  - Metrics: opportunityViews, assessmentCompletions, courseEnrollments

### 3. Updated Summary
The summary section now includes:
- Courses count
- Payments count
- Platform Settings count
- Analytics Triggers count

## 📋 Seed Data Structure

### Course Data Structure
```javascript
{
  title: String,
  description: String,
  duration: String,
  price: Number,
  registrationUrl: String,
  visibilityRules: {
    programs: [ObjectId],
    plans: ['BASIC' | 'PREMIUM' | 'ENTERPRISE']
  },
  isActive: Boolean
}
```

### Payment Data Structure
```javascript
{
  instituteId: ObjectId,
  subscriptionPlanId: ObjectId,
  amount: Number,
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
  startDate: Date,
  endDate: Date,
  invoiceRef: String,
  paymentMethod: String,
  transactionId: String
}
```

### Platform Setting Data Structure
```javascript
{
  key: String (uppercase),
  value: Mixed (boolean, number, string, or object),
  targetPlans: ['BASIC' | 'PREMIUM' | 'ENTERPRISE' | 'ALL'],
  description: String,
  updatedBy: ObjectId (user ID)
}
```

### Analytics Trigger Data Structure
```javascript
{
  triggerType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM',
  reportType: 'USAGE' | 'PERFORMANCE' | 'REVENUE' | 'ENGAGEMENT' | 'CUSTOM',
  config: Object (custom configuration),
  isActive: Boolean
}
```

## 🔄 Data Relationships

- **Courses** → Reference Programs (BE-COMP, BSC-CS)
- **Payments** → Reference Institute and Subscription Plan
- **Platform Settings** → Reference Platform Admin user (updatedBy)
- **Analytics Triggers** → Standalone (no references)

## ✅ Validation

All seed data:
- ✅ Matches model schemas
- ✅ Uses correct data types
- ✅ Includes required fields
- ✅ References existing entities (programs, institutes, plans)
- ✅ Follows the same pattern as existing seed data

## 🚀 Running Seed Data

```bash
cd aibigo-server
node src/scripts/seed-data.js
```

The script will:
1. Connect to database
2. Check if data exists (idempotent)
3. Create missing data
4. Display summary
5. Disconnect from database
