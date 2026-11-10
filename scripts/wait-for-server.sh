#!/usr/bin/env bash
# Waits until the Rocket.Chat API answers, so tests never start against a booting server.
set -euo pipefail

URL="${API_URL:-http://localhost:3000}/api/info"
TIMEOUT="${SERVER_TIMEOUT_SECONDS:-300}"

echo "Waiting for Rocket.Chat at $URL (timeout ${TIMEOUT}s)..."
for ((elapsed = 0; elapsed < TIMEOUT; elapsed += 5)); do
  if curl --silent --fail "$URL" | grep -q '"success":true'; then
    echo "Rocket.Chat is ready after ${elapsed}s"
    exit 0
  fi
  sleep 5
done

echo "Rocket.Chat did not become ready within ${TIMEOUT}s" >&2
docker compose -f docker/docker-compose.yml logs --tail 50 rocketchat >&2 || true
exit 1
