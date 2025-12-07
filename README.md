# Showroom Visitor Management System

A comprehensive Next.js application for managing car and bike showroom visitors with automated WhatsApp messaging integration.

## Features

- 🔐 **JWT Authentication** - Secure login/register with JWT tokens
- 👥 **Visitor Management** - Create and track visitor records
- 💬 **WhatsApp Integration** - Automated messages for welcome, test drives, and exits
- 🚗 **Vehicle Management** - Organize vehicles by categories and models
- 📊 **Session Tracking** - Monitor visitor sessions and test drives
- 🎨 **Theme Customization** - Light, dark, and custom accent color themes
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Authentication**: JWT with jose
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database (already configured)
- WhatsApp API credentials from chati.ai

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Edit `.env` and add your WhatsApp API token:

```env
WHATSAPP_API_TOKEN="your-actual-bearer-token-from-chati-ai"
```

The database and JWT secret are already configured.

3. Set up the database:

```bash
# Push the schema to your Neon database
npx prisma db push

# Generate Prisma Client (already done, but run if needed)
npx prisma generate
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup

1. **Register an Account**:

   - Visit the login page
   - Click on the "Register" tab
   - Fill in your email, password, dealership name, branch location
   - Choose your preferred theme (light/dark/custom)
   - Click "Create Account"

2. **Configure WhatsApp Templates**:

   - Navigate to Settings → WhatsApp Templates
   - Update the template IDs and names for:
     - Welcome Message (sent when visitor is created)
     - Test Drive Follow-up (sent after test drive)
     - Exit Thank You (sent when session ends)

3. **Add Vehicle Categories and Models**:
   - Go to Settings → Vehicle Models
   - Click "Add Category" to create categories (e.g., SUV, Sedan, Coupe)
   - Click "Add Model" to add specific models under categories

### Daily Workflow

#### 1. Create a New Visitor

- Click "New Visitor" on the dashboard
- Fill in visitor details:
  - First Name, Last Name (required)
  - WhatsApp Number (required, format: +1234567890)
  - Email, Address (optional)
  - Reason for Visit (required)
  - Select interested vehicle models
- Click "Create & Send Welcome"
- System will:
  1. Create a contact in WhatsApp
  2. Store visitor in database
  3. Send welcome WhatsApp message

#### 2. Record Test Drive

- Navigate to "Sessions" page
- Find the visitor's active session
- Click "Add Test Drive"
- Select the vehicle model
- Choose outcome (Excellent/Good/Fair/Poor)
- Add feedback notes
- Click "Save & Send Message"
- System sends test drive follow-up WhatsApp message

#### 3. Exit Session

- On the "Sessions" page, find the visitor
- Click "Exit Session"
- Add exit feedback and rating (1-5 stars)
- Click "Exit & Send Message"
- System sends thank you WhatsApp message

## Project Structure

```
moter/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── categories/        # Vehicle categories
│   │   ├── models/            # Vehicle models
│   │   ├── sessions/          # Visitor sessions
│   │   ├── templates/         # WhatsApp templates
│   │   ├── test-drives/       # Test drive records
│   │   └── visitors/          # Visitor management
│   ├── dashboard/             # Dashboard pages
│   │   ├── page.tsx           # Visitor management
│   │   ├── sessions/          # Session tracking
│   │   └── settings/          # Settings page
│   ├── login/                 # Login/register page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── theme-switcher.tsx     # Theme toggle component
├── lib/
│   ├── auth.ts                # JWT authentication utilities
│   ├── db.ts                  # Prisma client
│   ├── theme-provider.tsx     # Theme context provider
│   ├── utils.ts               # Utility functions
│   └── whatsapp.ts            # WhatsApp API client
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── prisma.config.ts       # Prisma configuration
├── middleware.ts              # Route protection middleware
└── .env                       # Environment variables
```

## Database Schema

### Core Models

- **User**: Authentication and user preferences
- **Dealership**: Company/branch information
- **VehicleCategory**: Vehicle categories (SUV, Sedan, etc.)
- **VehicleModel**: Specific vehicle models
- **Visitor**: Customer contact information
- **VisitorSession**: Visit tracking with status (intake/test_drive/exited)
- **VisitorInterest**: Links visitors to interested models
- **TestDrive**: Test drive records with feedback
- **WhatsAppTemplate**: Template configurations for messages

## WhatsApp Integration

The system integrates with chati.ai WhatsApp API:

1. **Contact Creation** (`POST /contact`):

   - Creates a new contact before sending messages
   - Stores contact ID for future reference

2. **Template Messages** (`POST /send-template/`):
   - Sends predefined template messages
   - Three types: welcome, test_drive, exit
   - Parameters can be customized per message

### Template Configuration

Templates should be created in your chati.ai dashboard first, then configured in the app settings with:

- **Template ID**: Numeric ID from chati.ai
- **Template Name**: API name (e.g., `welcome_msg`)
- **Language**: Default is `en_US`

## Customization

### Theme Customization

The app supports three theme modes:

1. **Light Mode**: Clean, bright interface
2. **Dark Mode**: Dark background with light text
3. **Custom Mode**: Choose your own accent color

Theme settings are saved per-user and persist across sessions.

### Adding Custom Fields

To add custom fields to the visitor form:

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update the form in `app/dashboard/page.tsx`
4. Update the API endpoint in `app/api/visitors/route.ts`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Security Notes

- ⚠️ Change `JWT_SECRET` in production
- ⚠️ Keep WhatsApp API token secure
- ⚠️ Enable HTTPS in production
- ⚠️ Review CORS settings for production

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

### WhatsApp API Errors

- Verify your API token is correct
- Check contact number format (+CountryCode+Number)
- Ensure templates exist in chati.ai dashboard
- Review API logs in browser console

### Authentication Issues

- Clear browser cookies
- Check JWT_SECRET is set
- Verify database connection

## License

This project is private and proprietary.
