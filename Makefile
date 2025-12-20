
# Setup
setup: install up migrate
	@echo "✅ Setup complete! Run 'make dev' to start the development server."

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
