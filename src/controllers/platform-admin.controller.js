const platformAdminService = require('../services/platform-admin.service');
const { logDataOperation } = require('../utils/auditLogger.util');

// Dashboard
const getDashboardOverview = async (req, res) => {
  try {
    const result = await platformAdminService.getDashboardOverview();
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Academics
const createUniversity = async (req, res) => {
  try {
    const result = await platformAdminService.createUniversity(req.body);
    // Log the data creation
    await logDataOperation(req, 'DATA_CREATE', 'University', result._id, { name: result.name });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listUniversities = async (req, res) => {
  try {
    const { isActive } = req.query;
    const result = await platformAdminService.listUniversities(isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const createProgram = async (req, res) => {
  try {
    const result = await platformAdminService.createProgram(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listPrograms = async (req, res) => {
  try {
    const { universityId, isActive } = req.query;
    const result = await platformAdminService.listPrograms(universityId, isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const result = await platformAdminService.createSubject(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listSubjects = async (req, res) => {
  try {
    const { programId, universityId, academicYear } = req.query;
    const result = await platformAdminService.listSubjects(programId, universityId, academicYear);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const createChapter = async (req, res) => {
  try {
    const result = await platformAdminService.createChapter(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listChapters = async (req, res) => {
  try {
    const { subjectId, programId, universityId } = req.query;
    const result = await platformAdminService.listChapters(subjectId, programId, universityId);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Engagement
const createOpportunity = async (req, res) => {
  try {
    const result = await platformAdminService.createOpportunity(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listOpportunities = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const result = await platformAdminService.listOpportunities(type, isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const createIndustryPartner = async (req, res) => {
  try {
    const result = await platformAdminService.createIndustryPartner(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listIndustryPartners = async (req, res) => {
  try {
    const result = await platformAdminService.listIndustryPartners();
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const createAssessment = async (req, res) => {
  try {
    const result = await platformAdminService.createAssessment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listAssessments = async (req, res) => {
  try {
    const { partnerId, isActive } = req.query;
    const result = await platformAdminService.listAssessments(partnerId, isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Institutes
const createInstitute = async (req, res) => {
  try {
    const result = await platformAdminService.createInstitute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listInstitutes = async (req, res) => {
  try {
    const { universityId, isActive } = req.query;
    const result = await platformAdminService.listInstitutes(universityId, isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Business
const createSubscriptionPlan = async (req, res) => {
  try {
    const result = await platformAdminService.createSubscriptionPlan(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listSubscriptionPlans = async (req, res) => {
  try {
    const { isActive } = req.query;
    const result = await platformAdminService.listSubscriptionPlans(isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// System
const createAdminUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const createdBy = req.user?._id || req.user?.id || null;
    const result = await platformAdminService.createAdminUser(name, email, role, createdBy);
    res.status(201).json({
      message: 'Admin user created successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listAdminUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const result = await platformAdminService.listAdminUsers(role);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const { userId, action, startDate, endDate, page = 1, limit = 50 } = req.query;
    const result = await platformAdminService.getAuditLogs({
      userId,
      action,
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Courses
const createCourse = async (req, res) => {
  try {
    const result = await platformAdminService.createCourse(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listCourses = async (req, res) => {
  try {
    const { isActive } = req.query;
    const result = await platformAdminService.listCourses(isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Payments
const createPayment = async (req, res) => {
  try {
    const result = await platformAdminService.createPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listPayments = async (req, res) => {
  try {
    const { instituteId, status } = req.query;
    const result = await platformAdminService.listPayments(instituteId, status);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Platform Settings
const upsertPlatformSetting = async (req, res) => {
  try {
    const userId = req.user._id; // From JWT middleware
    const result = await platformAdminService.upsertPlatformSetting(req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listPlatformSettings = async (req, res) => {
  try {
    const { key } = req.query;
    const result = await platformAdminService.listPlatformSettings(key);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

// Analytics
const createAnalyticsTrigger = async (req, res) => {
  try {
    const result = await platformAdminService.createAnalyticsTrigger(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: error.message,
      message: error.message
    });
  }
};

const listAnalyticsTriggers = async (req, res) => {
  try {
    const { isActive } = req.query;
    const result = await platformAdminService.listAnalyticsTriggers(isActive);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message,
      message: error.message,
      statusCode
    });
  }
};

module.exports = {
  getDashboardOverview,
  createUniversity,
  listUniversities,
  createProgram,
  listPrograms,
  createSubject,
  listSubjects,
  createChapter,
  listChapters,
  createOpportunity,
  listOpportunities,
  createIndustryPartner,
  listIndustryPartners,
  createAssessment,
  listAssessments,
  createInstitute,
  listInstitutes,
  createSubscriptionPlan,
  listSubscriptionPlans,
  createAdminUser,
  listAdminUsers,
  getAuditLogs,
  createCourse,
  listCourses,
  createPayment,
  listPayments,
  upsertPlatformSetting,
  listPlatformSettings,
  createAnalyticsTrigger,
  listAnalyticsTriggers
};
