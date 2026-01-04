# Database Setup Guide

## Neon Database Configuration

If you're using Neon (or any PostgreSQL database), you need to configure your connection string properly.

### Connection String Format

For **Neon databases**, your `DATABASE_URL` should look like:

```
postgresql://user:password@ep-patient-sea-ahchpq0e-pooler.c-3.us-east-1.aws.neon.tech:5432/database?sslmode=require
```

### Required Environment Variables

```bash
# Main database connection (with connection pooling)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10"

# Direct connection (for migrations, without pooling)
# For Neon, this is usually the same as DATABASE_URL but without the pooler
DATABASE_DIRECT_URL="postgresql://user:password@ep-patient-sea-ahchpq0e.c-3.us-east-1.aws.neon.tech:5432/database?sslmode=require"
```

### Neon-Specific Setup

1. **Get your connection string from Neon dashboard:**

   - Go to your Neon project
   - Click on "Connection Details"
   - Copy the connection string

2. **For connection pooling (recommended for production):**

   - Use the connection string with `-pooler` in the hostname
   - Add `?sslmode=require&connection_limit=10` to the URL

3. **For direct connections (migrations):**
   - Use the connection string without `-pooler`
   - Add `?sslmode=require` to the URL

### Example .env Configuration

```bash
# Production Database (Neon with pooling)
DATABASE_URL="postgresql://user:password@ep-patient-sea-ahchpq0e-pooler.c-3.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&connection_limit=10"

# Direct connection for migrations
DATABASE_DIRECT_URL="postgresql://user:password@ep-patient-sea-ahchpq0e.c-3.us-east-1.aws.neon.tech:5432/neondb?sslmode=require"
```

### Troubleshooting Connection Issues

#### Error: "Can't reach database server"

**Possible causes:**

1. **Firewall/Network blocking**: Your server might not have access to Neon's servers

   - Solution: Check if your Hostinger server can reach the database (test with `telnet` or `nc`)
   - Neon databases are accessible from anywhere, so this is usually not the issue

2. **SSL required**: Neon requires SSL connections

   - Solution: Make sure your connection string includes `?sslmode=require`
   - Example: `postgresql://...?sslmode=require`

3. **Wrong connection string**: The connection string might be incorrect

   - Solution: Double-check the connection string from Neon dashboard
   - Make sure username, password, host, and database name are correct

4. **Connection pooling issues**: Using the wrong connection string type
   - For application queries: Use the pooler connection string
   - For migrations: Use the direct connection string

#### Test Database Connection

Test if you can connect to your database:

```bash
# Using psql (if installed)
psql "$DATABASE_URL"

# Or using Node.js
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('Connected!'); process.exit(0); }).catch(e => { console.error('Failed:', e); process.exit(1); });"
```

#### Verify Environment Variables

Make sure your environment variables are set correctly:

```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Check if it's in your .env file
cat .env | grep DATABASE_URL
```

### Connection String Parameters

Common parameters you can add to your connection string:

- `sslmode=require` - Require SSL (required for Neon)
- `connection_limit=10` - Limit number of connections (for pooling)
- `connect_timeout=10` - Connection timeout in seconds
- `pool_timeout=10` - Pool timeout in seconds

Example with all parameters:

```
postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10&connect_timeout=10&pool_timeout=10
```

### For Other PostgreSQL Providers

If you're using a different PostgreSQL provider:

1. **Standard PostgreSQL**: Usually doesn't require SSL

   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

2. **AWS RDS**: Requires SSL

   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

3. **Heroku Postgres**: Usually includes SSL in the connection string automatically

### Running Migrations

After setting up your connection string, run migrations:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### Common Issues

1. **"prisma: command not found" during postinstall**

   - Fixed: `prisma` is now in `dependencies` instead of `devDependencies`
   - Solution: Run `npm install` again

2. **Connection timeout**

   - Check if your server can reach the database host
   - Verify firewall rules
   - Check if the database server is running

3. **SSL connection errors**
   - Make sure `?sslmode=require` is in your connection string
   - Some providers require different SSL modes (verify-full, prefer, etc.)

### Support

If you continue to have connection issues:

1. Check Neon dashboard for connection status
2. Verify your connection string format
3. Test connection from your local machine first
4. Check server logs for detailed error messages
