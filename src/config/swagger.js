const swaggerJsdoc = require('swagger-jsdoc');

// Get server URL dynamically based on environment
const getServerUrl = () => {
  // Check for explicit API_BASE_URL environment variable
  if (process.env.API_BASE_URL) {
    // Ensure HTTPS in production
    const url = process.env.API_BASE_URL;
    if (process.env.NODE_ENV === 'production' && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
  // For local development
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return 'http://localhost:3000';
  }
  // For production - always use base Vercel URL
  return 'https://aibigo-server.vercel.app';
};

const serverUrl = getServerUrl();

// Log server URL for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Swagger Server URL:', serverUrl);
  console.log('Environment Variables:', {
    API_BASE_URL: process.env.API_BASE_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
  });
}

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'aibigo-server API',
      version: '1.0.0',
      description: 'API documentation for aibigo-server - Education Platform Backend',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production' 
          ? 'Production Server' 
          : 'Development Server',
      },
      // Include localhost for development reference
      ...(process.env.NODE_ENV !== 'production' ? [{
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      }] : []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'platformadmin@email.com',
            },
            role: {
              type: 'string',
              enum: ['PLATFORM_ADMIN', 'OPERATIONS_ADMIN', 'FACULTY', 'STUDENT', 'INDUSTRY_ADMIN'],
              example: 'STUDENT',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'SUSPENDED', 'LOCKED'],
              example: 'ACTIVE',
            },
            linkedEntity: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['INSTITUTE', 'FACULTY', 'INDUSTRY', 'NONE'],
                },
                id: {
                  type: 'string',
                },
              },
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'platformadmin@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'platformAdmin123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'StrongPassword123',
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@email.com',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: {
              type: 'string',
              example: 'reset-token-here',
            },
            newPassword: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'NewStrongPassword123',
            },
          },
        },
        AdminUserCreateRequest: {
          type: 'object',
          required: ['name', 'email', 'role'],
          properties: {
            name: {
              type: 'string',
              example: 'Admin Name',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@focused.ai',
            },
            role: {
              type: 'string',
              enum: ['OPERATIONS_ADMIN', 'FACULTY'],
              example: 'OPERATIONS_ADMIN',
            },
          },
        },
        DashboardOverview: {
          type: 'object',
          properties: {
            institutes: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 120,
                },
                active: {
                  type: 'integer',
                  example: 98,
                },
                inactive: {
                  type: 'integer',
                  example: 22,
                },
              },
            },
            subscriptionsExpiring: {
              type: 'integer',
              example: 14,
            },
            studentsCount: {
              type: 'integer',
              example: 24500,
            },
            activeOpportunities: {
              type: 'integer',
              example: 32,
            },
            activeAssessments: {
              type: 'integer',
              example: 11,
            },
            monthlyRevenue: {
              type: 'number',
              example: 840000,
            },
          },
        },
        University: {
          type: 'object',
          required: ['name', 'code', 'state', 'country'],
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
              example: 'Savitribai Phule Pune University',
            },
            code: {
              type: 'string',
              example: 'SPPU',
            },
            state: {
              type: 'string',
              example: 'Maharashtra',
            },
            country: {
              type: 'string',
              example: 'India',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Program: {
          type: 'object',
          required: ['universityId', 'name', 'code', 'durationYears'],
          properties: {
            _id: {
              type: 'string',
            },
            universityId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/University' }
              ],
              description: 'University ID or populated University object',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'B.E Computer Engineering',
            },
            code: {
              type: 'string',
              example: 'BE-COMP',
            },
            durationYears: {
              type: 'integer',
              example: 4,
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Subject: {
          type: 'object',
          required: ['programId', 'universityId', 'academicYear', 'subjectName', 'subjectCode'],
          properties: {
            _id: {
              type: 'string',
            },
            programId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/Program' }
              ],
              description: 'Program ID or populated Program object',
            },
            universityId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/University' }
              ],
              description: 'University ID or populated University object',
            },
            academicYear: {
              type: 'integer',
              example: 2,
            },
            subjectName: {
              type: 'string',
              example: 'Operating Systems',
            },
            subjectCode: {
              type: 'string',
              example: 'OS',
            },
            recommendedBooks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Operating System Concepts',
                  },
                  author: {
                    type: 'string',
                    example: 'Silberschatz',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Chapter: {
          type: 'object',
          required: ['subjectId', 'programId', 'universityId', 'chapterNumber', 'chapterTitle'],
          properties: {
            _id: {
              type: 'string',
            },
            subjectId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/Subject' }
              ],
              description: 'Subject ID or populated Subject object',
            },
            programId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/Program' }
              ],
              description: 'Program ID or populated Program object',
            },
            universityId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/University' }
              ],
              description: 'University ID or populated University object',
            },
            chapterNumber: {
              type: 'integer',
              example: 1,
            },
            chapterTitle: {
              type: 'string',
              example: 'Process Management',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Opportunity: {
          type: 'object',
          required: ['type', 'title', 'organization', 'description', 'expiryDate'],
          properties: {
            _id: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: ['JOB', 'INTERNSHIP', 'WORKSHOP', 'COMPETITION'],
              example: 'JOB',
            },
            title: {
              type: 'string',
              example: 'Backend Developer Intern',
            },
            organization: {
              type: 'string',
              example: 'TCS',
            },
            description: {
              type: 'string',
              example: 'Job description here...',
            },
            applyUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://tcs.com/careers',
            },
            eligibility: {
              type: 'object',
              properties: {
                programs: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                years: {
                  type: 'array',
                  items: {
                    type: 'integer',
                  },
                  example: [3, 4],
                },
                plans: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['BASIC', 'PREMIUM'],
                  },
                },
              },
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              example: '2026-03-31',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        IndustryPartner: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
              example: 'TCS',
            },
            description: {
              type: 'string',
            },
            website: {
              type: 'string',
              format: 'uri',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Assessment: {
          type: 'object',
          required: ['partnerId', 'name', 'skillCategory', 'timeLimit'],
          properties: {
            _id: {
              type: 'string',
            },
            partnerId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/IndustryPartner' }
              ],
              description: 'Partner ID or populated IndustryPartner object',
            },
            name: {
              type: 'string',
              example: 'Node.js Skill Test',
            },
            skillCategory: {
              type: 'string',
              example: 'Backend',
            },
            timeLimit: {
              type: 'integer',
              description: 'Time limit in minutes',
              example: 60,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Institute: {
          type: 'object',
          required: ['name', 'state', 'universityId', 'subscriptionPlanId'],
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
              example: 'XYZ Engineering College',
            },
            state: {
              type: 'string',
              example: 'MH',
            },
            universityId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/University' }
              ],
              description: 'University ID or populated University object',
            },
            subscriptionPlanId: {
              oneOf: [
                { type: 'string' },
                { $ref: '#/components/schemas/SubscriptionPlan' }
              ],
              description: 'Subscription Plan ID or populated SubscriptionPlan object',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SubscriptionPlan: {
          type: 'object',
          required: ['name', 'features', 'limits', 'price'],
          properties: {
            _id: {
              type: 'string',
            },
            name: {
              type: 'string',
              enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
              example: 'PREMIUM',
            },
            features: {
              type: 'object',
              properties: {
                aiSummary: {
                  type: 'boolean',
                  example: true,
                },
                industryAssessments: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
            limits: {
              type: 'object',
              properties: {
                students: {
                  type: 'integer',
                  example: 5000,
                },
                aiUsage: {
                  type: 'integer',
                  example: 100000,
                },
              },
            },
            price: {
              type: 'number',
              example: 250000,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            userId: {
              oneOf: [
                {
                  type: 'string',
                  description: 'User ID as string',
                },
                {
                  type: 'object',
                  description: 'Populated user object',
                  properties: {
                    _id: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    role: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
            action: {
              type: 'string',
              enum: [
                'LOGIN_SUCCESS',
                'LOGIN_FAILURE',
                'PASSWORD_RESET',
                'ROLE_ASSIGNMENT',
                'ADMIN_CREATION',
                'ACCOUNT_SUSPENSION',
                'DATA_CREATE',
                'DATA_UPDATE',
                'DATA_DELETE',
                'API_ACCESS',
              ],
              example: 'LOGIN_SUCCESS',
            },
            ip: {
              type: 'string',
              example: '192.168.1.1',
            },
            userAgent: {
              type: 'string',
              example: 'Mozilla/5.0...',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            metadata: {
              type: 'object',
              description: 'Additional metadata about the action',
              additionalProperties: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
            message: {
              type: 'string',
              example: 'Detailed error description',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },
        Course: {
          type: 'object',
          required: ['title', 'description', 'duration', 'price'],
          properties: {
            _id: {
              type: 'string',
            },
            title: {
              type: 'string',
              example: 'Full Stack Web Development',
            },
            description: {
              type: 'string',
              example: 'Comprehensive course covering frontend and backend technologies',
            },
            duration: {
              type: 'string',
              example: '12 weeks',
            },
            price: {
              type: 'number',
              example: 5000,
            },
            registrationUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://aibigo.com/courses/fullstack',
            },
            visibilityRules: {
              type: 'object',
              properties: {
                programs: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                plans: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
                  },
                },
              },
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Payment: {
          type: 'object',
          required: ['instituteId', 'amount', 'subscriptionPlanId'],
          properties: {
            _id: {
              type: 'string',
            },
            instituteId: {
              type: 'string',
            },
            subscriptionPlanId: {
              type: 'string',
            },
            amount: {
              type: 'number',
              example: 250000,
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
              example: 'PAID',
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              example: '2024-12-31',
            },
            invoiceRef: {
              type: 'string',
              example: 'INV-2024-001',
            },
            paymentMethod: {
              type: 'string',
              example: 'BANK_TRANSFER',
            },
            transactionId: {
              type: 'string',
              example: 'TXN-123456789',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PlatformSetting: {
          type: 'object',
          required: ['key', 'value'],
          properties: {
            _id: {
              type: 'string',
            },
            key: {
              type: 'string',
              example: 'FEATURE_AI_SUMMARY',
            },
            value: {
              type: 'object',
              description: 'Setting value (can be boolean, string, number, or object)',
            },
            targetPlans: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['BASIC', 'PREMIUM', 'ENTERPRISE', 'ALL'],
              },
              description: 'Plans this setting applies to. Empty array means all plans.',
            },
            description: {
              type: 'string',
              example: 'Enable AI Summary feature',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedBy: {
              type: 'string',
              description: 'User ID who last updated this setting',
            },
          },
        },
        AnalyticsTrigger: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            triggerType: {
              type: 'string',
              enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'],
              example: 'DAILY',
            },
            reportType: {
              type: 'string',
              enum: ['USAGE', 'PERFORMANCE', 'REVENUE', 'ENGAGEMENT', 'CUSTOM'],
              example: 'USAGE',
            },
            config: {
              type: 'object',
              description: 'Analytics configuration parameters',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            lastRunAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Platform Admin',
        description: 'Platform admin (PLATFORM_ADMIN) endpoints',
      },
      {
        name: 'System',
        description: 'System administration endpoints',
      },
    ],
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Student self-registration',
          description: 'Register a new student account. Role is automatically set to STUDENT.',
          operationId: 'registerStudent',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Registration successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Success',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '429': {
              description: 'Too many requests - rate limit exceeded',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticate user and receive JWT access token',
          operationId: 'login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Account suspended or locked',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '429': {
              description: 'Too many requests - rate limit exceeded',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request password reset',
          description: 'Request a password reset token to be sent via email',
          operationId: 'forgotPassword',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ForgotPasswordRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Reset token sent (if email exists)',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Success',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset password',
          description: 'Reset password using token from forgot-password. Invalidates all active JWTs.',
          operationId: 'resetPassword',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResetPasswordRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Password reset successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Success',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid or expired token',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/system/admin-users': {
        post: {
          tags: ['System'],
          summary: 'Create admin user',
          description: 'Create a new admin user (OPERATIONS_ADMIN or FACULTY). Requires PLATFORM_ADMIN role. Password is auto-generated and emailed.',
          operationId: 'createAdminUser',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AdminUserCreateRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Admin user created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Success',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - JWT required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN role required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/dashboard/overview': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Get dashboard overview',
          description: 'Get platform-wide metrics and statistics. Requires PLATFORM_ADMIN role.',
          operationId: 'getDashboardOverview',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Dashboard metrics',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/DashboardOverview',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - JWT required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN role required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/academics/universities': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create university',
          description: 'Create a new university. Requires PLATFORM_ADMIN role.',
          operationId: 'createUniversity',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/University',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'University created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/University',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List universities',
          description: 'Get list of all universities. Requires PLATFORM_ADMIN role.',
          operationId: 'listUniversities',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of universities',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/University',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/academics/programs': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create degree program',
          description: 'Create a new degree program. Requires PLATFORM_ADMIN role.',
          operationId: 'createProgram',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Program',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Program created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Program',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List degree programs',
          description: 'Get list of all degree programs. Requires PLATFORM_ADMIN role.',
          operationId: 'listPrograms',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'universityId',
              in: 'query',
              description: 'Filter by university ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of programs',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Program',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/academics/subjects': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create subject',
          description: 'Create a new subject (metadata only, no pedagogy/outcomes/MCQs). Requires PLATFORM_ADMIN role.',
          operationId: 'createSubject',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Subject',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Subject created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Subject',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List subjects',
          description: 'Get list of all subjects. Requires PLATFORM_ADMIN role.',
          operationId: 'listSubjects',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'programId',
              in: 'query',
              description: 'Filter by program ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'universityId',
              in: 'query',
              description: 'Filter by university ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'academicYear',
              in: 'query',
              description: 'Filter by academic year',
              required: false,
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of subjects',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Subject',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/academics/chapters': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Add chapter to subject',
          description: 'Add a chapter to a subject. Requires PLATFORM_ADMIN role.',
          operationId: 'createChapter',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Chapter',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Chapter created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Chapter',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List chapters',
          description: 'Get list of all chapters. Requires PLATFORM_ADMIN role.',
          operationId: 'listChapters',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'subjectId',
              in: 'query',
              description: 'Filter by subject ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'programId',
              in: 'query',
              description: 'Filter by program ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'universityId',
              in: 'query',
              description: 'Filter by university ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of chapters',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Chapter',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/engagement/opportunities': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create opportunity',
          description: 'Create a new job/internship/workshop opportunity. Requires PLATFORM_ADMIN role.',
          operationId: 'createOpportunity',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Opportunity',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Opportunity created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Opportunity',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List opportunities',
          description: 'Get list of all opportunities. Requires PLATFORM_ADMIN role.',
          operationId: 'listOpportunities',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'type',
              in: 'query',
              description: 'Filter by opportunity type',
              required: false,
              schema: {
                type: 'string',
                enum: ['JOB', 'INTERNSHIP', 'WORKSHOP', 'COMPETITION'],
              },
            },
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of opportunities',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Opportunity',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/engagement/industry-partners': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Add industry partner',
          description: 'Add a new industry partner. Requires PLATFORM_ADMIN role.',
          operationId: 'createIndustryPartner',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/IndustryPartner',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Industry partner created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/IndustryPartner',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List industry partners',
          description: 'Get list of all industry partners. Requires PLATFORM_ADMIN role.',
          operationId: 'listIndustryPartners',
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'List of industry partners',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/IndustryPartner',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/engagement/assessments': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Upload assessment',
          description: 'Upload a new industry assessment. Requires PLATFORM_ADMIN role.',
          operationId: 'createAssessment',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Assessment',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Assessment created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Assessment',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List assessments',
          description: 'Get list of all industry assessments. Requires PLATFORM_ADMIN role.',
          operationId: 'listAssessments',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'partnerId',
              in: 'query',
              description: 'Filter by partner ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of assessments',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Assessment',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/institutes': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Add institute',
          description: 'Add a new institute. Requires PLATFORM_ADMIN role.',
          operationId: 'createInstitute',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Institute',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Institute created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Institute',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List institutes',
          description: 'Get list of all institutes. Requires PLATFORM_ADMIN role.',
          operationId: 'listInstitutes',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'universityId',
              in: 'query',
              description: 'Filter by university ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of institutes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Institute',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/business/subscription-plans': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create subscription plan',
          description: 'Create a new subscription plan. Requires PLATFORM_ADMIN role.',
          operationId: 'createSubscriptionPlan',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SubscriptionPlan',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Subscription plan created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SubscriptionPlan',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List subscription plans',
          description: 'Get list of all subscription plans. Requires PLATFORM_ADMIN role.',
          operationId: 'listSubscriptionPlans',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of subscription plans',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SubscriptionPlan',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/system/admin-users': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create admin user (Platform Admin)',
          description: 'Create a new admin user. Requires PLATFORM_ADMIN role. Password is auto-generated and emailed.',
          operationId: 'createPlatformAdminUser',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AdminUserCreateRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Admin user created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Success',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List admin users',
          description: 'Get list of all admin users. Requires PLATFORM_ADMIN role.',
          operationId: 'listAdminUsers',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'role',
              in: 'query',
              description: 'Filter by role',
              required: false,
              schema: {
                type: 'string',
                enum: ['PLATFORM_ADMIN', 'OPERATIONS_ADMIN', 'FACULTY'],
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of admin users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/system/audit-logs': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Get audit logs',
          description: 'Get audit logs (read-only). Requires PLATFORM_ADMIN role.',
          operationId: 'getAuditLogs',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'userId',
              in: 'query',
              description: 'Filter by user ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'action',
              in: 'query',
              description: 'Filter by action type',
              required: false,
              schema: {
                type: 'string',
                enum: [
                  'LOGIN_SUCCESS',
                  'LOGIN_FAILURE',
                  'PASSWORD_RESET',
                  'ROLE_ASSIGNMENT',
                  'ADMIN_CREATION',
                  'ACCOUNT_SUSPENSION',
                  'DATA_CREATE',
                  'DATA_UPDATE',
                  'DATA_DELETE',
                  'API_ACCESS'
                ],
              },
            },
            {
              name: 'startDate',
              in: 'query',
              description: 'Start date filter (ISO 8601)',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
            {
              name: 'endDate',
              in: 'query',
              description: 'End date filter (ISO 8601)',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              required: false,
              schema: {
                type: 'integer',
                default: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              required: false,
              schema: {
                type: 'integer',
                default: 50,
              },
            },
          ],
          responses: {
            '200': {
              description: 'Audit logs retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      logs: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/AuditLog',
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: {
                            type: 'integer',
                          },
                          limit: {
                            type: 'integer',
                          },
                          total: {
                            type: 'integer',
                          },
                          pages: {
                            type: 'integer',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/engagement/courses': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create course',
          description: 'Create a new upskilling or AIBIGO course. Requires PLATFORM_ADMIN role.',
          operationId: 'createCourse',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Course',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Course created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Course',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List courses',
          description: 'Get list of all courses. Requires PLATFORM_ADMIN role.',
          operationId: 'listCourses',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of courses',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Course',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/business/payments': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Record payment',
          description: 'Record a payment for an institute subscription. Requires PLATFORM_ADMIN role.',
          operationId: 'createPayment',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Payment',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Payment recorded successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Payment',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List payments',
          description: 'Get list of all payments. Requires PLATFORM_ADMIN role.',
          operationId: 'listPayments',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'instituteId',
              in: 'query',
              description: 'Filter by institute ID',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by payment status',
              required: false,
              schema: {
                type: 'string',
                enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of payments',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Payment',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/system/platform-settings': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create or update platform setting',
          description: 'Create or update a platform setting (feature flags, announcements, etc.). Requires PLATFORM_ADMIN role.',
          operationId: 'upsertPlatformSetting',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PlatformSetting',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Setting created/updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PlatformSetting',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List platform settings',
          description: 'Get list of all platform settings. Requires PLATFORM_ADMIN role.',
          operationId: 'listPlatformSettings',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'key',
              in: 'query',
              description: 'Filter by setting key',
              required: false,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of platform settings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/PlatformSetting',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/system/analytics': {
        post: {
          tags: ['Platform Admin'],
          summary: 'Create analytics trigger',
          description: 'Create a new analytics trigger. Requires PLATFORM_ADMIN role.',
          operationId: 'createAnalyticsTrigger',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnalyticsTrigger',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Analytics trigger created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AnalyticsTrigger',
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ['Platform Admin'],
          summary: 'List analytics triggers',
          description: 'Get list of all analytics triggers. Requires PLATFORM_ADMIN role.',
          operationId: 'listAnalyticsTriggers',
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              name: 'isActive',
              in: 'query',
              description: 'Filter by active status',
              required: false,
              schema: {
                type: 'boolean',
              },
            },
          ],
          responses: {
            '200': {
              description: 'List of analytics triggers',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/AnalyticsTrigger',
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - PLATFORM_ADMIN required',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/files': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Get list of log files',
          description: 'Get list of all log files. Requires PLATFORM_ADMIN role.',
          operationId: 'getLogFiles',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Log files retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            filename: { type: 'string' },
                            size: { type: 'integer' },
                            created: { type: 'string', format: 'date-time' },
                            modified: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/recent': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Get recent logs',
          description: 'Get recent logs from all log files. Requires PLATFORM_ADMIN role.',
          operationId: 'getRecentLogs',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'lines', in: 'query', description: 'Number of log lines', required: false, schema: { type: 'integer', default: 50 } },
            { name: 'level', in: 'query', description: 'Filter by log level', required: false, schema: { type: 'string', enum: ['error', 'warn', 'info', 'debug'] } },
            { name: 'search', in: 'query', description: 'Search term', required: false, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'Recent logs retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          logs: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                file: { type: 'string' },
                                log: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/statistics': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Get log statistics',
          description: 'Get statistics about log files. Requires PLATFORM_ADMIN role.',
          operationId: 'getLogStatistics',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Log statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          totalFiles: { type: 'integer' },
                          totalSize: { type: 'integer' },
                          files: { type: 'array', items: { type: 'object' } },
                          levels: {
                            type: 'object',
                            properties: {
                              error: { type: 'integer' },
                              warn: { type: 'integer' },
                              info: { type: 'integer' },
                              debug: { type: 'integer' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/files/{filename}': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Read specific log file',
          description: 'Read content from a specific log file. Requires PLATFORM_ADMIN role.',
          operationId: 'readLogFile',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'filename', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'lines', in: 'query', description: 'Number of lines', required: false, schema: { type: 'integer', default: 100 } },
            { name: 'level', in: 'query', description: 'Filter by log level', required: false, schema: { type: 'string', enum: ['error', 'warn', 'info', 'debug'] } },
            { name: 'search', in: 'query', description: 'Search term', required: false, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'Log file content retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          filename: { type: 'string' },
                          totalLines: { type: 'integer' },
                          returnedLines: { type: 'integer' },
                          lines: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    },
                  },
                },
              },
            },
            '404': { description: 'Log file not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/download': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Download today\'s log file',
          description: 'Download today\'s combined log file. Returns file as download. Requires PLATFORM_ADMIN role.',
          operationId: 'downloadTodayLog',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Log file downloaded successfully',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              headers: {
                'Content-Disposition': {
                  schema: {
                    type: 'string',
                    example: 'attachment; filename="combined-2024-01-15.log"',
                  },
                  description: 'File download header',
                },
                'Content-Type': {
                  schema: {
                    type: 'string',
                    example: 'text/plain',
                  },
                },
                'Content-Length': {
                  schema: {
                    type: 'integer',
                  },
                },
              },
            },
            '404': { description: 'Log file not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/v1/platform-admin/system/logs/download/{filename}': {
        get: {
          tags: ['Platform Admin'],
          summary: 'Download specific log file',
          description: 'Download a specific combined log file by filename. Returns file as download. Requires PLATFORM_ADMIN role.',
          operationId: 'downloadLogFile',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'filename',
              in: 'path',
              description: 'Log file name (e.g., combined-2024-01-15.log)',
              required: true,
              schema: {
                type: 'string',
                example: 'combined-2024-01-15.log',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Log file downloaded successfully',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
              headers: {
                'Content-Disposition': {
                  schema: {
                    type: 'string',
                    example: 'attachment; filename="combined-2024-01-15.log"',
                  },
                  description: 'File download header',
                },
                'Content-Type': {
                  schema: {
                    type: 'string',
                    example: 'text/plain',
                  },
                },
                'Content-Length': {
                  schema: {
                    type: 'integer',
                  },
                },
              },
            },
            '404': { description: 'Log file not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    }
  };

// Since we're providing a full OpenAPI definition, we can use it directly
// swaggerJsdoc is mainly for JSDoc-based definitions, but it also works with full definitions
const options = {
  definition: swaggerDefinition,
  apis: [], // Not using JSDoc comments, using full definition instead
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
