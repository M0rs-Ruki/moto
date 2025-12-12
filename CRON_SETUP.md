# Cron Job Setup for Scheduled Messages

This application uses scheduled messages for delivery reminders. The cron job processes pending messages that are due to be sent.

## Vercel Deployment

If deploying to Vercel, the cron job is automatically configured via `vercel.json`. The job runs every hour (at the top of each hour).

### Environment Variables

Make sure to set the `CRON_SECRET` environment variable in your Vercel project settings for security:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `CRON_SECRET` with a secure random string
4. The cron endpoint will require this secret in the Authorization header

## External Cron Service Setup

If you're not using Vercel, you can set up an external cron service:

### Option 1: cron-job.org

1. Sign up at https://cron-job.org
2. Create a new cron job with these settings:
   - **URL**: `https://your-domain.com/api/cron/send-scheduled-messages`
   - **Schedule**: Every hour (`0 * * * *`)
   - **Method**: GET
   - **Headers**: Add `Authorization: Bearer YOUR_CRON_SECRET`
3. Save and activate the cron job

### Option 2: EasyCron

1. Sign up at https://www.easycron.com
2. Create a new cron job:
   - **URL**: `https://your-domain.com/api/cron/send-scheduled-messages`
   - **Schedule**: Hourly
   - **HTTP Method**: GET
   - **HTTP Headers**: `Authorization: Bearer YOUR_CRON_SECRET`
3. Save and enable the job

### Option 3: Custom Server/Node.js

If you have a custom server, you can use node-cron:

```javascript
const cron = require('node-cron');
const https = require('https');

cron.schedule('0 * * * *', () => {
  const options = {
    hostname: 'your-domain.com',
    path: '/api/cron/send-scheduled-messages',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Cron job executed: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error('Cron job error:', error);
  });

  req.end();
});
```

## Testing

You can manually trigger the cron job for testing:

```bash
curl -X GET https://your-domain.com/api/cron/send-scheduled-messages \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## How It Works

1. When a delivery ticket is created, a `ScheduledMessage` is created with `scheduledFor` set to 3 days before the delivery date
2. The cron job runs every hour and finds all pending messages where `scheduledFor <= now()`
3. Messages are processed in batches of 100
4. Failed messages are retried up to 3 times
5. After 3 failed attempts, messages are marked as `failed`

## Monitoring

Check the cron job logs in your hosting provider's dashboard to monitor:
- Number of messages processed
- Success/failure rates
- Any errors

