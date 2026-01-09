# aibigo-server

Node.js Express REST API server for the AiBigo Education Platform. This server provides authentication, platform administration, academic management, engagement features, and comprehensive logging capabilities.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database](#database)
- [Authentication & Authorization](#authentication--authorization)
- [Logging System](#logging-system)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB (via Mongoose 9.1+)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI (swagger-jsdoc)
- **Logging**: Winston with daily rotation
- **Rate Limiting**: express-rate-limit
- **HTTP Logging**: Morgan
- **Deployment**: Vercel (serverless functions)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - PLATFORM_ADMIN, OPERATIONS_ADMIN, FACULTY, STUDENT
- 📚 **Academic Management** - Universities, Programs, Subjects, Chapters
- 🤝 **Engagement Features** - Opportunities, Industry Partners, Assessments, Courses
- 🏢 **Institute Management** - Multi-tenant institute support
- 💼 **Business Operations** - Subscription Plans, Payments
- ⚙️ **System Administration** - Admin users, Platform settings, Analytics triggers
- 📊 **Audit Logging** - Complete audit trail of all actions
- 📝 **Application Logging** - Comprehensive Winston-based logging system
- 📥 **Log Management** - Download and view application logs
- 🚀 **Optimized APIs** - Aggregation pipelines, nested population, caching
- 📖 **Swagger Documentation** - Interactive API documentation

## 📦 Prerequisites

- **Node.js** 18 or higher
- **MongoDB Atlas** account (free tier available) or local MongoDB instance
- **npm** or **yarn** package manager

## 🚀 Installation

1. **Clone the repository** (if not already cloned):
```bash
git clone <repository-url>
cd aibigo-server
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** in the root directory:
```bash
# Copy from example or create manually
touch .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Seed the database**:
```bash
# Create only PLATFORM_ADMIN user
npm run seed

# OR create comprehensive sample data
npm run seed:all
```

## ⚙️ Configuration

### MongoDB Atlas Setup

1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

2. **Create Cluster**: 
   - Choose a free M0 cluster
   - Select your preferred region
   - Wait for cluster to be created (~5 minutes)

3. **Database Access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"

4. **Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Use `0.0.0.0/0` (allow from anywhere)
   - For production: Add specific IP addresses

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority`

6. **Add to `.env`**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority
```

## 🏃 Running the Application

### Local Development

```bash
# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or PORT from .env)

### Available Endpoints

- **API Base**: `http://localhost:3000/api/v1`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`
- **Health Check**: `http://localhost:3000/health`

## 📖 API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:3000/api-docs

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

### API Endpoints Overview

#### Authentication (`/api/v1/auth`)
- `POST /login` - User login
- `POST /register` - Student registration
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

#### Platform Admin (`/api/v1/platform-admin`)
- `GET /dashboard/overview` - Dashboard statistics
- **Academics**: Universities, Programs, Subjects, Chapters (GET, POST)
- **Engagement**: Opportunities, Industry Partners, Assessments, Courses (GET, POST)
- **Institutes**: List and create institutes (GET, POST)
- **Business**: Subscription Plans, Payments (GET, POST)
- **System**: Admin Users, Platform Settings, Analytics, Audit Logs (GET, POST)

#### System (`/api/v1/system`)
- `POST /admin-users` - Create admin user (OPERATIONS_ADMIN, FACULTY)

#### Logs (`/api/v1/platform-admin/system/logs`)
- `GET /files` - List log files
- `GET /recent` - Get recent logs
- `GET /statistics` - Get log statistics
- `GET /files/:filename` - Read log file
- `GET /download` - Download today's log file
- `GET /download/:filename` - Download specific log file

## 📁 Project Structure

```
aibigo-server/
├── api/
│   └── index.js                 # Vercel serverless entry point
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── logger.js            # Winston logger configuration
│   │   ├── swagger.js           # OpenAPI/Swagger specification
│   │   └── swagger-ui.js        # Swagger UI HTML
│   ├── controllers/             # Thin controllers (request/response handling)
│   │   ├── auth.controller.js
│   │   ├── platform-admin.controller.js
│   │   ├── system.controller.js
│   │   └── log.controller.js
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.js   # JWT authentication & authorization
│   │   ├── validation.middleware.js
│   │   ├── auditLog.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── errorLogger.middleware.js
│   ├── models/                  # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── University.model.js
│   │   ├── Program.model.js
│   │   ├── Subject.model.js
│   │   ├── Chapter.model.js
│   │   ├── Opportunity.model.js
│   │   ├── IndustryPartner.model.js
│   │   ├── Assessment.model.js
│   │   ├── Course.model.js
│   │   ├── Institute.model.js
│   │   ├── SubscriptionPlan.model.js
│   │   ├── Payment.model.js
│   │   ├── PlatformSetting.model.js
│   │   ├── AnalyticsTrigger.model.js
│   │   └── AuditLog.model.js
│   ├── repositories/            # Database abstraction layer
│   │   ├── BaseRepository.js    # Base repository with common methods
│   │   └── [Model].repository.js # Model-specific repositories
│   ├── routes/                   # Route definitions
│   │   ├── auth.routes.js
│   │   ├── platform-admin.routes.js
│   │   ├── system.routes.js
│   │   └── log.routes.js
│   ├── services/                 # Business logic layer
│   │   ├── auth.service.js
│   │   ├── platform-admin.service.js
│   │   ├── system.service.js
│   │   └── log.service.js
│   ├── utils/                    # Utility functions
│   │   ├── jwt.util.js           # JWT token generation/verification
│   │   └── auditLogger.util.js   # Audit logging utilities
│   ├── scripts/                  # Utility scripts
│   │   ├── seed.js               # Seed PLATFORM_ADMIN user
│   │   ├── seed-data.js          # Seed comprehensive data
│   │   └── test-all-apis.js      # API testing script
│   └── server.js                 # Express app setup and server start
├── logs/                         # Application logs (auto-generated)
│   └── combined-YYYY-MM-DD.log  # Daily log files
├── .env                          # Environment variables (not in git)
├── .gitignore
├── package.json
├── vercel.json                   # Vercel deployment configuration
└── README.md
```

## 🏗 Architecture

### Design Patterns

1. **Repository Pattern**: Database abstraction for easy DB replacement
   - Base repository: `src/repositories/BaseRepository.js`
   - Model-specific repositories extend base repository
   - Supports: MongoDB, PostgreSQL, DynamoDB, CosmosDB

2. **Service Layer**: Business logic separation
   - Controllers are thin (only handle HTTP)
   - Services contain all business logic
   - Services use repositories for data access

3. **Middleware Chain**:
   - Authentication → Authorization → Validation → Business Logic → Response

### Data Flow

```
Request → Middleware → Controller → Service → Repository → Database
                                                          ↓
Response ← Middleware ← Controller ← Service ← Repository
```

### Key Principles

- **REST APIs only** (no GraphQL)
- **No direct DB access** from routes/controllers
- **Service layer mandatory** for all business logic
- **Repository pattern** for database abstraction
- **Thin controllers** (only request/response handling)
- **Role-based access control** (RBAC)

## 🗄 Database

### MongoDB Atlas (Recommended)

- **Free Tier**: 512MB storage, shared cluster
- **Connection**: Connection string in `.env`
- **Database Name**: `aibigo`

### Models

All models are in `src/models/`:
- **User** - Authentication and user management
- **University** - Academic institutions
- **Program** - Degree programs
- **Subject** - Course subjects
- **Chapter** - Subject chapters
- **Opportunity** - Job/internship opportunities
- **IndustryPartner** - Industry partners
- **Assessment** - Assessments/tests
- **Course** - Courses
- **Institute** - Educational institutes
- **SubscriptionPlan** - Subscription plans
- **Payment** - Payment records
- **PlatformSetting** - Platform configuration
- **AnalyticsTrigger** - Analytics triggers
- **AuditLog** - Audit trail

### Relationships

- Program → University (reference)
- Subject → Program (reference)
- Chapter → Subject (reference)
- Payment → Institute, SubscriptionPlan (references)
- AuditLog → User (reference, populated)

## 🔐 Authentication & Authorization

### JWT Authentication

- **Access Token**: 24 hours expiry
- **Refresh Token**: Optional (not implemented yet)
- **Token Storage**: Client-side (localStorage)

### Roles

1. **PLATFORM_ADMIN** (SUPER_ADMIN)
   - Full system access
   - All CRUD operations
   - System administration

2. **OPERATIONS_ADMIN**
   - Institute management
   - Faculty/Student management
   - Limited platform access

3. **FACULTY**
   - Content creation
   - Assessment management
   - Student interaction

4. **STUDENT**
   - Learning content access
   - Assessment participation
   - Opportunity applications

### Protected Routes

All `/api/v1/platform-admin/*` routes require:
- Valid JWT token
- `PLATFORM_ADMIN` role

### Test Credentials

After running `npm run seed:all`:

**Platform Admin:**
- Email: `platformadmin@email.com`
- Password: `platformAdmin123`
- Role: `PLATFORM_ADMIN`

**Sample Students:**
- Email: `student1@email.com` / Password: `Student123`
- Email: `student2@email.com` / Password: `Student123`

## 📝 Logging System

### Application Logs

Logs are stored in `logs/` directory:
- **combined-YYYY-MM-DD.log** - All logs (single file per day)
- **error-YYYY-MM-DD.log** - Error logs only
- **api-YYYY-MM-DD.log** - API request logs
- **exceptions.log** - Uncaught exceptions
- **rejections.log** - Unhandled promise rejections

### Log Levels

- **error** - Errors only
- **warn** - Warnings
- **info** - Informational (default)
- **debug** - Debug information

### Log Retrieval

Platform admins can retrieve logs via API:
- `GET /api/v1/platform-admin/system/logs/files` - List log files
- `GET /api/v1/platform-admin/system/logs/recent` - Recent logs
- `GET /api/v1/platform-admin/system/logs/statistics` - Log statistics
- `GET /api/v1/platform-admin/system/logs/download` - Download today's log
- `GET /api/v1/platform-admin/system/logs/download/:filename` - Download specific log

### Audit Logging

All platform admin actions are logged:
- Login success/failure
- Data creation/updates/deletes
- API access
- User management actions

Audit logs are stored in MongoDB (`AuditLog` collection) and can be retrieved via:
- `GET /api/v1/platform-admin/system/audit-logs`

## 🧪 Testing

### Test All APIs

```bash
npm run test:apis
```

This script:
- Tests all 35+ API endpoints
- Uses actual data
- Creates test resources
- Verifies responses
- Reports pass/fail status

### Manual Testing

1. **Use Swagger UI**: http://localhost:3000/api-docs
2. **Use Postman/Insomnia**: Import OpenAPI spec from `/api-docs.json`
3. **Use curl**:
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"platformadmin@email.com","password":"platformAdmin123"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/v1/platform-admin/dashboard/overview \
  -H "Authorization: Bearer <token>"
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Configure Environment Variables** in Vercel dashboard
3. **Deploy**: Vercel auto-deploys on push to main branch

### Vercel Configuration

- **Root Directory**: `./`
- **Build Command**: None (serverless)
- **Output Directory**: N/A
- **Install Command**: `npm install`
- **Framework Preset**: Other

### Environment Variables for Vercel

Set these in Vercel dashboard:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - Token expiry (default: 24h)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Set to `production`
- `VERCEL_URL` - Auto-set by Vercel

### Logs on Vercel

- Logs are stored in `/tmp/logs` (ephemeral)
- Logs are cleared on new deployments
- For production: Consider external logging service (Logtail, Datadog, CloudWatch)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production-min-32-chars
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRY=7d

# Frontend URL (for CORS and password reset links)
FRONTEND_URL=http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_TO_FILE=true

# Vercel (auto-set in production)
VERCEL_URL=
VERCEL=1
```

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (min 32 characters)

### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRY` - Token expiry (default: 24h)
- `FRONTEND_URL` - Frontend URL for CORS
- `LOG_LEVEL` - Log level (error/warn/info/debug)

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `MongooseError: Operation timed out`

**Solutions**:
1. Check MongoDB Atlas network access (whitelist your IP)
2. Verify connection string in `.env`
3. Check MongoDB Atlas cluster status
4. Verify database user credentials

### Authentication Issues

**Error**: `401 Unauthorized`

**Solutions**:
1. Check if token is expired (24 hours)
2. Verify token format: `Bearer <token>`
3. Check JWT_SECRET matches
4. Re-login to get new token

### Rate Limiting

**Error**: `429 Too Many Requests`

**Solutions**:
1. Development: Rate limit is 500 req/15min
2. Production: Rate limit is 100 req/15min
3. Wait before retrying
4. Implement request caching on client

### Logs Not Appearing

**Issue**: Log files not created

**Solutions**:
1. Check `logs/` directory exists and is writable
2. Verify `LOG_TO_FILE=true` in `.env`
3. Check file permissions
4. On Vercel: Logs in `/tmp/logs` (ephemeral)

### CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solutions**:
1. Check `FRONTEND_URL` in `.env`
2. Verify CORS middleware is enabled
3. Check browser console for specific error
4. Verify server is running

## 📚 Additional Resources

### API Documentation
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec**: http://localhost:3000/api-docs.json

### Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run seed` - Seed PLATFORM_ADMIN user
- `npm run seed:all` - Seed comprehensive sample data
- `npm run test:apis` - Test all API endpoints

### Key Files

- `src/server.js` - Main server file
- `src/config/database.js` - Database connection
- `src/config/swagger.js` - API documentation
- `src/middleware/auth.middleware.js` - Authentication
- `vercel.json` - Vercel deployment config

## 📝 Notes

- **Database**: Uses MongoDB Atlas (cloud) - no local MongoDB required
- **Logging**: Logs are always written to files (development and production)
- **Rate Limiting**: More lenient in development (500 req/15min vs 100 req/15min)
- **CORS**: Configured to allow all origins (needed for Vercel preview URLs)
- **Serverless**: Configured for Vercel serverless functions

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation in Swagger UI
3. Check server logs in `logs/` directory
4. Review error messages in console

## 📄 License

ISC
