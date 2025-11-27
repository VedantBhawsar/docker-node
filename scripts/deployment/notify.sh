#!/bin/bash
set -euo pipefail

# Notification script for deployment events
# Supports Slack, Discord, and custom webhooks

NOTIFICATION_TYPE="${1:-info}"  # info, success, error
MESSAGE="${2:-Deployment notification}"
WEBHOOK_URL="${WEBHOOK_URL:-}"

# Color codes
if [ "$NOTIFICATION_TYPE" = "success" ]; then
  COLOR="good"
  EMOJI="✅"
elif [ "$NOTIFICATION_TYPE" = "error" ]; then
  COLOR="danger"
  EMOJI="❌"
else
  COLOR="#439FE0"
  EMOJI="ℹ️"
fi

# Function to send Slack notification
send_slack() {
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"attachments\": [{
          \"color\": \"$COLOR\",
          \"title\": \"$EMOJI Deployment Notification\",
          \"text\": \"$MESSAGE\",
          \"fields\": [
            {
              \"title\": \"Environment\",
              \"value\": \"${DEPLOYMENT_ENV:-production}\",
              \"short\": true
            },
            {
              \"title\": \"Timestamp\",
              \"value\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
              \"short\": true
            }
          ]
        }]
      }"
    echo "Slack notification sent"
  fi
}

# Function to send Discord notification
send_discord() {
  if [ -n "$DISCORD_WEBHOOK_URL" ]; then
    curl -X POST "$DISCORD_WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"embeds\": [{
          \"title\": \"$EMOJI Deployment Notification\",
          \"description\": \"$MESSAGE\",
          \"color\": 3447003,
          \"fields\": [
            {
              \"name\": \"Environment\",
              \"value\": \"${DEPLOYMENT_ENV:-production}\",
              \"inline\": true
            },
            {
              \"name\": \"Timestamp\",
              \"value\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
              \"inline\": true
            }
          ]
        }]
      }"
    echo "Discord notification sent"
  fi
}

# Function to send generic webhook
send_webhook() {
  if [ -n "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
      -H 'Content-Type: application/json' \
      -d "{
        \"type\": \"$NOTIFICATION_TYPE\",
        \"message\": \"$MESSAGE\",
        \"environment\": \"${DEPLOYMENT_ENV:-production}\",
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
      }"
    echo "Webhook notification sent"
  fi
}

# Send notifications
send_slack
send_discord
send_webhook

echo "Notifications processed"
