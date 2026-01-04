# Debug 500 Error on Login

## Step 1: Check Server Logs (Most Important!)

The error details are now logged to your server console. Check your logs:

```bash
# If using PM2
pm2 logs moter --lines 100

# Or check application output
# Look for lines starting with "=== LOGIN ERROR ==="
```

The logs will show:
- Error name
- Error message  
- Error stack trace
- Full error object

## Step 2: Test Diagnostic Endpoints

### Test Database Connection
Visit in browser:
```
https://app.utkalautomobiles.co.in/api/debug/db-test
```

This will tell you:
- ✅ If DATABASE_URL is configured
- ✅ If database connection works
- ✅ If queries work
- ✅ Exact error message if it fails

### Test Health Check
Visit in browser:
```
https://app.utkalautomobiles.co.in/api/health
```

This will show if the database is accessible.

## Step 3: Check Error Response

Now when you get a 500 error, the response will include:
- `errorType` - Type of error (DATABASE_CONNECTION, DATABASE_ERROR, AUTH_ERROR, etc.)
- `message` - Partial error message for debugging

Example response:
```json
{
  "error": "Database connection failed",
  "errorType": "DATABASE_CONNECTION",
  "message": "Unable to connect to database server..."
}
```

## Common Error Types & Solutions

### DATABASE_CONNECTION
**Problem:** Can't reach database server

**Solutions:**
1. Check if DATABASE_URL includes SSL: `?sslmode=require`
2. Verify database server is accessible from your server
3. Check firewall/network settings
4. Test connection: `telnet your-db-host 5432`

### DATABASE_ERROR
**Problem:** Database query failed

**Solutions:**
1. Check if database tables exist
2. Verify migrations ran: `npm run prisma:migrate`
3. Check database permissions
4. Look at full error message in logs

### AUTH_ERROR
**Problem:** Token/cookie generation failed

**Solutions:**
1. Check if JWT_SECRET is set
2. Verify cookie settings work in production
3. Check if secure cookies are required (HTTPS)

### UNKNOWN_ERROR
**Problem:** Unexpected error

**Solutions:**
1. Check server logs for full error details
2. Verify all environment variables are set
3. Check if all dependencies are installed

## Quick Fixes

### Fix 1: Update DATABASE_URL
Make sure it includes SSL:
```bash
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10"
```

### Fix 2: Check Environment Variables
Verify these are set in production:
- `DATABASE_URL` (with SSL)
- `JWT_SECRET`
- `NODE_ENV=production`

### Fix 3: Check Server Logs
```bash
pm2 logs moter --err --lines 50
```

Look for:
- "=== LOGIN ERROR ==="
- Database connection errors
- Token generation errors
- Cookie setting errors

## Next Steps

1. **Check server logs** - This will show the exact error
2. **Test `/api/debug/db-test`** - Verify database connection
3. **Check error response** - Look for `errorType` in the 500 response
4. **Share the error details** - The logs will show exactly what's failing

The improved error handling will now give you much more information about what's going wrong!

