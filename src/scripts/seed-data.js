require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/database');
const bcrypt = require('bcrypt');

// Repositories
const UserRepository = require('../repositories/User.repository');
const UniversityRepository = require('../repositories/University.repository');
const ProgramRepository = require('../repositories/Program.repository');
const SubjectRepository = require('../repositories/Subject.repository');
const ChapterRepository = require('../repositories/Chapter.repository');
const OpportunityRepository = require('../repositories/Opportunity.repository');
const IndustryPartnerRepository = require('../repositories/IndustryPartner.repository');
const AssessmentRepository = require('../repositories/Assessment.repository');
const InstituteRepository = require('../repositories/Institute.repository');
const SubscriptionPlanRepository = require('../repositories/SubscriptionPlan.repository');
const CourseRepository = require('../repositories/Course.repository');
const PaymentRepository = require('../repositories/Payment.repository');
const PlatformSettingRepository = require('../repositories/PlatformSetting.repository');
const AnalyticsTriggerRepository = require('../repositories/AnalyticsTrigger.repository');

/**
 * Comprehensive seed script to create all sample data
 */
const seedAllData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive seed...\n');

    // 1. Create PLATFORM_ADMIN user
    let platformAdmin = await UserRepository.findOne({ email: 'platformadmin@email.com' });
    if (!platformAdmin) {
      const passwordHash = await bcrypt.hash('platformAdmin123', 10);
      platformAdmin = await UserRepository.create({
        email: 'platformadmin@email.com',
        passwordHash,
        role: 'PLATFORM_ADMIN',
        status: 'ACTIVE',
        linkedEntity: { type: 'NONE' }
      });
      console.log('✅ PLATFORM_ADMIN user created');
    } else {
      console.log('✅ PLATFORM_ADMIN user already exists');
    }

    // 2. Create Subscription Plans
    let premiumPlan = await SubscriptionPlanRepository.findOne({ name: 'PREMIUM' });
    if (!premiumPlan) {
      premiumPlan = await SubscriptionPlanRepository.create({
        name: 'PREMIUM',
        features: {
          aiSummary: true,
          industryAssessments: true
        },
        limits: {
          students: 5000,
          aiUsage: 100000
        },
        price: 250000,
        isActive: true
      });
      console.log('✅ PREMIUM subscription plan created');
    } else {
      console.log('✅ PREMIUM subscription plan already exists');
    }

    let basicPlan = await SubscriptionPlanRepository.findOne({ name: 'BASIC' });
    if (!basicPlan) {
      basicPlan = await SubscriptionPlanRepository.create({
        name: 'BASIC',
        features: {
          aiSummary: false,
          industryAssessments: false
        },
        limits: {
          students: 1000,
          aiUsage: 10000
        },
        price: 50000,
        isActive: true
      });
      console.log('✅ BASIC subscription plan created');
    } else {
      console.log('✅ BASIC subscription plan already exists');
    }

    // 3. Create Universities
    let sppu = await UniversityRepository.findOne({ code: 'SPPU' });
    if (!sppu) {
      sppu = await UniversityRepository.create({
        name: 'Savitribai Phule Pune University',
        code: 'SPPU',
        state: 'Maharashtra',
        country: 'India',
        isActive: true
      });
      console.log('✅ SPPU university created');
    } else {
      console.log('✅ SPPU university already exists');
    }

    let mu = await UniversityRepository.findOne({ code: 'MU' });
    if (!mu) {
      mu = await UniversityRepository.create({
        name: 'Mumbai University',
        code: 'MU',
        state: 'Maharashtra',
        country: 'India',
        isActive: true
      });
      console.log('✅ Mumbai University created');
    } else {
      console.log('✅ Mumbai University already exists');
    }

    // 4. Create Programs
    let beComp = await ProgramRepository.findOne({ code: 'BE-COMP', universityId: sppu._id });
    if (!beComp) {
      beComp = await ProgramRepository.create({
        universityId: sppu._id,
        name: 'B.E Computer Engineering',
        code: 'BE-COMP',
        durationYears: 4,
        isActive: true
      });
      console.log('✅ B.E Computer Engineering program created');
    } else {
      console.log('✅ B.E Computer Engineering program already exists');
    }

    let bscCs = await ProgramRepository.findOne({ code: 'BSC-CS', universityId: mu._id });
    if (!bscCs) {
      bscCs = await ProgramRepository.create({
        universityId: mu._id,
        name: 'B.Sc Computer Science',
        code: 'BSC-CS',
        durationYears: 3,
        isActive: true
      });
      console.log('✅ B.Sc Computer Science program created');
    } else {
      console.log('✅ B.Sc Computer Science program already exists');
    }

    // 5. Create Subjects
    let osSubject = await SubjectRepository.findOne({ subjectCode: 'OS', programId: beComp._id });
    if (!osSubject) {
      osSubject = await SubjectRepository.create({
        programId: beComp._id,
        universityId: sppu._id,
        academicYear: 2,
        subjectName: 'Operating Systems',
        subjectCode: 'OS',
        recommendedBooks: [
          { title: 'Operating System Concepts', author: 'Silberschatz' },
          { title: 'Modern Operating Systems', author: 'Tanenbaum' }
        ]
      });
      console.log('✅ Operating Systems subject created');
    } else {
      console.log('✅ Operating Systems subject already exists');
    }

    let dbmsSubject = await SubjectRepository.findOne({ subjectCode: 'DBMS', programId: beComp._id });
    if (!dbmsSubject) {
      dbmsSubject = await SubjectRepository.create({
        programId: beComp._id,
        universityId: sppu._id,
        academicYear: 2,
        subjectName: 'Database Management Systems',
        subjectCode: 'DBMS',
        recommendedBooks: [
          { title: 'Database System Concepts', author: 'Korth' }
        ]
      });
      console.log('✅ DBMS subject created');
    } else {
      console.log('✅ DBMS subject already exists');
    }

    // 6. Create Chapters
    const osChapters = [
      { chapterNumber: 1, chapterTitle: 'Process Management' },
      { chapterNumber: 2, chapterTitle: 'Memory Management' },
      { chapterNumber: 3, chapterTitle: 'File Systems' }
    ];

    for (const chapterData of osChapters) {
      const existing = await ChapterRepository.findOne({
        subjectId: osSubject._id,
        chapterNumber: chapterData.chapterNumber
      });
      if (!existing) {
        await ChapterRepository.create({
          subjectId: osSubject._id,
          programId: beComp._id,
          universityId: sppu._id,
          ...chapterData
        });
        console.log(`✅ Chapter ${chapterData.chapterNumber}: ${chapterData.chapterTitle} created`);
      }
    }

    // 7. Create Industry Partners
    let tcs = await IndustryPartnerRepository.findOne({ name: 'TCS' });
    if (!tcs) {
      tcs = await IndustryPartnerRepository.create({
        name: 'TCS',
        description: 'Tata Consultancy Services',
        website: 'https://www.tcs.com'
      });
      console.log('✅ TCS industry partner created');
    } else {
      console.log('✅ TCS industry partner already exists');
    }

    let infosys = await IndustryPartnerRepository.findOne({ name: 'Infosys' });
    if (!infosys) {
      infosys = await IndustryPartnerRepository.create({
        name: 'Infosys',
        description: 'Infosys Limited',
        website: 'https://www.infosys.com'
      });
      console.log('✅ Infosys industry partner created');
    } else {
      console.log('✅ Infosys industry partner already exists');
    }

    // 8. Create Assessments
    const assessments = [
      { partnerId: tcs._id, name: 'Node.js Skill Test', skillCategory: 'Backend', timeLimit: 60 },
      { partnerId: tcs._id, name: 'React.js Fundamentals', skillCategory: 'Frontend', timeLimit: 45 },
      { partnerId: infosys._id, name: 'Java Programming Test', skillCategory: 'Backend', timeLimit: 90 }
    ];

    for (const assessmentData of assessments) {
      const existing = await AssessmentRepository.findOne({
        name: assessmentData.name,
        partnerId: assessmentData.partnerId
      });
      if (!existing) {
        await AssessmentRepository.create({
          ...assessmentData,
          isActive: true
        });
        console.log(`✅ Assessment: ${assessmentData.name} created`);
      }
    }

    // 9. Create Institutes
    let institute = await InstituteRepository.findOne({ name: 'XYZ Engineering College' });
    if (!institute) {
      institute = await InstituteRepository.create({
        name: 'XYZ Engineering College',
        state: 'Maharashtra',
        universityId: sppu._id,
        subscriptionPlanId: premiumPlan._id,
        isActive: true
      });
      console.log('✅ XYZ Engineering College created');
    } else {
      console.log('✅ XYZ Engineering College already exists');
    }

    // 10. Create Opportunities
    const opportunities = [
      {
        type: 'JOB',
        title: 'Backend Developer Intern',
        organization: 'TCS',
        description: 'Work on Node.js backend development projects',
        applyUrl: 'https://www.tcs.com/careers',
        eligibility: {
          programs: [beComp._id],
          years: [3, 4],
          plans: ['PREMIUM']
        },
        expiryDate: new Date('2025-12-31')
      },
      {
        type: 'INTERNSHIP',
        title: 'Full Stack Developer Internship',
        organization: 'Infosys',
        description: 'Learn full stack development with industry mentors',
        applyUrl: 'https://www.infosys.com/careers',
        eligibility: {
          programs: [beComp._id, bscCs._id],
          years: [2, 3],
          plans: ['BASIC', 'PREMIUM']
        },
        expiryDate: new Date('2025-06-30')
      }
    ];

    for (const oppData of opportunities) {
      const existing = await OpportunityRepository.findOne({
        title: oppData.title,
        organization: oppData.organization
      });
      if (!existing) {
        await OpportunityRepository.create(oppData);
        console.log(`✅ Opportunity: ${oppData.title} created`);
      }
    }

    // 11. Create Courses
    const courses = [
      {
        title: 'Full Stack Web Development',
        description: 'Comprehensive course covering React, Node.js, MongoDB, and deployment',
        duration: '12 weeks',
        price: 5000,
        registrationUrl: 'https://aibigo.com/courses/fullstack',
        visibilityRules: {
          programs: [beComp._id, bscCs._id],
          plans: ['PREMIUM', 'ENTERPRISE']
        },
        isActive: true
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Learn Python, Pandas, NumPy, and basic machine learning',
        duration: '10 weeks',
        price: 6000,
        registrationUrl: 'https://aibigo.com/courses/datascience',
        visibilityRules: {
          programs: [beComp._id],
          plans: ['PREMIUM']
        },
        isActive: true
      },
      {
        title: 'Cloud Computing with AWS',
        description: 'Master AWS services, EC2, S3, Lambda, and cloud architecture',
        duration: '8 weeks',
        price: 7000,
        registrationUrl: 'https://aibigo.com/courses/aws',
        visibilityRules: {
          programs: [beComp._id, bscCs._id],
          plans: ['BASIC', 'PREMIUM', 'ENTERPRISE']
        },
        isActive: true
      }
    ];

    for (const courseData of courses) {
      const existing = await CourseRepository.findOne({ title: courseData.title });
      if (!existing) {
        await CourseRepository.create(courseData);
        console.log(`✅ Course: ${courseData.title} created`);
      }
    }

    // 12. Create Payments
    if (institute) {
      const payments = [
        {
          instituteId: institute._id,
          subscriptionPlanId: premiumPlan._id,
          amount: 250000,
          status: 'PAID',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          invoiceRef: 'INV-2024-001',
          paymentMethod: 'BANK_TRANSFER',
          transactionId: 'TXN-2024-001'
        },
        {
          instituteId: institute._id,
          subscriptionPlanId: premiumPlan._id,
          amount: 250000,
          status: 'PENDING',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-31'),
          invoiceRef: 'INV-2025-001',
          paymentMethod: 'BANK_TRANSFER'
        }
      ];

      for (const paymentData of payments) {
        const existing = await PaymentRepository.findOne({
          instituteId: paymentData.instituteId,
          invoiceRef: paymentData.invoiceRef
        });
        if (!existing) {
          await PaymentRepository.create(paymentData);
          console.log(`✅ Payment: ${paymentData.invoiceRef} created`);
        }
      }
    }

    // 13. Create Platform Settings
    const platformSettings = [
      {
        key: 'FEATURE_AI_SUMMARY',
        value: true,
        targetPlans: ['PREMIUM', 'ENTERPRISE'],
        description: 'Enable AI Summary feature for premium plans'
      },
      {
        key: 'FEATURE_INDUSTRY_ASSESSMENTS',
        value: true,
        targetPlans: ['PREMIUM', 'ENTERPRISE'],
        description: 'Enable Industry Assessments feature'
      },
      {
        key: 'FEATURE_RESUME_TOOLS',
        value: true,
        targetPlans: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
        description: 'Enable Resume Builder tools'
      },
      {
        key: 'FEATURE_JOB_BOARD',
        value: true,
        targetPlans: ['ALL'],
        description: 'Enable Job Board for all plans'
      },
      {
        key: 'APP_ANNOUNCEMENT',
        value: {
          title: 'Welcome to AIBIGO',
          message: 'New features coming soon!',
          showUntil: '2025-12-31'
        },
        targetPlans: ['ALL'],
        description: 'Platform-wide announcement'
      },
      {
        key: 'MAX_FILE_UPLOAD_SIZE',
        value: 10485760, // 10MB in bytes
        targetPlans: ['ALL'],
        description: 'Maximum file upload size in bytes'
      }
    ];

    for (const settingData of platformSettings) {
      const existing = await PlatformSettingRepository.findOne({ key: settingData.key });
      if (!existing) {
        await PlatformSettingRepository.create({
          ...settingData,
          updatedBy: platformAdmin._id
        });
        console.log(`✅ Platform Setting: ${settingData.key} created`);
      }
    }

    // 14. Create Analytics Triggers
    const analyticsTriggers = [
      {
        triggerType: 'DAILY',
        reportType: 'USAGE',
        config: {
          metrics: ['aiUsage', 'activeUsers', 'pageViews'],
          recipients: ['admin@aibigo.com']
        },
        isActive: true
      },
      {
        triggerType: 'WEEKLY',
        reportType: 'PERFORMANCE',
        config: {
          metrics: ['responseTime', 'errorRate', 'throughput'],
          recipients: ['admin@aibigo.com']
        },
        isActive: true
      },
      {
        triggerType: 'MONTHLY',
        reportType: 'REVENUE',
        config: {
          metrics: ['revenue', 'subscriptions', 'churnRate'],
          recipients: ['admin@aibigo.com', 'finance@aibigo.com']
        },
        isActive: true
      },
      {
        triggerType: 'DAILY',
        reportType: 'ENGAGEMENT',
        config: {
          metrics: ['opportunityViews', 'assessmentCompletions', 'courseEnrollments'],
          recipients: ['admin@aibigo.com']
        },
        isActive: false
      }
    ];

    for (const triggerData of analyticsTriggers) {
      const existing = await AnalyticsTriggerRepository.findOne({
        triggerType: triggerData.triggerType,
        reportType: triggerData.reportType
      });
      if (!existing) {
        await AnalyticsTriggerRepository.create(triggerData);
        console.log(`✅ Analytics Trigger: ${triggerData.triggerType} ${triggerData.reportType} created`);
      }
    }

    // 15. Create sample students
    const students = [
      { email: 'student1@email.com', password: 'Student123' },
      { email: 'student2@email.com', password: 'Student123' }
    ];

    for (const studentData of students) {
      const existing = await UserRepository.findOne({ email: studentData.email });
      if (!existing) {
        const passwordHash = await bcrypt.hash(studentData.password, 10);
        await UserRepository.create({
          email: studentData.email,
          passwordHash,
          role: 'STUDENT',
          status: 'ACTIVE',
          linkedEntity: { type: 'NONE' }
        });
        console.log(`✅ Student: ${studentData.email} created`);
      }
    }

    console.log('\n🎉 All seed data created successfully!');
    console.log('\n📋 Summary:');
    console.log('- PLATFORM_ADMIN: platformadmin@email.com / platformAdmin123');
    console.log('- Universities: SPPU, Mumbai University');
    console.log('- Programs: B.E Computer Engineering, B.Sc Computer Science');
    console.log('- Subjects: Operating Systems, DBMS');
    console.log('- Chapters: 3 chapters for OS');
    console.log('- Industry Partners: TCS, Infosys');
    console.log('- Assessments: 3 assessments');
    console.log('- Institutes: 1 institute');
    console.log('- Opportunities: 2 job/internship opportunities');
    console.log('- Courses: 3 upskilling courses');
    console.log('- Payments: 2 payment records');
    console.log('- Platform Settings: 6 settings');
    console.log('- Analytics Triggers: 4 triggers');
    console.log('- Students: 2 sample students');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run seed if called directly
if (require.main === module) {
  seedAllData()
    .then(() => {
      console.log('\n✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAllData };
