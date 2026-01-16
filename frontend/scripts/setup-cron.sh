#!/bin/bash

# Setup Cron Job Script for Hostinger
# This script helps you set up the cron job on your server

echo "========================================="
echo "Cron Job Setup for Moter Application"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CRON_SCRIPT="$SCRIPT_DIR/run-cron.sh"

# Make the cron script executable
chmod +x "$CRON_SCRIPT"

# Check if .env exists
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "WARNING: .env file not found. Make sure to set CRON_SECRET in your environment."
    echo ""
fi

# Get current user
CURRENT_USER=$(whoami)
CRON_LOG="$PROJECT_DIR/cron.log"

echo "Configuration:"
echo "  Project Directory: $PROJECT_DIR"
echo "  Cron Script: $CRON_SCRIPT"
echo "  Cron Log: $CRON_LOG"
echo "  User: $CURRENT_USER"
echo ""

# Ask for schedule preference
echo "Select cron schedule:"
echo "  1) Every hour (recommended)"
echo "  2) Every 30 minutes"
echo "  3) Every 15 minutes"
echo "  4) Custom"
read -p "Enter choice [1-4]: " schedule_choice

case $schedule_choice in
    1)
        CRON_SCHEDULE="0 * * * *"
        echo "Selected: Every hour"
        ;;
    2)
        CRON_SCHEDULE="*/30 * * * *"
        echo "Selected: Every 30 minutes"
        ;;
    3)
        CRON_SCHEDULE="*/15 * * * *"
        echo "Selected: Every 15 minutes"
        ;;
    4)
        read -p "Enter custom cron schedule (e.g., '0 9 * * *' for daily at 9 AM): " CRON_SCHEDULE
        echo "Selected: Custom ($CRON_SCHEDULE)"
        ;;
    *)
        CRON_SCHEDULE="0 * * * *"
        echo "Invalid choice, defaulting to: Every hour"
        ;;
esac

echo ""
echo "========================================="
echo "Cron Job Entry:"
echo "========================================="
CRON_ENTRY="$CRON_SCHEDULE $CRON_SCRIPT >> $CRON_LOG 2>&1"
echo "$CRON_ENTRY"
echo ""

read -p "Add this cron job? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Cancelled."
    exit 0
fi

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo ""
echo "✅ Cron job added successfully!"
echo ""
echo "To verify, run: crontab -l"
echo "To view logs, run: tail -f $CRON_LOG"
echo "To remove, run: crontab -e (then delete the line)"
echo ""

