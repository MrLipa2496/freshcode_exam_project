#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################


set -e 
set -o pipefail

started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker compose --file docker-compose-dev.yaml up -d
echo ""

echo "-----> Waiting for Postgres to be ready..."
until docker exec exam-freshcode-db-dev-1 pg_isready -U postgres > /dev/null 2>&1; do
  echo "  ...waiting"
  sleep 1
done
echo "-----> Postgres is ready"

echo "-----> Waiting for server to stabilize..."
sleep 3

echo "-----> Running application migrations"
if ! docker exec exam-freshcode-server-dev-1 npx sequelize-cli db:migrate; then
  echo "Migration failed"
  exit 1
fi
echo ""

echo "-----> Running application seeds"
if ! docker exec exam-freshcode-server-dev-1 npx sequelize-cli db:seed:all; then
  echo "Seeding failed"
  exit 1
fi
echo "<----- Seeds created"

ended_at=$(date +"%s")
minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "Done in ${minutes}m${seconds}s"
