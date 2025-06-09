#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################

set -e

PROJECT_NAME="freshcode_exam_project"
COMPOSE_FILE="docker-compose-dev.yaml"

started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker compose -p $PROJECT_NAME --file $COMPOSE_FILE up -d
echo ""

POSTGRES_CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}-db-dev" --format "{{.Names}}" | head -n 1)
SERVER_CONTAINER=$(docker ps --filter "name=${PROJECT_NAME}-server-dev" --format "{{.Names}}" | head -n 1)

if [[ -z "$POSTGRES_CONTAINER" || -z "$SERVER_CONTAINER" ]]; then
  echo "Could not find the required containers (${PROJECT_NAME}-db-dev or ${PROJECT_NAME}-server-dev)"
  docker ps
  exit 1
fi

echo "-----> Waiting for Postgres ($POSTGRES_CONTAINER) to be ready..."
until docker exec "$POSTGRES_CONTAINER" pg_isready -U postgres > /dev/null 2>&1; do
  echo "  ...waiting"
  sleep 1
done
echo "-----> Postgres is ready"

echo "-----> Waiting for server to stabilize..."
sleep 3

echo "-----> Running application migrations"
if ! docker exec "$SERVER_CONTAINER" npx sequelize-cli db:migrate; then
  echo "Migration failed"
  exit 1
fi
echo ""

echo "-----> Running application seeds"
if ! docker exec "$SERVER_CONTAINER" npx sequelize-cli db:seed:all; then
  echo "Seeding failed"
  exit 1
fi
echo "<----- Seeds created"

ended_at=$(date +"%s")
minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "Done in ${minutes}m${seconds}s"
