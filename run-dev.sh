#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$ROOT_DIR/.env" ]]; then
  # shellcheck disable=SC1090
  source "$ROOT_DIR/.env"
fi

DM8_HOST="${DM8_HOST:-localhost}"
DM8_PORT="${DM8_PORT:-5236}"
DM8_USER="${DM8_USER:-SYSDBA}"
DM8_PASSWORD="${DM8_PASSWORD:-${DM8_SYSDBA_PWD:-ChangeMeDm8!}}"
API_BASE="${VITE_API_BASE:-http://localhost:8080}"

echo "[dev] starting docker compose services (dm8/kafka/redis/flink/grafana)…"
(cd "$ROOT_DIR/backend" && docker compose up -d dm8 zookeeper kafka redis jobmanager taskmanager grafana)

echo "[dev] backend (dm8 profile) will use DM8_HOST=${DM8_HOST} DM8_PORT=${DM8_PORT} DM8_USER=${DM8_USER}"
echo "[dev] API base for frontend: ${API_BASE}"

pids=()

(cd "$ROOT_DIR/backend" && \
  SPRING_PROFILES_ACTIVE=dm8 \
  DM8_HOST="${DM8_HOST}" \
  DM8_PORT="${DM8_PORT}" \
  DM8_USER="${DM8_USER}" \
  DM8_PASSWORD="${DM8_PASSWORD}" \
  ./gradlew bootRun) &
pids+=($!)

(cd "$ROOT_DIR/frontend" && VITE_API_BASE="${API_BASE}" npm run dev -- --host) &
pids+=($!)

trap 'echo "[dev] stopping..."; kill "${pids[@]}" 2>/dev/null || true' INT TERM
wait "${pids[@]}"
