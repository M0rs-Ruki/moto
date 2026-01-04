# Hostinger Cloud Startup Deployment Guide

This guide will help you deploy your Next.js application to Hostinger Cloud Startup.

## Prerequisites

Before deploying, ensure you have:
- ✅ Hostinger Cloud Startup account with SSH access
- ✅ Node.js 20+ installed on your server
- ✅ PostgreSQL/MySQL database (configured in Prisma)
- ✅ Domain name configured (optional but recommended)
- ✅ Environment variables ready

## Step 1: Prepare Your Application

### Build Scripts Explained

The `package.json` includes these production scripts:

- **`npm run deploy:build`** - Generates Prisma client and builds Next.js for production
- **`npm run deploy:start`** - Runs database migrations and starts the production server
- **`npm run prisma:migrate`** - Applies database migrations (safe for production)
- **`npm run prisma:generate`** - Generates Prisma Client
- **`npm run health`** - Checks if the application is running (health check)
- **`npm run cron:test`** - Tests the cron job endpoint locally

## Step 2: Environment Variables

Set these environment variables in your Hostinger control panel or `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Next.js
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Authentication (if using JWT)
JWT_SECRET="your-secret-key-here"

# Cron Job Security
CRON_SECRET="your-secure-random-string-here"

# WhatsApp API (if applicable)
WHATSAPP_API_URL="your-whatsapp-api-url"
WHATSAPP_API_KEY="your-api-key"
```

## Step 3: Deploy to Hostinger

### Option A: Using Git (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **SSH into your Hostinger server:**
   ```bash
   ssh your-username@your-server-ip
   ```

3. **Clone your repository:**
   ```bash
   cd /home/your-username
   git clone https://github.com/your-username/moter.git
   cd moter
   ```

4. **Install dependencies:**
   ```bash
   npm install --production
   ```

5. **Set up environment variables:**
   ```bash
   nano .env
   # Add all your environment variables here
   ```

6. **Build and start:**
   ```bash
   npm run deploy:build
   npm run deploy:start
   ```

### Option B: Using File Manager + SSH

1. Upload your project files via Hostinger File Manager
2. SSH into your server
3. Navigate to your project directory
4. Run the same commands as Option A (steps 4-6)

## Step 4: Set Up Process Manager (PM2)

PM2 keeps your application running and restarts it if it crashes:

```bash
# Install PM2 globally
npm install -g pm2

# Start your application with PM2
pm2 start npm --name "moter" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on server reboot
pm2 startup
```

## Step 5: Configure Cron Jobs

### For Hostinger Cloud Startup

You need to set up a cron job that calls your API endpoint every hour.

1. **SSH into your server**

2. **Open the crontab editor:**
   ```bash
   crontab -e
   ```

3. **Add this line** (runs every hour):
   ```bash
   0 * * * * curl -X GET https://your-domain.com/api/cron/send-scheduled-messages -H "Authorization: Bearer YOUR_CRON_SECRET" >> /home/your-username/moter/cron.log 2>&1
   ```

   Or use the provided script:
   ```bash
   0 * * * * /home/your-username/moter/scripts/run-cron.sh >> /home/your-username/moter/cron.log 2>&1
   ```

4. **Save and exit** (Ctrl+X, then Y, then Enter)

5. **Verify cron job is set:**
   ```bash
   crontab -l
   ```

### Alternative: Using External Cron Service

If you prefer not to use server cron, you can use:
- **cron-job.org** (free tier available)
- **EasyCron** (paid service)
- **UptimeRobot** (free monitoring + cron)

See `CRON_SETUP.md` for detailed instructions.

## Step 6: Configure Reverse Proxy (Nginx)

If you're using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then restart Nginx:
```bash
sudo systemctl restart nginx
```

## Step 7: SSL Certificate (HTTPS)

Hostinger usually provides SSL certificates. If you need to set it up manually:

1. Use Let's Encrypt with Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. Or configure SSL in Hostinger control panel

## Step 8: Monitoring & Maintenance

### Health Check

Test if your application is running:
```bash
npm run health
```

Or manually:
```bash
curl http://localhost:3000/api/health
```

### View Logs

**PM2 logs:**
```bash
pm2 logs moter
```

**Cron job logs:**
```bash
tail -f /home/your-username/moter/cron.log
```

**Application logs:**
Check your Next.js logs in PM2 or system logs

### Update Application

When you need to update:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install --production

# Run migrations
npm run prisma:migrate

# Rebuild
npm run deploy:build

# Restart with PM2
pm2 restart moter
```

## Troubleshooting

### Application won't start
- Check if port 3000 is available: `netstat -tulpn | grep 3000`
- Verify environment variables are set correctly
- Check PM2 logs: `pm2 logs moter`

### Database connection issues
- Verify `DATABASE_URL` is correct
- Check if database server is running
- Ensure database user has proper permissions

### Cron job not working
- Verify cron is running: `systemctl status cron`
- Check cron logs: `tail -f /var/log/syslog | grep CRON`
- Test cron endpoint manually: `npm run cron:test`
- Verify `CRON_SECRET` matches in environment and cron command

### Build errors
- Ensure Node.js version is 20+: `node --version`
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong `CRON_SECRET` and `JWT_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (only allow necessary ports)
- [ ] Keep dependencies updated: `npm audit`
- [ ] Set proper file permissions
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting (if applicable)

## Support

For Hostinger-specific issues, contact Hostinger support.
For application issues, check the logs and error messages.

