#!/bin/bash

# Production Startup Script for Moter Backend
# This script ensures all prerequisites are met before starting the server

set -e  # Exit on any error

echo "🚀 Starting Moter Backend in Production Mode"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with required environment variables"
    echo "See .env.example for reference"
    exit 1
fi

# Check if NODE_ENV is set to production
if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  Warning: NODE_ENV is not set to 'production'${NC}"
    echo "Setting NODE_ENV=production"
    export NODE_ENV=production
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠️  dist directory not found. Building application...${NC}"
    pnpm run build
fi

# Check critical environment variables
echo "🔍 Checking environment variables..."

check_env_var() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}❌ Error: $1 is not set${NC}"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

ERRORS=0

# Check required variables
check_env_var "DATABASE_URL" || ERRORS=$((ERRORS+1))
check_env_var "JWT_SECRET" || ERRORS=$((ERRORS+1))
check_env_var "CORS_ORIGIN" || ERRORS=$((ERRORS+1))

# Check optional but recommended variables
if [ -z "$RABBITMQ_URL" ]; then
    echo -e "${YELLOW}⚠️  RABBITMQ_URL not set, using default${NC}"
fi

if [ -z "$CRON_SECRET" ]; then
    echo -e "${YELLOW}⚠️  CRON_SECRET not set (recommended for production)${NC}"
fi

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Please fix the errors above before starting${NC}"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""

# Load environment variables
set -a
source .env
set +a

# Start the server
echo "🎯 Starting server on port ${PORT:-8000}..."
echo ""

node dist/server.js
