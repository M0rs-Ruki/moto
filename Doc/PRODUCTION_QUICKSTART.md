# Production Deployment Quick Start

## 🚀 Quick Start Guide

### 1. Build the Application

```bash
cd /home/mors/Code/moter/backend
pnpm install
pnpm run build
```

### 2. Configure Environment Variables

Copy and edit the production environment file:

```bash
cp .env .env.backup  # Backup existing .env
nano .env
```

**Critical Production Settings:**

```bash
# CHANGE THESE FOR PRODUCTION!
NODE_ENV=production
JWT_SECRET=<generate-strong-32-char-secret>
CRON_SECRET=<generate-strong-20-char-secret>
CORS_ORIGIN=https://your-production-domain.com

# Database
DATABASE_URL=postgresql://user:password@your-db-host:5432/moter_production

# RabbitMQ
RABBITMQ_URL=amqp://user:password@your-rabbitmq-host:5672

# WhatsApp API (your credentials)
WHATSAPP_API_TOKEN=your-production-token
WHATSAPP_API_SECRET_KEY=your-production-secret
WHATSAPP_API_ACCESS_KEY=your-production-access-key
```

### 3. Generate Strong Secrets

```bash
# Generate JWT_SECRET (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET (20 characters)
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```

### 4. Run Database Migrations

```bash
pnpm run prisma:generate
pnpm run prisma:dbpush
```

### 5. Start the Server

```bash
NODE_ENV=production pnpm start
```

## 🔍 Verify Production Setup

### Check Health Endpoints

```bash
# Simple health check
curl http://localhost:8000/health
# Expected: {"status":"ok","timestamp":"..."}

# Detailed health check (includes DB and RabbitMQ status)
curl http://localhost:8000/health/detailed
# Expected: {"status":"healthy",...}

# Readiness check
curl http://localhost:8000/health/ready
# Expected: {"status":"ready",...}
```

### Check Logs

The server will output structured JSON logs in production:

```bash
# You should see startup logs like:
# {"level":"INFO","message":"🚀 Server starting...","timestamp":"..."}
# {"level":"INFO","message":"✅ Database connected successfully","timestamp":"..."}
# {"level":"INFO","message":"✅ RabbitMQ connected","timestamp":"..."}
# {"level":"INFO","message":"✅ Monitoring started","timestamp":"..."}
# {"level":"INFO","message":"🎉 Server is ready to accept connections","timestamp":"..."}
```

### Test API Endpoints

```bash
# Test a protected endpoint (should return 401 if not authenticated)
curl http://localhost:8000/api/visitors

# Test rate limiting (make many requests quickly)
for i in {1..110}; do curl -s http://localhost:8000/health -o /dev/null -w "%{http_code}\n"; done
# Should see 429 (Too Many Requests) after hitting the limit
```

## 🐳 Docker Deployment (Alternative)

If you want to use Docker (not required, but optional):

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f backend

# Stop
docker-compose down
```

## 📊 Monitoring in Production

### Real-time Logs

```bash
# Follow logs in real-time
pnpm start 2>&1 | tee -a production.log

# Or use a process manager (see PM2 section below)
```

### Health Monitoring

Set up automated health checks:

```bash
# Add to crontab for monitoring
*/5 * * * * curl -f http://localhost:8000/health || echo "Server health check failed!" | mail -s "Alert" admin@yourdomain.com
```

## 🔄 Process Management with PM2 (Recommended)

Install PM2 globally:

```bash
npm install -g pm2
```

Create PM2 ecosystem file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'moter-backend',
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000,
    wait_ready: true
  }]
};
```

Start with PM2:

```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs moter-backend

# Restart
pm2 restart moter-backend

# Stop
pm2 stop moter-backend

# Auto-start on server reboot
pm2 startup
pm2 save
```

## 🔒 Security Checklist

Before going live:

- [ ] Strong JWT_SECRET (min 32 chars, random)
- [ ] Strong CRON_SECRET (min 20 chars, random)
- [ ] CORS_ORIGIN set to production domain only
- [ ] NODE_ENV=production
- [ ] Database credentials are secure
- [ ] RabbitMQ has strong password
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] Only necessary ports exposed
- [ ] Rate limiting configured appropriately

## 🚨 Troubleshooting

### Server Won't Start

```bash
# Check configuration validation
NODE_ENV=production node -e "require('./dist/config/validator.js').configValidator.validateAndLog()"

# Check database connection
NODE_ENV=production node -e "require('./dist/lib/db.js').default.\$queryRaw\`SELECT 1\`.then(() => console.log('DB OK')).catch(e => console.error('DB Error:', e))"
```

### High Memory Usage

The memory monitor will automatically log warnings. Check logs for:
```
{"level":"WARN","message":"High memory usage detected",...}
```

### Slow Requests

Performance monitor logs slow requests automatically:
```
{"level":"WARN","message":"Slow request detected","context":{"path":"/api/...","duration":"2500ms"}}
```

## 📈 Performance Tuning

### Database Connection Pool

Edit `src/lib/db.ts` to adjust Prisma connection pool:

```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DB_URL,
    },
  },
  // Add these for production tuning:
  pool: {
    timeout: 30,
    max: 10,
  },
});
```

### Rate Limiting

Adjust in `.env`:

```bash
# Allow more requests for higher traffic
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=200  # 200 requests per window
```

## 🔄 Updates and Maintenance

### Deploying Updates

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
pnpm install

# 3. Run migrations
pnpm run prisma:generate
pnpm run prisma:dbpush

# 4. Build
pnpm run build

# 5. Restart (if using PM2)
pm2 restart moter-backend

# 6. Verify health
curl http://localhost:8000/health/detailed
```

### Database Backups

```bash
# Create backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$TIMESTAMP.sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

## 📞 Support

For issues or questions:
1. Check logs: `pm2 logs moter-backend` or `tail -f production.log`
2. Verify health: `curl http://localhost:8000/health/detailed`
3. Check configuration: Review `.env` file
4. See `PRODUCTION_FEATURES.md` for detailed documentation

## 🎉 Success!

Your backend is now production-ready with:
- ✅ Structured logging
- ✅ Rate limiting
- ✅ Security headers
- ✅ Error handling
- ✅ Health checks
- ✅ Graceful shutdown
- ✅ Performance monitoring
- ✅ Memory monitoring
- ✅ Configuration validation

Monitor your logs and health endpoints regularly!
