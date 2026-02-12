install:
	pnpm install

dev:
	moon :dev

format:
	moon :format

# Docker Commands
docker-up:
	docker compose up -d

docker-dev-up:
	docker-compose -f docker-compose.dev.yml up -d
	
docker-dev-down:
	docker-compose -f docker-compose.dev.yml down

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-build:
	docker compose build

docker-rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

docker-migrate:
	docker compose --profile migration up migration

docker-tools:
	docker compose --profile tools up -d adminer

docker-db-reset:
	docker compose down -v
	docker compose up -d postgres
	sleep 5
	docker compose --profile migration up migration

docker-clean:
	docker compose down -v
	docker system prune -f