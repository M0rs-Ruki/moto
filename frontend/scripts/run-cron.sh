#!/bin/bash

# Cron Job Script for Scheduled Messages
# This script is called by the server cron to trigger the scheduled messages endpoint

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables if .env exists
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(cat "$PROJECT_DIR/.env" | grep -v '^#' | xargs)
fi

# Get the domain/URL from environment or use default
APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
CRON_SECRET="${CRON_SECRET}"

# Check if CRON_SECRET is set
if [ -z "$CRON_SECRET" ]; then
    echo "ERROR: CRON_SECRET environment variable is not set"
    exit 1
fi

# Construct the full URL
CRON_URL="${APP_URL}/api/cron/send-scheduled-messages"

# Log the execution
echo "========================================="
echo "Cron job executed at: $(date)"
echo "URL: $CRON_URL"
echo "========================================="

# Make the request
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$CRON_URL" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json")

# Extract HTTP code and body
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

# Check response
if [ "$HTTP_CODE" = "200" ]; then
    echo "SUCCESS: Cron job completed successfully"
    echo "Response: $BODY"
    exit 0
else
    echo "ERROR: Cron job failed with HTTP code $HTTP_CODE"
    echo "Response: $BODY"
    exit 1
fi

