#!/bin/bash
set -euo pipefail

# Health check script for post-deployment verification
HEALTH_URL="${1:-http://localhost:3000/health}"
MAX_RETRIES="${2:-10}"
INTERVAL="${3:-5}"

echo "Starting health check for: $HEALTH_URL"

for i in $(seq 1 "$MAX_RETRIES"); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Health check passed (HTTP $HTTP_CODE)"

    # Verify response body contains expected fields
    RESPONSE=$(curl -s "$HEALTH_URL")
    if echo "$RESPONSE" | grep -q '"status"' && \
       echo "$RESPONSE" | grep -q '"services"'; then
      echo "✓ Response structure is valid"
      echo "$RESPONSE"
      exit 0
    else
      echo "✗ Response structure is invalid"
      echo "$RESPONSE"
    fi
  fi

  echo "⚠ Health check attempt $i/$MAX_RETRIES failed (HTTP $HTTP_CODE), retrying in ${INTERVAL}s..."
  sleep "$INTERVAL"
done

echo "✗ Health check failed after $MAX_RETRIES attempts"
exit 1
