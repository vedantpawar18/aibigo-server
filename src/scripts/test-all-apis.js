/**
 * Comprehensive API Testing Script
 * Tests all endpoints defined in Swagger with actual data
 */

require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
let authToken = null;
let testData = {
  userId: null,
  universityId: null,
  programId: null,
  subjectId: null,
  chapterId: null,
  instituteId: null,
  subscriptionPlanId: null,
  partnerId: null,
  assessmentId: null,
  courseId: null,
  paymentId: null,
  settingId: null,
  analyticsTriggerId: null,
};

// Test results
const results = {
  passed: [],
  failed: [],
  skipped: [],
};

/**
 * Make API request with error handling
 */
async function makeRequest(method, url, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      error: error.response?.data || error.message,
    };
  }
}

/**
 * Test result logger
 */
function logTest(name, result, details = '') {
  if (result.success) {
    console.log(`✅ ${name} - Status: ${result.status}`);
    results.passed.push({ name, status: result.status, details });
  } else {
    console.log(`❌ ${name} - Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error).substring(0, 200)}`);
    results.failed.push({ name, status: result.status, error: result.error, details });
  }
}

/**
 * Test Authentication APIs
 */
async function testAuthAPIs() {
  console.log('\n🔐 Testing Authentication APIs...\n');

  // 1. Register Student
  const registerData = {
    email: `teststudent${Date.now()}@email.com`,
    password: 'TestStudent123',
  };
  let result = await makeRequest('POST', '/api/v1/auth/register', registerData);
  logTest('POST /api/v1/auth/register', result);
  if (result.success) {
    testData.studentEmail = registerData.email;
  }

  // 2. Login (Platform Admin)
  const loginData = {
    email: 'platformadmin@email.com',
    password: 'platformAdmin123',
  };
  result = await makeRequest('POST', '/api/v1/auth/login', loginData);
  logTest('POST /api/v1/auth/login', result);
  if (result.success && result.data.accessToken) {
    authToken = result.data.accessToken;
    testData.userId = result.data.user._id;
  }

  // 3. Forgot Password
  result = await makeRequest('POST', '/api/v1/auth/forgot-password', {
    email: 'platformadmin@email.com',
  });
  logTest('POST /api/v1/auth/forgot-password', result);

  // 4. Reset Password (endpoint now implemented - should return 400 for invalid token)
  result = await makeRequest('POST', '/api/v1/auth/reset-password', {
    token: 'invalid-token',
    newPassword: 'NewPassword123',
  });
  // Expected to return 400 for invalid/expired token (endpoint is working correctly)
  if (result.status === 400) {
    logTest('POST /api/v1/auth/reset-password', { success: true, status: result.status, details: 'Endpoint working - invalid token handled correctly' });
  } else {
    logTest('POST /api/v1/auth/reset-password', result);
  }
}

/**
 * Test System APIs
 */
async function testSystemAPIs() {
  console.log('\n⚙️ Testing System APIs...\n');

  if (!authToken) {
    console.log('⚠️ Skipping - No auth token');
    results.skipped.push('System APIs');
    return;
  }

  // Create Admin User
  const adminData = {
    name: 'Test Admin',
    email: `testadmin${Date.now()}@email.com`,
    role: 'OPERATIONS_ADMIN',
  };
  const result = await makeRequest('POST', '/api/v1/system/admin-users', adminData, authToken);
  logTest('POST /api/v1/system/admin-users', result);
}

/**
 * Test Platform Admin APIs
 */
