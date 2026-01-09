// Platform Admin Service
// Business logic for platform admin operations

const UniversityRepository = require('../repositories/University.repository');
const ProgramRepository = require('../repositories/Program.repository');
const SubjectRepository = require('../repositories/Subject.repository');
const ChapterRepository = require('../repositories/Chapter.repository');
const OpportunityRepository = require('../repositories/Opportunity.repository');
const IndustryPartnerRepository = require('../repositories/IndustryPartner.repository');
const AssessmentRepository = require('../repositories/Assessment.repository');
const InstituteRepository = require('../repositories/Institute.repository');
const SubscriptionPlanRepository = require('../repositories/SubscriptionPlan.repository');
const UserRepository = require('../repositories/User.repository');
const PaymentRepository = require('../repositories/Payment.repository');
const CourseRepository = require('../repositories/Course.repository');
const PlatformSettingRepository = require('../repositories/PlatformSetting.repository');
const AnalyticsTriggerRepository = require('../repositories/AnalyticsTrigger.repository');
const AuditLogRepository = require('../repositories/AuditLog.repository');

/**
 * Get dashboard overview - Optimized with aggregation for cost efficiency
 */
const getDashboardOverview = async () => {
  // Use aggregation pipelines to get all metrics in fewer queries
  const [instituteStats, studentCount, opportunityCount, assessmentCount, paymentStats] = await Promise.all([
    // Institute statistics using aggregation
    InstituteRepository.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          inactive: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          }
        }
      }
    ]),
    // Student count
    UserRepository.count({ role: 'STUDENT' }),
    // Active opportunities count
    OpportunityRepository.count({ isActive: true }),
    // Active assessments count
    AssessmentRepository.count({ isActive: true }),
    // Payment statistics for revenue and expiring subscriptions
    PaymentRepository.aggregate([
      {
        $match: {
          status: 'PAID',
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() }
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$startDate', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                    { $lte: ['$startDate', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)] }
                  ]
                },
                '$amount',
                0
              ]
            }
          },
          subscriptionsExpiring: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$endDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
                    { $gte: ['$endDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])
  ]);

  const instituteData = instituteStats[0] || { total: 0, active: 0, inactive: 0 };
  const paymentData = paymentStats[0] || { monthlyRevenue: 0, subscriptionsExpiring: 0 };

  return {
    institutes: {
      total: instituteData.total,
      active: instituteData.active,
      inactive: instituteData.inactive
    },
    subscriptionsExpiring: paymentData.subscriptionsExpiring || 0,
    studentsCount: studentCount || 0,
    activeOpportunities: opportunityCount || 0,
    activeAssessments: assessmentCount || 0,
    monthlyRevenue: paymentData.monthlyRevenue || 0
  };
};

/**
 * Create university
 */
const createUniversity = async (data) => {
  const { name, code, state, country, isActive } = data;
  
  // Check if code already exists
  const existing = await UniversityRepository.findOne({ code });
  if (existing) {
    const error = new Error(`University with code ${code} already exists`);
    error.statusCode = 409;
    throw error;
  }
  
  const university = await UniversityRepository.create({
    name,
    code,
    state,
    country: country || 'India',
    isActive: isActive !== undefined ? isActive : true
  });
  
  return university;
};

/**
 * List universities
 */
const listUniversities = async (isActive) => {
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const universities = await UniversityRepository.find(query, {
    sort: { name: 1 }
  });
  
  return universities;
};

/**
 * Create program
 */
const createProgram = async (data) => {
  const { universityId, name, code, durationYears, isActive } = data;
  
  // Verify university exists
  const university = await UniversityRepository.findById(universityId);
  if (!university) {
    const error = new Error('University not found');
    error.statusCode = 404;
    throw error;
  }
  
  const program = await ProgramRepository.create({
    universityId,
    name,
    code,
    durationYears,
    isActive: isActive !== undefined ? isActive : true
  });
  
  // Populate university before returning
  const populatedProgram = await ProgramRepository.findById(program._id, {
    populate: 'universityId'
  });
  
  return populatedProgram;
};

/**
 * List programs
 */
