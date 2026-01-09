const express = require('express');
const router = express.Router();
const platformAdminController = require('../controllers/platform-admin.controller');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth.middleware');
const { validateCreateAdminUser } = require('../middleware/validation.middleware');
const auditLogMiddleware = require('../middleware/auditLog.middleware');

// Apply authentication and authorization to all platform-admin routes
router.use(authenticateJWT);
router.use(authorizeRoles('PLATFORM_ADMIN'));
// Apply audit logging to all routes
router.use(auditLogMiddleware);

// Dashboard
router.get('/dashboard/overview', platformAdminController.getDashboardOverview);

// Academics
router.post('/academics/universities', platformAdminController.createUniversity);
router.get('/academics/universities', platformAdminController.listUniversities);
router.post('/academics/programs', platformAdminController.createProgram);
router.get('/academics/programs', platformAdminController.listPrograms);
router.post('/academics/subjects', platformAdminController.createSubject);
router.get('/academics/subjects', platformAdminController.listSubjects);
router.post('/academics/chapters', platformAdminController.createChapter);
router.get('/academics/chapters', platformAdminController.listChapters);

// Engagement
router.post('/engagement/opportunities', platformAdminController.createOpportunity);
router.get('/engagement/opportunities', platformAdminController.listOpportunities);
router.post('/engagement/industry-partners', platformAdminController.createIndustryPartner);
router.get('/engagement/industry-partners', platformAdminController.listIndustryPartners);
router.post('/engagement/assessments', platformAdminController.createAssessment);
router.get('/engagement/assessments', platformAdminController.listAssessments);

// Institutes
router.post('/institutes', platformAdminController.createInstitute);
router.get('/institutes', platformAdminController.listInstitutes);

// Business
router.post('/business/subscription-plans', platformAdminController.createSubscriptionPlan);
router.get('/business/subscription-plans', platformAdminController.listSubscriptionPlans);

// Engagement - Courses
router.post('/engagement/courses', platformAdminController.createCourse);
router.get('/engagement/courses', platformAdminController.listCourses);

// Business - Payments
router.post('/business/payments', platformAdminController.createPayment);
router.get('/business/payments', platformAdminController.listPayments);

// System
router.post('/system/admin-users', validateCreateAdminUser, platformAdminController.createAdminUser);
router.get('/system/admin-users', platformAdminController.listAdminUsers);
router.get('/system/audit-logs', platformAdminController.getAuditLogs);
router.post('/system/platform-settings', platformAdminController.upsertPlatformSetting);
router.get('/system/platform-settings', platformAdminController.listPlatformSettings);
router.post('/system/analytics', platformAdminController.createAnalyticsTrigger);
router.get('/system/analytics', platformAdminController.listAnalyticsTriggers);

module.exports = router;
