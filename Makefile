
# Setup
setup: setup-env install up migrate
	@echo "✅ Setup complete! Starting development server..."
	@echo ""
	@$(MAKE) dev

setup-env:
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file with development defaults..."; \
		echo "# Application" > .env; \
		echo "NODE_ENV=development" >> .env; \
		echo "PORT=3000" >> .env; \
		echo "" >> .env; \
		echo "# Database" >> .env; \
		echo "POSTGRES_HOST=localhost" >> .env; \
		echo "POSTGRES_PORT=5432" >> .env; \
		echo "POSTGRES_USER=admin" >> .env; \
		echo "POSTGRES_PASSWORD=admin" >> .env; \
		echo "POSTGRES_DB=nest-microservice" >> .env; \
		echo "POSTGRES_SYNCHRONIZE=false" >> .env; \
		echo "POSTGRES_LOGGING=false" >> .env; \
		echo "POSTGRES_MIGRATIONS_RUN=true" >> .env; \
		echo "POSTGRES_RETRY_ATTEMPTS=10" >> .env; \
		echo "POSTGRES_RETRY_DELAY=3000" >> .env; \
		echo "" >> .env; \
		echo "# JWT" >> .env; \
		echo "JWT_SECRET=dev-secret-key-change-in-production-$$(openssl rand -hex 32)" >> .env; \
		echo "" >> .env; \
		echo "# Mail (for notifications)" >> .env; \
		echo "MAIL_HOST=localhost" >> .env; \
		echo "MAIL_PORT=1025" >> .env; \
		echo "MAIL_FROM=noreply@nest-microservice.com" >> .env; \
		echo "" >> .env; \
		echo "# Redis" >> .env; \
		echo "REDIS_HOST=localhost" >> .env; \
		echo "REDIS_PORT=6379" >> .env; \
		echo "REDIS_DB=0" >> .env; \
		echo "✅ .env file created successfully!"; \
	else \
		echo "ℹ️  .env file already exists. Skipping creation."; \
	fi

install:
	pnpm install

# Docker commands
up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose down
	docker-compose up -d

build-docker:
	docker-compose build

logs:
	docker-compose logs -f

# Development commands
dev:
	pnpm run start:dev

build:
	pnpm run build

start:
	pnpm run start

start-prod:
	pnpm run build
	pnpm run start:prod

# Database commands
migrate:
	pnpm run migration:run

migrate-generate:
	@if [ -z "$(NAME)" ]; then \
		echo "Error: NAME is required. Example: make migrate-generate NAME=AddNewColumn"; \
		exit 1; \
	fi
	pnpm run migration:generate migrations/$(NAME)

migrate-revert:
	pnpm run migration:revert

seed:
	pnpm run seed:users

# Testing commands
test:
	pnpm run test

test-watch:
	pnpm run test:watch

test-cov:
	pnpm run test:cov

test-e2e:
	pnpm run test:e2e

# Code quality
lint:
	pnpm run lint

format:
	pnpm run format

# Cleanup
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage
	rm -rf .pnpm-store