const listPrograms = async (universityId, isActive) => {
  const query = {};
  if (universityId) {
    query.universityId = universityId;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  // Use nested population for better data relationships
  const programs = await ProgramRepository.find(query, {
    sort: { name: 1 },
    populate: {
      path: 'universityId',
      select: 'name code state country'
    }
  });
  
  return programs;
};

/**
 * Create subject
 */
const createSubject = async (data) => {
  const { programId, universityId, academicYear, subjectName, subjectCode, recommendedBooks } = data;
  
  // Verify program exists
  const program = await ProgramRepository.findById(programId);
  if (!program) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Use provided universityId or get from program
  const finalUniversityId = universityId || program.universityId;
  
  // Verify university exists
  const university = await UniversityRepository.findById(finalUniversityId);
  if (!university) {
    const error = new Error('University not found');
    error.statusCode = 404;
    throw error;
  }
  
  const subject = await SubjectRepository.create({
    programId,
    universityId: finalUniversityId,
    academicYear,
    subjectName,
    subjectCode,
    recommendedBooks: recommendedBooks || []
  });
  
  // Populate program and university before returning
  const populatedSubject = await SubjectRepository.findById(subject._id, {
    populate: ['programId', 'universityId']
  });
  
  return populatedSubject;
};

/**
 * List subjects
 */
const listSubjects = async (programId, universityId, academicYear) => {
  const query = {};
  if (programId) {
    query.programId = programId;
  }
  if (universityId) {
    query.universityId = universityId;
  }
  if (academicYear) {
    query.academicYear = parseInt(academicYear);
  }
  
  // Optimize with nested population - only select needed fields
  const subjects = await SubjectRepository.find(query, {
    sort: { academicYear: 1, subjectName: 1 },
    populate: [
      {
        path: 'programId',
        select: 'name code durationYears universityId',
        populate: {
          path: 'universityId',
          select: 'name code'
        }
      },
      {
        path: 'universityId',
        select: 'name code state'
      }
    ]
  });
  
  return subjects;
};

/**
 * Create chapter
 */
const createChapter = async (data) => {
  const { subjectId, programId, universityId, chapterNumber, chapterTitle } = data;
  
  // Verify subject exists
  const subject = await SubjectRepository.findById(subjectId);
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Use provided IDs or get from subject
  const finalProgramId = programId || subject.programId;
  const finalUniversityId = universityId || subject.universityId;
  
  // Verify program exists
  const program = await ProgramRepository.findById(finalProgramId);
  if (!program) {
    const error = new Error('Program not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Verify university exists
  const university = await UniversityRepository.findById(finalUniversityId);
  if (!university) {
    const error = new Error('University not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Check if chapter number already exists for this subject
  const existing = await ChapterRepository.findOne({ subjectId, chapterNumber });
  if (existing) {
    const error = new Error(`Chapter ${chapterNumber} already exists for this subject`);
    error.statusCode = 409;
    throw error;
  }
  
  const chapter = await ChapterRepository.create({
    subjectId,
    programId: finalProgramId,
    universityId: finalUniversityId,
    chapterNumber,
    chapterTitle
  });
  
  // Populate subject, program, and university before returning
  const populatedChapter = await ChapterRepository.findById(chapter._id, {
    populate: ['subjectId', 'programId', 'universityId']
  });
  
  return populatedChapter;
};

/**
 * List chapters
 */
const listChapters = async (subjectId, programId, universityId) => {
  const query = {};
  if (subjectId) {
    query.subjectId = subjectId;
  }
  if (programId) {
    query.programId = programId;
  }
  if (universityId) {
    query.universityId = universityId;
  }
  
  // Optimize with nested population for complete relational data
  const chapters = await ChapterRepository.find(query, {
    sort: { chapterNumber: 1 },
    populate: [
      {
        path: 'subjectId',
        select: 'subjectName subjectCode academicYear',
        populate: {
          path: 'programId',
          select: 'name code',
          populate: {
            path: 'universityId',
            select: 'name code'
          }
        }
      },
      {
        path: 'programId',
        select: 'name code universityId',
        populate: {
          path: 'universityId',
          select: 'name code'
        }
      },
      {
        path: 'universityId',
        select: 'name code state'
      }
    ]
  });
  
  return chapters;
};

/**
 * Create opportunity
 */
const createOpportunity = async (data) => {
  const { type, title, organization, description, applyUrl, eligibility, expiryDate } = data;
  
  const opportunity = await OpportunityRepository.create({
    type,
    title,
    organization,
    description,
    applyUrl,
    eligibility: eligibility || {},
    expiryDate: new Date(expiryDate),
    isActive: true
  });
  
  return opportunity;
};

/**
 * List opportunities
 */
const listOpportunities = async (type, isActive) => {
  const query = {};
  if (type) {
    query.type = type;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const opportunities = await OpportunityRepository.find(query, {
    sort: { createdAt: -1 }
  });
  
  return opportunities;
};

/**
 * Create industry partner
 */
const createIndustryPartner = async (data) => {
  const { name, description, website } = data;
  
  const partner = await IndustryPartnerRepository.create({
    name,
    description,
    website
  });
  
  return partner;
};

/**
 * List industry partners
 */
const listIndustryPartners = async () => {
  const partners = await IndustryPartnerRepository.find({}, {
    sort: { name: 1 }
  });
  
  return partners;
};

/**
 * Create assessment
 */
const createAssessment = async (data) => {
  const { partnerId, name, skillCategory, timeLimit } = data;
  
  // Verify partner exists
  const partner = await IndustryPartnerRepository.findById(partnerId);
  if (!partner) {
    const error = new Error('Industry partner not found');
    error.statusCode = 404;
    throw error;
  }
  
  const assessment = await AssessmentRepository.create({
    partnerId,
    name,
    skillCategory,
    timeLimit,
    isActive: true
  });
  
  // Populate partner before returning
  const populatedAssessment = await AssessmentRepository.findById(assessment._id, {
    populate: 'partnerId'
  });
  
  return populatedAssessment;
};

/**
 * List assessments
 */
const listAssessments = async (partnerId, isActive) => {
  const query = {};
  if (partnerId) {
    query.partnerId = partnerId;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const assessments = await AssessmentRepository.find(query, {
    sort: { createdAt: -1 },
    populate: 'partnerId'
  });
  
  return assessments;
};

/**
 * Create institute
 */
const createInstitute = async (data) => {
  const { name, state, universityId, subscriptionPlanId } = data;
  
  // Verify university exists
  const university = await UniversityRepository.findById(universityId);
  if (!university) {
    const error = new Error('University not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Verify subscription plan exists
  const plan = await SubscriptionPlanRepository.findById(subscriptionPlanId);
  if (!plan) {
    const error = new Error('Subscription plan not found');
    error.statusCode = 404;
    throw error;
  }
  
  const institute = await InstituteRepository.create({
    name,
    state,
    universityId,
    subscriptionPlanId,
    isActive: true
  });
  
  // Populate university and subscription plan before returning
  const populatedInstitute = await InstituteRepository.findById(institute._id, {
    populate: ['universityId', 'subscriptionPlanId']
  });
  
  return populatedInstitute;
};

/**
 * List institutes
 */
const listInstitutes = async (universityId, isActive) => {
  const query = {};
  if (universityId) {
    query.universityId = universityId;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  // Optimize with nested population for complete relational data
  const institutes = await InstituteRepository.find(query, {
    sort: { name: 1 },
    populate: [
      {
        path: 'universityId',
        select: 'name code state country'
      },
      {
        path: 'subscriptionPlanId',
        select: 'name features limits price'
      }
    ]
  });
  
  return institutes;
};

/**
 * Create subscription plan
 */
const createSubscriptionPlan = async (data) => {
  const { name, features, limits, price } = data;
  
  // Check if plan name already exists
  const existing = await SubscriptionPlanRepository.findOne({ name });
  if (existing) {
    const error = new Error(`Subscription plan ${name} already exists`);
    error.statusCode = 409;
    throw error;
  }
  
  const plan = await SubscriptionPlanRepository.create({
    name,
    features: features || { aiSummary: false, industryAssessments: false },
    limits: limits || { students: 0, aiUsage: 0 },
    price,
    isActive: true
  });
  
  return plan;
};

/**
 * List subscription plans
 */
const listSubscriptionPlans = async (isActive) => {
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const plans = await SubscriptionPlanRepository.find(query, {
    sort: { price: 1 }
  });
  
  return plans;
};

/**
 * Create admin user
 */
const createAdminUser = async (name, email, role, createdBy = null) => {
  // Reuse system service
  const systemService = require('./system.service');
  return await systemService.createAdminUser(name, email, role, createdBy);
};

/**
 * List admin users
 */
const listAdminUsers = async (role) => {
  const query = { role: { $in: ['PLATFORM_ADMIN', 'OPERATIONS_ADMIN', 'FACULTY'] } };
  if (role) {
    query.role = role;
  }
  
  const users = await UserRepository.find(query, {
    sort: { createdAt: -1 }
  });
  
  // Remove password hash from response
  return users.map(user => {
    const { passwordHash, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  });
};

/**
 * Get audit logs - Optimized with pagination and filters
 */
const getAuditLogs = async (filters) => {
  const result = await AuditLogRepository.findWithPagination(filters, {
    page: filters.page || 1,
    limit: filters.limit || 50
  });
  
  return result;
};

/**
 * Create course
 */
const createCourse = async (data) => {
  const { title, description, duration, price, registrationUrl, visibilityRules, isActive } = data;
  
  const course = await CourseRepository.create({
    title,
    description,
    duration,
    price,
    registrationUrl,
    visibilityRules: visibilityRules || {},
    isActive: isActive !== undefined ? isActive : true
  });
  
  return course;
};

/**
 * List courses
 */
const listCourses = async (isActive) => {
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const courses = await CourseRepository.find(query, {
    sort: { createdAt: -1 }
  });
  
  return courses;
};

/**
 * Create payment
 */
const createPayment = async (data) => {
  const { instituteId, subscriptionPlanId, amount, status, startDate, endDate, invoiceRef, paymentMethod, transactionId } = data;
  
  // Verify institute exists
  const institute = await InstituteRepository.findById(instituteId);
  if (!institute) {
    const error = new Error('Institute not found');
    error.statusCode = 404;
    throw error;
  }
  
  // Verify subscription plan exists
  const plan = await SubscriptionPlanRepository.findById(subscriptionPlanId);
  if (!plan) {
    const error = new Error('Subscription plan not found');
    error.statusCode = 404;
    throw error;
  }
  
  const payment = await PaymentRepository.create({
    instituteId,
    subscriptionPlanId,
    amount,
    status: status || 'PENDING',
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    invoiceRef,
    paymentMethod: paymentMethod || 'BANK_TRANSFER',
    transactionId
  });
  
  // Populate institute and subscription plan before returning
  const populatedPayment = await PaymentRepository.findById(payment._id, {
    populate: ['instituteId', 'subscriptionPlanId']
  });
  
  return populatedPayment;
};

/**
 * List payments
 */
const listPayments = async (instituteId, status) => {
  const query = {};
  if (instituteId) {
    query.instituteId = instituteId;
  }
  if (status) {
    query.status = status;
  }
  
  // Optimize with nested population for complete relational data
  const payments = await PaymentRepository.find(query, {
    sort: { createdAt: -1 },
    populate: [
      {
        path: 'instituteId',
        select: 'name state universityId subscriptionPlanId',
        populate: [
          {
            path: 'universityId',
            select: 'name code'
          },
          {
            path: 'subscriptionPlanId',
            select: 'name price'
          }
        ]
      },
      {
        path: 'subscriptionPlanId',
        select: 'name features limits price'
      }
    ]
  });
  
  return payments;
};

/**
 * Upsert platform setting
 */
const upsertPlatformSetting = async (data, userId) => {
  const { key, value, targetPlans, description } = data;
  
  // Check if setting exists
  let setting = await PlatformSettingRepository.findOne({ key: key.toUpperCase() });
  
  if (setting) {
    // Update existing
    setting = await PlatformSettingRepository.updateById(setting._id, {
      value,
      targetPlans: targetPlans || ['ALL'],
      description,
      updatedBy: userId
    });
  } else {
    // Create new
    setting = await PlatformSettingRepository.create({
      key: key.toUpperCase(),
      value,
      targetPlans: targetPlans || ['ALL'],
      description,
      updatedBy: userId
    });
  }
  
  return setting;
};

/**
 * List platform settings
 */
const listPlatformSettings = async (key) => {
  const query = {};
  if (key) {
    query.key = key.toUpperCase();
  }
  
  const settings = await PlatformSettingRepository.find(query, {
    sort: { key: 1 }
  });
  
  return settings;
};

/**
 * Create analytics trigger
 */
const createAnalyticsTrigger = async (data) => {
  const { triggerType, reportType, config, isActive } = data;
  
  const trigger = await AnalyticsTriggerRepository.create({
    triggerType,
    reportType,
    config: config || {},
    isActive: isActive !== undefined ? isActive : true
  });
  
  return trigger;
};

/**
 * List analytics triggers
 */
const listAnalyticsTriggers = async (isActive) => {
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }
  
  const triggers = await AnalyticsTriggerRepository.find(query, {
    sort: { createdAt: -1 }
  });
  
  return triggers;
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
