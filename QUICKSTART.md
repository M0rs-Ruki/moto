# 🚀 Quick Start Guide

## Project Overview

You now have a fully functional Next.js showroom visitor management system with WhatsApp integration! Here's what's included:

### ✅ What's Already Set Up

- ✅ **Database**: Neon PostgreSQL (already configured)
- ✅ **Authentication**: JWT-based login/register with theme selection
- ✅ **WhatsApp Integration**: Axiosbased API client for chati.ai
- ✅ **UI**: shadcn/ui components with theme support (light/dark/custom)
- ✅ **Project Structure**: Organized API routes, pages, and utilities
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Database Migrations**: Prisma schema synced to Neon

## 🔧 Setup Steps

### 1. Configure Your WhatsApp API Token

Edit `.env` file and add your actual WhatsApp API token:

```env
WHATSAPP_API_TOKEN="your-actual-token-from-chati-ai"
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Register Your Account

1. Click "Register" tab
2. Fill in:
   - Email & Password
   - Dealership Name (e.g., "Suzuki Motors")
   - Branch Location (e.g., "123 Main St, Downtown")
   - Choose your theme (Light/Dark/Custom with color)
3. Click "Create Account"

### 4. Configure Vehicle Categories & Models

Go to **Settings → Vehicle Models**:

1. Click "Add Category" → Create categories like:
   - Sedans
   - SUVs
   - Coupes
   - Bikes
2. Click "Add Model" → Add models under each category

### 5. Update WhatsApp Templates

Go to **Settings → WhatsApp Templates**:

For each template type (Welcome, Test Drive, Exit):

1. Get the template ID from your chati.ai dashboard
2. Get the template name (e.g., `welcome_msg`)
3. Update the fields in the settings page
4. Click Save

**Example IDs** (replace with your actual IDs):

- Welcome: `728805729727726` (template name: `welcome_msg`)
- Test Drive: `123456789` (template name: `test_drive_msg`)
- Exit: `987654321` (template name: `exit_msg`)

## 📋 Daily Workflow

### Create a New Visitor

1. Go to **Dashboard**
2. Click **"New Visitor"** button
3. Fill in:
   - First Name & Last Name
   - WhatsApp Number (format: +91XXXXXXXXXX)
   - Email & Address (optional)
   - Reason for visit
   - Select interested models
4. Click **"Create & Send Welcome"**
5. ✅ WhatsApp welcome message sent automatically

### Record a Test Drive

1. Go to **Sessions** page
2. Find the visitor's session
3. Click **"Add Test Drive"**
4. Select:
   - Vehicle model
   - Outcome (Excellent/Good/Fair/Poor)
   - Feedback notes
5. Click **"Save & Send Message"**
6. ✅ Test drive follow-up sent to WhatsApp

### Exit Session

1. On **Sessions** page, find the visitor
2. Click **"Exit Session"**
3. Add:
   - Exit feedback
   - Rating (1-5 stars)
4. Click **"Exit & Send Message"**
5. ✅ Thank you message sent to WhatsApp

## 🎨 Theme Customization

### Settings → Appearance

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Dark background, light text
- **Custom Mode**: Choose your own accent color
  - Click color picker to select
  - Color applies to buttons, links, and accents
  - Settings save automatically

## 📁 Project File Structure

```
moter/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/              # Login, register, logout, profile
│   │   ├── categories/        # Vehicle categories CRUD
│   │   ├── models/            # Vehicle models CRUD
│   │   ├── sessions/          # Session management
│   │   ├── templates/         # WhatsApp template config
│   │   ├── test-drives/       # Test drive recording
│   │   └── visitors/          # Visitor records
│   ├── dashboard/             # Main dashboard pages
│   │   ├── page.tsx           # Visitor management
│   │   ├── sessions/          # Session tracking
│   │   └── settings/          # Settings & config
│   ├── login/                 # Login/register UI
│   └── layout.tsx             # Root layout
├── lib/
│   ├── auth.ts                # JWT & auth utilities
│   ├── db.ts                  # Prisma client
│   ├── whatsapp.ts            # WhatsApp API client
│   └── theme-provider.tsx     # Theme context
├── components/
│   ├── ui/                    # shadcn UI components
│   └── theme-switcher.tsx     # Theme toggle
├── prisma/
│   └── schema.prisma          # Database schema
└── middleware.ts              # Route protection
```

## 🔑 Key Features Implemented

✅ **JWT Authentication**

- Secure login/register
- Token stored in HTTP-only cookies
- Protected API routes
- Automatic redirects

✅ **WhatsApp Integration**

- Create contacts via API
- Send template messages
- Three message types: welcome, test drive, exit
- Automatic sending on actions

✅ **Theme System**

- Light/Dark/Custom modes
- CSS variables for global styling
- Per-user theme preferences
- Persistent across sessions

✅ **Visitor Management**

- Create visitor records
- Track multiple models of interest
- Record sessions and test drives
- Exit feedback collection

✅ **Settings Management**

- Add/manage vehicle categories
- Add/manage vehicle models
- Configure WhatsApp templates
- Theme customization

## 🐛 Troubleshooting

### WhatsApp Messages Not Sending?

1. Verify API token in `.env`
2. Check WhatsApp number format: +CountryCodeNumber
3. Verify template ID and name in Settings
4. Check browser console for errors

### Database Connection Issues?

1. Verify DATABASE_URL in `.env`
2. Ensure Neon database is active
3. Check that migrations ran: `npx prisma db push`

### Build Errors?

```bash
npm run build
```

If errors persist, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Forgotten Password?

Database has reset option:

```bash
npx prisma db push --force-reset
```

⚠️ **WARNING**: This deletes all data. Only use in development!

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Visitors

- `POST /api/visitors` - Create visitor & send welcome
- `GET /api/visitors` - List all visitors

### Sessions

- `GET /api/sessions` - List all sessions
- `POST /api/sessions/exit` - Exit session & send thank you

### Test Drives

- `POST /api/test-drives` - Create test drive & send follow-up
- `GET /api/test-drives` - List all test drives

### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

### Models

- `POST /api/models` - Create vehicle model

### Templates

- `GET /api/templates` - List templates
- `PUT /api/templates` - Update template

## 🚢 Deployment

### Deploy to Vercel

```bash
git push origin main
```

Then in Vercel:

1. Import project
2. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `WHATSAPP_API_TOKEN`
3. Deploy!

## 📞 Support

For questions or issues:

1. Check the README.md for more details
2. Review API route files for implementation details
3. Check browser console for error messages
4. Verify environment variables are set

## ✨ Next Steps

1. ✅ Register account
2. ✅ Add vehicle categories/models
3. ✅ Configure WhatsApp templates
4. ✅ Create first visitor
5. ✅ Test WhatsApp message sending
6. ✅ Record test drives
7. ✅ Exit sessions
8. 🚀 Deploy to production!

---

**Happy managing! 🎉**
