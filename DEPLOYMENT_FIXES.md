# Deployment Fixes Applied

## Issues Fixed

### 1. ✅ Prisma Command Not Found During postinstall

**Problem:** When `NODE_ENV=production`, npm installs with `--production` flag which skips `devDependencies`. Since `prisma` was in `devDependencies`, it wasn't available during `postinstall`.

**Solution:**
- Moved `prisma` and `@prisma/client` from `devDependencies` to `dependencies`
- Updated `postinstall` script to handle failures gracefully
- Now Prisma will be available even in production builds

**Files Changed:**
- `package.json` - Moved Prisma packages to dependencies

### 2. ✅ Database Connection Issues

**Problem:** Application can't connect to Neon database server.

**Possible Causes:**
1. Missing SSL configuration (Neon requires SSL)
2. Incorrect connection string format
3. Network/firewall blocking
4. Connection pooling issues

**Solutions Applied:**
- Updated database connection with better error handling
- Added connection testing on startup
- Created `DATABASE_SETUP.md` with detailed Neon configuration guide

**Files Changed:**
- `lib/db.ts` - Improved error handling and connection management
- `DATABASE_SETUP.md` - Complete database setup guide

## Next Steps for Deployment

### 1. Update Your .env File

Make sure your `DATABASE_URL` includes SSL parameters for Neon:

```bash
# For Neon, add ?sslmode=require to your connection string
DATABASE_URL="postgresql://user:password@ep-patient-sea-ahchpq0e-pooler.c-3.us-east-1.aws.neon.tech:5432/database?sslmode=require&connection_limit=10"
```

**Important:** Your connection string should look like this:
- Include `?sslmode=require` for SSL (required by Neon)
- Use the pooler connection string (with `-pooler` in hostname) for application queries
- Add `&connection_limit=10` to limit connections

### 2. Reinstall Dependencies

Since we moved Prisma to dependencies, you need to reinstall:

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall (this will now include Prisma in production)
npm install
```

### 3. Test Database Connection

Test if your database connection works:

```bash
# Generate Prisma Client
npm run prisma:generate

# Test connection (this will show errors if connection fails)
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('✅ Database connected!'); process.exit(0); }).catch(e => { console.error('❌ Connection failed:', e.message); process.exit(1); });"
```

### 4. Run Migrations

After confirming the connection works:

```bash
npm run prisma:migrate
```

### 5. Build and Deploy

```bash
# Build for production
npm run deploy:build

# Start the application
npm run deploy:start
```

## Environment Variables Checklist

Make sure these are set in your Hostinger environment:

```bash
# Database (REQUIRED - with SSL for Neon)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://app.utkalautomobiles.co.in"
PORT="3000"  # Or let Hostinger set this automatically

# Security
CRON_SECRET="your-secure-random-string"
JWT_SECRET="your-jwt-secret-key"

# WhatsApp API (if applicable)
WHATSAPP_API_URL="your-api-url"
WHATSAPP_API_KEY="your-api-key"
```

## Troubleshooting

### If Prisma Still Not Found

1. Check if Prisma is in dependencies:
   ```bash
   npm list prisma
   ```

2. If not, manually install:
   ```bash
   npm install prisma @prisma/client
   ```

### If Database Still Can't Connect

1. **Verify connection string format:**
   - Must include `?sslmode=require` for Neon
   - Check username, password, host, and database name
   - Test the connection string from Neon dashboard

2. **Test network connectivity:**
   ```bash
   # Test if you can reach the database server
   telnet ep-patient-sea-ahchpq0e-pooler.c-3.us-east-1.aws.neon.tech 5432
   ```

3. **Check Neon dashboard:**
   - Verify your database is running
   - Check if there are any connection limits or restrictions
   - Verify your IP is not blocked

4. **Check server logs:**
   ```bash
   # View application logs
   pm2 logs moter
   
   # Or if not using PM2
   npm run start
   ```

### Common Error Messages

**"Can't reach database server"**
- Solution: Check connection string, SSL settings, and network connectivity

**"prisma: command not found"**
- Solution: Run `npm install` again (Prisma is now in dependencies)

**"Invalid connection string"**
- Solution: Verify your DATABASE_URL format and SSL parameters

## Files Modified

1. `package.json` - Moved Prisma to dependencies, updated scripts
2. `lib/db.ts` - Improved error handling and connection management
3. `DATABASE_SETUP.md` - New guide for database configuration
4. `DEPLOYMENT_FIXES.md` - This file

## Additional Resources

- `DATABASE_SETUP.md` - Detailed database configuration guide
- `HOSTINGER_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_QUICK_REFERENCE.md` - Quick command reference

## Testing Checklist

Before deploying to production:

- [ ] Prisma generates successfully (`npm run prisma:generate`)
- [ ] Database connection works (test with the command above)
- [ ] Migrations run successfully (`npm run prisma:migrate`)
- [ ] Application builds without errors (`npm run deploy:build`)
- [ ] Application starts successfully (`npm run deploy:start`)
- [ ] Health check endpoint works (`curl http://localhost:3000/api/health`)
- [ ] Login endpoint works (test with Postman or curl)