async function testPlatformAdminAPIs() {
  console.log('\n👑 Testing Platform Admin APIs...\n');

  if (!authToken) {
    console.log('⚠️ Skipping - No auth token');
    results.skipped.push('Platform Admin APIs');
    return;
  }

  // Dashboard Overview
  let result = await makeRequest('GET', '/api/v1/platform-admin/dashboard/overview', null, authToken);
  logTest('GET /api/v1/platform-admin/dashboard/overview', result);

  // Universities
  const universityData = {
    name: `Test University ${Date.now()}`,
    code: `TU${Date.now()}`,
    state: 'Maharashtra',
    country: 'India',
    isActive: true,
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/academics/universities', universityData, authToken);
  logTest('POST /api/v1/platform-admin/academics/universities', result);
  if (result.success && result.data._id) {
    testData.universityId = result.data._id;
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/academics/universities', null, authToken);
  logTest('GET /api/v1/platform-admin/academics/universities', result);

  // Programs
  if (testData.universityId) {
    const programData = {
      universityId: testData.universityId,
      name: `Test Program ${Date.now()}`,
      code: `TP${Date.now()}`,
      durationYears: 4,
      isActive: true,
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/academics/programs', programData, authToken);
    logTest('POST /api/v1/platform-admin/academics/programs', result);
    if (result.success && result.data._id) {
      testData.programId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/academics/programs', null, authToken);
  logTest('GET /api/v1/platform-admin/academics/programs', result);

  // Subjects
  if (testData.programId && testData.universityId) {
    const subjectData = {
      programId: testData.programId,
      universityId: testData.universityId,
      academicYear: 2,
      subjectName: `Test Subject ${Date.now()}`,
      subjectCode: `TS${Date.now()}`,
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/academics/subjects', subjectData, authToken);
    logTest('POST /api/v1/platform-admin/academics/subjects', result);
    if (result.success && result.data._id) {
      testData.subjectId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/academics/subjects', null, authToken);
  logTest('GET /api/v1/platform-admin/academics/subjects', result);

  // Chapters
  if (testData.subjectId && testData.programId && testData.universityId) {
    const chapterData = {
      subjectId: testData.subjectId,
      programId: testData.programId,
      universityId: testData.universityId,
      chapterNumber: 1,
      chapterTitle: `Test Chapter ${Date.now()}`,
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/academics/chapters', chapterData, authToken);
    logTest('POST /api/v1/platform-admin/academics/chapters', result);
    if (result.success && result.data._id) {
      testData.chapterId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/academics/chapters', null, authToken);
  logTest('GET /api/v1/platform-admin/academics/chapters', result);

  // Opportunities
  const opportunityData = {
    type: 'JOB',
    title: `Test Opportunity ${Date.now()}`,
    organization: 'Test Company',
    description: 'Test description',
    applyUrl: 'https://example.com/apply',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/engagement/opportunities', opportunityData, authToken);
  logTest('POST /api/v1/platform-admin/engagement/opportunities', result);

  result = await makeRequest('GET', '/api/v1/platform-admin/engagement/opportunities', null, authToken);
  logTest('GET /api/v1/platform-admin/engagement/opportunities', result);

  // Industry Partners
  const partnerData = {
    name: `Test Partner ${Date.now()}`,
    description: 'Test partner description',
    website: 'https://example.com',
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/engagement/industry-partners', partnerData, authToken);
  logTest('POST /api/v1/platform-admin/engagement/industry-partners', result);
  if (result.success && result.data._id) {
    testData.partnerId = result.data._id;
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/engagement/industry-partners', null, authToken);
  logTest('GET /api/v1/platform-admin/engagement/industry-partners', result);

  // Assessments
  if (testData.partnerId) {
    const assessmentData = {
      partnerId: testData.partnerId,
      name: `Test Assessment ${Date.now()}`,
      skillCategory: 'TECHNICAL',
      timeLimit: 60,
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/engagement/assessments', assessmentData, authToken);
    logTest('POST /api/v1/platform-admin/engagement/assessments', result);
    if (result.success && result.data._id) {
      testData.assessmentId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/engagement/assessments', null, authToken);
  logTest('GET /api/v1/platform-admin/engagement/assessments', result);

  // Courses
  const courseData = {
    title: `Test Course ${Date.now()}`,
    description: 'Test course description',
    duration: '40 hours',
    price: 5000,
    registrationUrl: 'https://example.com/register',
    isActive: true,
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/engagement/courses', courseData, authToken);
  logTest('POST /api/v1/platform-admin/engagement/courses', result);
  if (result.success && result.data._id) {
    testData.courseId = result.data._id;
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/engagement/courses', null, authToken);
  logTest('GET /api/v1/platform-admin/engagement/courses', result);

  // Subscription Plans (use unique name since enum constraint removed)
  const planData = {
    name: `TEST_PLAN_${Date.now()}`, // Unique name for each test run
    features: {
      aiSummary: true,
      industryAssessments: true,
    },
    limits: {
      students: 1000,
      aiUsage: 10000,
    },
    price: 100000,
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/business/subscription-plans', planData, authToken);
  logTest('POST /api/v1/platform-admin/business/subscription-plans', result);
  if (result.success && result.data._id) {
    testData.subscriptionPlanId = result.data._id;
  } else if (!result.success && result.status === 409) {
    // Plan already exists, try to get existing plan
    const getResult = await makeRequest('GET', '/api/v1/platform-admin/business/subscription-plans?isActive=true', null, authToken);
    if (getResult.success && getResult.data && getResult.data.length > 0) {
      testData.subscriptionPlanId = getResult.data[0]._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/business/subscription-plans', null, authToken);
  logTest('GET /api/v1/platform-admin/business/subscription-plans', result);

  // Institutes
  if (testData.universityId && testData.subscriptionPlanId) {
    const instituteData = {
      name: `Test Institute ${Date.now()}`,
      state: 'Maharashtra',
      universityId: testData.universityId,
      subscriptionPlanId: testData.subscriptionPlanId,
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/institutes', instituteData, authToken);
    logTest('POST /api/v1/platform-admin/institutes', result);
    if (result.success && result.data._id) {
      testData.instituteId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/institutes', null, authToken);
  logTest('GET /api/v1/platform-admin/institutes', result);

  // Payments
  if (testData.instituteId && testData.subscriptionPlanId) {
    const paymentData = {
      instituteId: testData.instituteId,
      subscriptionPlanId: testData.subscriptionPlanId,
      amount: 100000,
      status: 'PAID',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'BANK_TRANSFER',
    };
    result = await makeRequest('POST', '/api/v1/platform-admin/business/payments', paymentData, authToken);
    logTest('POST /api/v1/platform-admin/business/payments', result);
    if (result.success && result.data._id) {
      testData.paymentId = result.data._id;
    }
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/business/payments', null, authToken);
  logTest('GET /api/v1/platform-admin/business/payments', result);

  // Admin Users
  result = await makeRequest('GET', '/api/v1/platform-admin/system/admin-users', null, authToken);
  logTest('GET /api/v1/platform-admin/system/admin-users', result);

  // Audit Logs
  result = await makeRequest('GET', '/api/v1/platform-admin/system/audit-logs', null, authToken);
  logTest('GET /api/v1/platform-admin/system/audit-logs', result);

  // Platform Settings
  const settingData = {
    key: `TEST_SETTING_${Date.now()}`,
    value: 'test-value',
    description: 'Test setting',
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/system/platform-settings', settingData, authToken);
  logTest('POST /api/v1/platform-admin/system/platform-settings', result);

  result = await makeRequest('GET', '/api/v1/platform-admin/system/platform-settings', null, authToken);
  logTest('GET /api/v1/platform-admin/system/platform-settings', result);

  // Analytics Triggers
  const analyticsData = {
    triggerType: 'DAILY',
    reportType: 'USAGE',
    isActive: true,
  };
  result = await makeRequest('POST', '/api/v1/platform-admin/system/analytics', analyticsData, authToken);
  logTest('POST /api/v1/platform-admin/system/analytics', result);
  if (result.success && result.data._id) {
    testData.analyticsTriggerId = result.data._id;
  }

  result = await makeRequest('GET', '/api/v1/platform-admin/system/analytics', null, authToken);
  logTest('GET /api/v1/platform-admin/system/analytics', result);

  // Log Files
  result = await makeRequest('GET', '/api/v1/platform-admin/system/logs/files', null, authToken);
  logTest('GET /api/v1/platform-admin/system/logs/files', result);

  // Recent Logs
  result = await makeRequest('GET', '/api/v1/platform-admin/system/logs/recent?lines=10', null, authToken);
  logTest('GET /api/v1/platform-admin/system/logs/recent', result);

  // Log Statistics
  result = await makeRequest('GET', '/api/v1/platform-admin/system/logs/statistics', null, authToken);
  logTest('GET /api/v1/platform-admin/system/logs/statistics', result);
}

/**
 * Print Summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log(`📈 Total: ${results.passed.length + results.failed.length + results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.failed.forEach((test) => {
      console.log(`   - ${test.name} (Status: ${test.status})`);
      if (test.error?.error || test.error?.message) {
        console.log(`     Error: ${test.error.error || test.error.message}`);
      }
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n⚠️  SKIPPED TESTS:');
    results.skipped.forEach((test) => {
      console.log(`   - ${test}`);
    });
  }
}

/**
 * Check if server is running
 */
async function checkServer() {
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    if (response.status === 200) {
      console.log('✅ Server is running and accessible\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running or not accessible');
    console.error(`   Please start the server first: npm run dev`);
    console.error(`   Or check if BASE_URL is correct: ${BASE_URL}\n`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Comprehensive API Tests');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('='.repeat(60));

  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }

  try {
    await testAuthAPIs();
    await testSystemAPIs();
    await testPlatformAdminAPIs();

    printSummary();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests()
    .then(() => {
      process.exit(results.failed.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
