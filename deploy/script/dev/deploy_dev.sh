#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.dev.yml"
ICON_PULL="⬇️ "
ICON_UP="🚀 "
ICON_PRUNE="🧹 "
ICON_DONE="✅ "

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing .env file in ${SCRIPT_DIR}" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed or not on PATH." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose V2 is required (docker compose command)." >&2
  exit 1
fi

# Default repository owner fallback for image references.
export GITHUB_REPOSITORY_OWNER="${GITHUB_REPOSITORY_OWNER:-thewind121212}"

echo "${ICON_PULL}Pulling latest images..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" pull

echo "${ICON_UP}Starting services..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --remove-orphans

echo "${ICON_PRUNE}Cleaning unused images..."
docker image prune -f >/dev/null

echo "${ICON_DONE}Deployment completed."
