# Reservation API

A modern, scalable reservation management system built with NestJS. This monolith application provides authentication, user management, reservation handling, and notification services.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Refresh token support
  - Token revocation
  - Password hashing with bcrypt

- **User Management**
  - User registration and profile management
  - Secure password handling
  - User listing with pagination

- **Reservation System**
  - Create, read, update, and delete reservations
  - Paginated reservation listings
  - Reservation querying by user and place

- **Notifications**
  - Email notifications via BullMQ queues
  - Background job processing with Redis
  - Template-based email system

- **API Features**
  - RESTful API design
  - Swagger/OpenAPI documentation
  - Request validation
  - Global error handling
  - Structured logging with Pino
  - Pagination support for all list endpoints

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - [Installation guide](https://pnpm.io/installation)
- **Docker** and **Docker Compose** - [Installation guide](https://docs.docker.com/get-docker/)
- **Git**

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Logging**: Pino
- **Queue**: BullMQ
- **Email**: Nodemailer

## 📁 Project Structure

```
nest-microservice/
├── app/                    # Main application code
│   └── src/
│       ├── auth/          # Authentication module
│       ├── users/         # User management module
│       ├── reservations/  # Reservation management module
│       ├── notification/ # Notification service
│       ├── app.module.ts  # Root module
│       └── main.ts        # Application entry point
├── libs/                   # Shared libraries
│   └── common/            # Common utilities and modules
│       ├── database/      # Database configuration
│       ├── dto/           # Data Transfer Objects
│       ├── filters/       # Exception filters
│       ├── guards/        # Authentication guards
│       ├── interceptors/  # Request/Response interceptors
│       └── utils/         # Utility functions
├── migrations/            # Database migrations
├── scripts/              # Utility scripts (seeding, etc.)
├── docker-compose.yaml    # Docker services configuration
├── Makefile              # Common commands
└── package.json          # Dependencies and scripts
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=nest-microservice
POSTGRES_SYNCHRONIZE=false
POSTGRES_LOGGING=false
POSTGRES_MIGRATIONS_RUN=true
POSTGRES_RETRY_ATTEMPTS=10
POSTGRES_RETRY_DELAY=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Mail (for notifications)
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=noreply@nest-microservice.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

> **Note**: Change `JWT_SECRET` to a strong, random string in production. Never commit `.env` files to version control.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run the complete setup in one command:

```bash
git clone <repository-url>
cd nest-microservice
make setup
```

This will:
1. Install all dependencies
2. Start Docker services (PostgreSQL & Redis)
3. Run database migrations

Then start the development server:

```bash
make dev
```

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd nest-microservice
```

#### 2. Install Dependencies

```bash
make install
# or
pnpm install
```

#### 3. Start Docker Services

Start PostgreSQL and Redis using Docker Compose:

```bash
make up
```

This will start:
- PostgreSQL on port `5432`
- Redis on port `6379`

#### 4. Run Database Migrations

```bash
make migrate
```

#### 5. (Optional) Seed Initial Data

Seed the database with sample users:

```bash
make seed
```

#### 6. Start the Application

**Development mode** (with hot reload):
```bash
make dev
```

**Production mode**:
```bash
make build
make start-prod
```

The application will start on `http://localhost:3000` (or the port specified in your `.env` file).

> 💡 **Tip**: Run `make help` to see all available commands.

## 📚 API Documentation

Once the application is running, access the Swagger API documentation at:

**http://localhost:3000/api**

The Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication testing
- All available endpoints

## 🔌 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/users` - Get all users (paginated)

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID

### Reservations

- `POST /reservations` - Create a new reservation
- `GET /reservations` - Get all reservations (paginated)
- `GET /reservations/:id` - Get reservation by ID
- `PATCH /reservations/:id` - Update a reservation
- `DELETE /reservations/:id` - Delete a reservation

### Pagination

All list endpoints support pagination query parameters:

- `page` (optional, default: 1) - Page number (1-indexed)
- `limit` (optional, default: 10, max: 100) - Number of items per page

**Example:**
```bash
GET /users?page=1&limit=20
GET /reservations?page=2&limit=10
```

**Response format:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
make test

# Watch mode
make test-watch

# Coverage report
make test-cov

# End-to-end tests
make test-e2e
```

Or use pnpm directly:
```bash
pnpm run test
pnpm run test:watch
pnpm run test:cov
pnpm run test:e2e
```

## 🗄️ Database Management

### Migrations

```bash
# Generate a new migration
make migrate-generate NAME=YourMigrationName

# Run pending migrations
make migrate

# Revert the last migration
make migrate-revert
```

### Seeding

```bash
# Seed users
make seed
```

Or use pnpm directly:
```bash
pnpm run migration:generate migrations/YourMigrationName
pnpm run migration:run
pnpm run migration:revert
pnpm run seed:users
```

## 🛠️ Development Commands

```bash
# Start development server
make dev

# Build for production
make build

# Format code
make format

# Lint code
make lint

# Start in debug mode
pnpm run start:debug
```

Or use pnpm directly:
```bash
pnpm run start:dev
pnpm run build
pnpm run format
pnpm run lint
```

## 🐳 Docker Commands

Using the Makefile (recommended):

```bash
# Start all services
make up

# Stop all services
make down

# Restart all services
make restart

# Build Docker images
make build-docker

# View Docker logs
make logs
```

Or use Docker Compose directly:

```bash
docker-compose up -d      # Start services
docker-compose down       # Stop services
docker-compose restart   # Restart services
docker-compose logs -f    # View logs
```

## 📋 Makefile Commands Reference

The project includes a comprehensive Makefile for common tasks. Run `make` or `make help` to see all available commands:

```bash
make
# or
make help
```

### Quick Reference

| Command | Description |
|---------|-------------|
| `make setup` | Complete project setup (install, docker, migrations) |
| `make install` | Install dependencies |
| `make dev` | Start development server |
| `make build` | Build for production |
| `make start-prod` | Start production server |
| `make up` | Start Docker services |
| `make down` | Stop Docker services |
| `make restart` | Restart Docker services |
| `make migrate` | Run database migrations |
| `make migrate-generate NAME=...` | Generate new migration |
| `make seed` | Seed database |
| `make test` | Run unit tests |
| `make test-cov` | Run tests with coverage |
| `make lint` | Lint code |
| `make format` | Format code |
| `make clean` | Clean build artifacts |

> 💡 **Tip**: All Makefile commands are wrappers around pnpm scripts. You can still use `pnpm run <script>` directly if preferred.

## 🔐 Authentication

The API uses JWT Bearer tokens for authentication. To access protected endpoints:

1. Login via `POST /auth/login` with email and password
2. Receive access token and refresh token
3. Include the access token in the `Authorization` header:

```bash
Authorization: Bearer <your-access-token>
```

## 📝 Code Quality

The project includes:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Jest** for testing

## 🐛 Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Check what's using the port
lsof -i :3000  # or :5432, :6379

# Kill the process or change the port in .env
```

### Database Connection Issues

1. Ensure Docker services are running:
   ```bash
   docker-compose ps
   ```

2. Check database credentials in `.env` match `docker-compose.yaml`

3. Verify PostgreSQL is healthy:
   ```bash
   docker-compose exec postgres pg_isready -U admin
   ```

### Migration Errors

If migrations fail:

1. Ensure database is running and accessible
2. Check `POSTGRES_MIGRATIONS_RUN` is set to `true` in `.env`
3. Manually run migrations: `make migrate`

### Redis Connection Issues

1. Verify Redis is running:
   ```bash
   docker-compose exec redis redis-cli ping
   ```

2. Should return `PONG`

## 📦 Production Deployment

Before deploying to production:

1. **Security**:
   - Change `JWT_SECRET` to a strong, random value
   - Use environment-specific `.env` files
   - Enable HTTPS
   - Review CORS settings

2. **Database**:
   - Set `POSTGRES_SYNCHRONIZE=false`
   - Set `POSTGRES_LOGGING=false`
   - Use managed database services in production

3. **Performance**:
   - Enable Redis caching
   - Configure connection pooling
   - Set up monitoring and logging

4. **Build**:
   ```bash
   make build
   make start-prod
   ```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and unlicensed.

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Swagger/OpenAPI](https://swagger.io)
- [Docker Documentation](https://docs.docker.com)

---

**Happy Coding! 🎉**
