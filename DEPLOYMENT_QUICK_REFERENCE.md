# Deployment Quick Reference

## Package.json Scripts Overview

### Development
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint

### Database (Prisma)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Apply database migrations (production-safe)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:reset` - Reset database (⚠️ DANGER: deletes all data)

### Production Build & Deploy
- `npm run build` - Build for production (includes Prisma generate)
- `npm run start` - Start production server
- `npm run deploy:build` - Full production build (Prisma + Next.js)
- `npm run deploy:start` - Start with migrations (runs migrations then starts server)
- `npm run deploy:full` - Complete deployment (build + start with migrations)

### Health & Monitoring
- `npm run health` - Check if application is running (health check endpoint)

### Cron Jobs
- `npm run cron:test` - Test cron endpoint locally (requires CRON_SECRET env var)
- `npm run cron:setup` - Interactive script to set up server cron job

## Quick Deployment Steps

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# Run database migrations
npm run prisma:migrate

# Build application
npm run deploy:build
```

### 2. Start Application
```bash
# Using npm directly
npm run deploy:start

# Or using PM2 (recommended for production)
npm install -g pm2
pm2 start npm --name "moter" -- start
pm2 save
pm2 startup
```

### 3. Set Up Cron Job
```bash
# Interactive setup
npm run cron:setup

# Or manually edit crontab
crontab -e
# Add: 0 * * * * /path/to/scripts/run-cron.sh >> /path/to/cron.log 2>&1
```

## Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Security
CRON_SECRET="your-secure-random-string"
JWT_SECRET="your-jwt-secret-key"

# WhatsApp API (if applicable)
WHATSAPP_API_URL="your-api-url"
WHATSAPP_API_KEY="your-api-key"
```

## Health Check

Test if your application is healthy:
```bash
npm run health
# Or manually:
curl http://localhost:3000/api/health
```

## Common Commands

### Update Application
```bash
git pull
npm install --production
npm run prisma:migrate
npm run deploy:build
pm2 restart moter  # or npm run deploy:start
```

### View Logs
```bash
# PM2 logs
pm2 logs moter

# Cron logs
tail -f cron.log

# Application logs
pm2 logs moter --lines 100
```

### Test Cron Job
```bash
# Set CRON_SECRET first
export CRON_SECRET="your-secret"
npm run cron:test
```

## File Structure

```
moter/
├── scripts/
│   ├── run-cron.sh          # Cron job execution script
│   └── setup-cron.sh        # Interactive cron setup
├── app/
│   └── api/
│       ├── health/          # Health check endpoint
│       └── cron/            # Cron job endpoint
├── HOSTINGER_DEPLOYMENT.md  # Full deployment guide
└── CRON_SETUP.md            # Detailed cron setup guide
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run prisma:generate` first |
| Database connection error | Check `DATABASE_URL` in `.env` |
| Cron not working | Verify `CRON_SECRET` matches in env and cron script |
| Port already in use | Change port or kill process: `lsof -ti:3000 \| xargs kill` |
| PM2 not starting | Check logs: `pm2 logs moter` |

## Support Resources

- Full deployment guide: `HOSTINGER_DEPLOYMENT.md`
- Cron setup details: `CRON_SETUP.md`
- API documentation: `API_ENDPOINTS.md`

