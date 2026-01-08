# aibigo-server

Node.js Express server for aibigo project.

## Tech Stack

- Node.js (18+)
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Docker & Docker Compose

## Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Docker and Docker Compose (optional, for containerized API only)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
# Create .env file manually or copy from example
```

3. Add your MongoDB Atlas connection string to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
```

4. Seed the database with sample data:
```bash
# Create only PLATFORM_ADMIN user
npm run seed

# Create comprehensive sample data (PLATFORM_ADMIN + all entities)
npm run seed:all
```

**Seed:all creates:**
- PLATFORM_ADMIN user (`platformadmin@email.com` / `platformAdmin123`)
- 2 Universities (SPPU, Mumbai University)
- 2 Programs (B.E Computer Engineering, B.Sc Computer Science)
- 2 Subjects (Operating Systems, DBMS)
- 3 Chapters (for OS subject)
- 2 Industry Partners (TCS, Infosys)
- 3 Assessments
- 1 Institute
- 2 Opportunities (Job/Internship)
- 2 Sample Students (`student1@email.com` / `Student123`, `student2@email.com` / `Student123`)

**Getting MongoDB Atlas Connection String:**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user (Database Access)
4. Whitelist your IP address (Network Access)
5. Click "Connect" → "Connect your application"
6. Copy the connection string and replace `<password>` with your database user password

### Running the Application

#### Local Development

1. Make sure your `.env` file has the `MONGODB_URI` set to your MongoDB Atlas connection string
2. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

#### Docker Compose (Optional - API only, MongoDB Atlas still required)

If you want to run the API in Docker (MongoDB will still be Atlas):

1. Make sure your `.env` file has the `MONGODB_URI` set to your MongoDB Atlas connection string
2. Start the API container:
```bash
docker-compose up -d api
```

3. View logs:
```bash
docker-compose logs -f api
```

4. Stop service:
```bash
docker-compose down
```

**Note:** The Docker setup does not include MongoDB. You must use MongoDB Atlas or configure a separate MongoDB instance.

## Database

The application uses **MongoDB Atlas** (cloud MongoDB) with Mongoose. The database connection is configured in `src/config/database.js`.

### MongoDB Atlas Setup

1. **Create Account**: Sign up at https://www.mongodb.com/cloud/atlas (free tier available)
2. **Create Cluster**: Choose a free M0 cluster
3. **Database Access**: Create a database user with username and password
4. **Network Access**: Whitelist your IP address (or use `0.0.0.0/0` for development)
5. **Get Connection String**: 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority`

6. **Add to .env**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aibigo?retryWrites=true&w=majority
```

### Repository Pattern

The codebase uses a repository pattern for database abstraction, allowing easy replacement of MongoDB with:
- PostgreSQL
- DynamoDB
- CosmosDB

Base repository is located at `src/repositories/BaseRepository.js`.

## API Documentation

Once the server is running, access Swagger UI at:
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs.json

## Health Check

- **Health Endpoint**: http://localhost:3000/health
- **API Health**: http://localhost:3000/api/v1/health

## Example Usage

### Test Credentials

After running the seed script (`npm run seed:all`), you can use these credentials:

**PLATFORM_ADMIN User:**
- Email: `platformadmin@email.com`
- Password: `platformAdmin123`
- Role: `PLATFORM_ADMIN`

**Sample Students:**
- Email: `student1@email.com` / Password: `Student123`
- Email: `student2@email.com` / Password: `Student123`

### Getting Access Token

1. **Login** to get JWT token:
```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "platformadmin@email.com",
  "password": "platformAdmin123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "platformadmin@email.com",
    "role": "PLATFORM_ADMIN",
    "status": "ACTIVE"
  }
}
```

2. **Use the accessToken** in Authorization header for protected endpoints:
```bash
Authorization: Bearer <accessToken>
```

### Example API Calls

**Create University:**
```bash
POST http://localhost:3000/api/v1/platform-admin/academics/universities
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Savitribai Phule Pune University",
  "code": "SPPU",
  "state": "Maharashtra",
  "country": "India",
  "isActive": true
}
```

**Create Program:**
```bash
POST http://localhost:3000/api/v1/platform-admin/academics/programs
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "universityId": "<university-id-from-previous-response>",
  "name": "B.E Computer Engineering",
  "code": "BE-COMP",
  "durationYears": 4,
  "isActive": true
}
```

## Project Structure

```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   └── swagger.js       # Swagger/OpenAPI configuration
├── controllers/          # Thin controllers
│   ├── auth.controller.js
│   ├── system.controller.js
│   └── platform-admin.controller.js
├── models/               # Mongoose schemas
│   ├── User.model.js
│   ├── University.model.js
│   ├── Program.model.js
│   ├── Subject.model.js
│   ├── Chapter.model.js
│   ├── Opportunity.model.js
│   ├── IndustryPartner.model.js
│   ├── Assessment.model.js
│   ├── Institute.model.js
│   └── SubscriptionPlan.model.js
├── repositories/         # Database abstraction
│   ├── BaseRepository.js
│   ├── User.repository.js
│   ├── University.repository.js
│   ├── Program.repository.js
│   ├── Subject.repository.js
│   ├── Chapter.repository.js
│   ├── Opportunity.repository.js
│   ├── IndustryPartner.repository.js
│   ├── Assessment.repository.js
│   ├── Institute.repository.js
│   └── SubscriptionPlan.repository.js
├── middleware/           # Middleware
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── scripts/              # Utility scripts
│   └── seed.js           # Seed script for PLATFORM_ADMIN user
├── routes/              # Route definitions
│   ├── auth.routes.js
│   ├── system.routes.js
│   └── platform-admin.routes.js
├── services/            # Business logic
│   ├── auth.service.js
│   ├── system.service.js
│   └── platform-admin.service.js
└── server.js            # Express server setup
```

## Environment Variables

See `.env.example` for all available environment variables.

## Architecture Rules

- REST APIs only (no GraphQL)
- Role-based access control (RBAC)
- Platform-Admin APIs isolated under `/api/platform-admin`
- No direct DB access from routes (service layer mandatory)
- Controllers must be thin
- Business rules live in services
- Repository pattern for database abstraction

## License

ISC
