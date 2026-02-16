# Student Registration Agency Platform

A comprehensive full-stack web application for education agencies to manage student applications. Built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS.

## 🚀 Features

### For Students
- **Multi-step Registration**: 7-step application form with email verification
- **Document Upload**: Secure file uploads to Cloudinary
- **Real-time Status Tracking**: Live updates on application status
- **Dashboard**: View application details, documents, and messages
- **Messaging**: Direct communication with admin

### For Admin (Nadir)
- **Complete Website Control**: Customize everything through UI (no code needed)
  - Homepage editor with drag-drop sections
  - Blog CMS with rich text editor
  - Page builder for custom pages
  - Navigation menu editor
  - Design customization (colors, fonts, logo)
  - Email template editor
- **Applicant Management**: View, filter, and manage all applications
- **Status Updates**: Update application status with email notifications
- **Analytics Dashboard**: Charts and insights
- **Media Library**: Organize and manage all uploaded files

### Public Features
- **Dynamic Homepage**: Fully customizable by admin
- **Blog System**: Categories, tags, search, and SEO
- **Custom Pages**: Create any page with drag-drop builder
- **Responsive Design**: Works on all devices

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Supabase** account ([supabase.com](https://supabase.com))
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com))
- **Resend** account for emails ([resend.com](https://resend.com))

## 🛠️ Installation

### 1. Clone and Install Dependencies

\`\`\`bash
cd g:\\university\\projects\\agency\\agency-page
pnpm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:
   \`\`\`bash
   # Copy the contents of supabase/schema.sql and paste into SQL Editor
   \`\`\`
3. Get your API keys from **Project Settings > API**

### 3. Set Up Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings > Upload**
3. Create an **unsigned upload preset**:
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Set folder to "agency"
   - Save the preset name
4. Get your cloud name from the dashboard

### 4. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create an API key

### 5. Configure Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your actual values:

\`\`\`env
# Site Configuration
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name

# Resend (Email Service)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Initial Admin Account
INITIAL_ADMIN_EMAIL=nadir@agency.com
INITIAL_ADMIN_PASSWORD=ChangeThisPassword123!
\`\`\`

### 6. Create Initial Admin Account

Run this SQL in Supabase SQL Editor to create your admin account:

\`\`\`sql
-- First, you'll need to hash the password using bcrypt
-- For now, use Supabase Auth to create the admin:

INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('nadir@agency.com', crypt('YourPassword123!', gen_salt('bf')), NOW());

-- Then create the user record:
INSERT INTO users (id, email, role, email_verified)
SELECT id, email, 'admin', true
FROM auth.users
WHERE email = 'nadir@agency.com';
\`\`\`

## 🚀 Running the Application

### Development Mode (with Turbopack)

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 📁 Project Structure

\`\`\`
agency-page/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public routes (homepage, blog)
│   ├── dashboard/           # Student dashboard
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header, Footer
│   ├── forms/               # Registration forms
│   ├── admin/               # Admin components
│   └── student/             # Student components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── cloudinary/          # File upload helpers
│   ├── email/               # Email service
│   ├── validations/         # Zod schemas
│   └── utils.ts             # Utility functions
├── supabase/
│   └── schema.sql           # Database schema
├── .env.example             # Environment template
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── package.json             # Dependencies
\`\`\`

## 🔐 Authentication Flow

1. **Student Registration**:
   - Email verification with 6-digit OTP
   - Multi-step form (7 steps)
   - Auto-generated password
   - Email confirmation with credentials

2. **Login**:
   - Email + password
   - Role-based redirect (student → dashboard, admin → admin panel)

3. **Route Protection**:
   - Middleware checks authentication
   - `/dashboard/*` requires student role
   - `/admin/*` requires admin role

## 📊 Database Schema

The database includes:
- **users**: Authentication and roles
- **applicants**: Student application data
- **status_history**: Status change logs
- **messages**: Student-admin communication
- **blog_posts**: Blog content
- **site_settings**: Customizable site config (JSONB)
- **media_library**: File management
- **custom_pages**: Page builder content
- **testimonials**: Student testimonials
- **partner_universities**: Partner logos
- **email_templates**: Customizable emails

See `supabase/schema.sql` for complete schema with RLS policies.

## 🎨 Customization

### Admin Can Customize:
- ✅ Homepage (all sections, text, images)
- ✅ Navigation menu
- ✅ Colors, fonts, logo
- ✅ Blog posts and categories
- ✅ Custom pages (drag-drop builder)
- ✅ Email templates
- ✅ Testimonials
- ✅ Partner university logos
- ✅ Footer content

All customization is done through the admin dashboard UI - **no code editing required**.

## 📧 Email Templates

Default email templates included:
- Email verification (OTP)
- Registration confirmation
- Status update notifications
- Welcome email

All templates are customizable through the admin panel.

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all variables from `.env.local` to your Vercel project settings.

## 🔧 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.7.3
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI (shadcn/ui)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Cloudinary
- **Email**: Resend
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📝 Development Notes

- **Turbopack**: Enabled for faster development (`pnpm dev`)
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js
- **Dark Mode**: Supported via next-themes

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:
1. Delete `.next` folder: `rm -rf .next`
2. Clear pnpm cache: `pnpm store prune`
3. Reinstall: `pnpm install`
4. Rebuild: `pnpm build`

### Supabase Connection Issues

- Check your environment variables
- Verify RLS policies are enabled
- Check Supabase project status

### Cloudinary Upload Fails

- Verify upload preset is "unsigned"
- Check cloud name is correct
- Ensure folder permissions are set

## 📄 License

Private project for Nadir's Education Agency.

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Nadir's Education Agency**