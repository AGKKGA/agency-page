# Supabase Database Setup Guide

## Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project: https://supabase.com/dashboard/project/qypkqtzymftsvgiwvtvz
2. Click on **Settings** (gear icon in sidebar)
3. Click on **API** in the settings menu
4. Copy the **anon/public** key (it starts with `eyJ...`)
5. Update the `.env.local` file with this key in the `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file: `g:\university\projects\agency\agency-page\supabase\schema.sql`
4. Copy ALL the contents of that file
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

**Expected Result:** You should see a success message. This will create:
- 15 tables (users, applicants, status_history, messages, blog_posts, etc.)
- All RLS policies
- Functions and triggers
- Indexes for performance
- Seed data (blog categories, email templates, default site settings)

## Step 3: Verify the Setup

After running the schema, verify it worked:

1. Click on **Table Editor** in the left sidebar
2. You should see all these tables:
   - users
   - applicants
   - status_history
   - messages
   - blog_posts
   - blog_categories
   - site_settings
   - media_library
   - custom_pages
   - testimonials
   - partner_universities
   - email_templates
   - otp_codes

3. Click on `blog_categories` - you should see 4 default categories
4. Click on `email_templates` - you should see 3 default templates
5. Click on `site_settings` - you should see 3 default settings

## Step 4: Create Cloudinary Upload Preset

Since you haven't created an unsigned upload preset yet:

1. Go to https://cloudinary.com/console
2. Click on **Settings** (gear icon)
3. Click on **Upload** tab
4. Scroll down to **Upload presets**
5. Click **Add upload preset**
6. Set these values:
   - **Preset name**: `agency_unsigned`
   - **Signing mode**: **Unsigned**
   - **Folder**: `agency`
   - **Unique filename**: Check this box
7. Click **Save**

Then update `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=agency_unsigned
```

## Step 5: Create Initial Admin Account

After the schema is set up, you need to create your admin account. Run this SQL in Supabase SQL Editor:

```sql
-- Create admin user in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'nadir@agency.com',
  crypt('ChangeThisPassword123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"role":"admin"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Create corresponding user in public.users table
INSERT INTO public.users (id, email, password_hash, role, email_verified)
SELECT 
  id, 
  email, 
  encrypted_password, 
  'admin', 
  true
FROM auth.users
WHERE email = 'nadir@agency.com';
```

**Note:** Change the password `ChangeThisPassword123!` to something secure!

## Step 6: Test the Connection

After completing all steps, test the connection:

```bash
cd g:\university\projects\agency\agency-page
pnpm dev
```

Open http://localhost:3000 - the site should load without errors.

## Troubleshooting

### Error: "relation does not exist"
- The schema wasn't run successfully. Go back to Step 2 and run it again.

### Error: "Invalid API key"
- Check that you copied the correct anon key from Supabase Settings > API

### Error: "CORS policy"
- In Supabase, go to Settings > API > CORS
- Add `http://localhost:3000` to allowed origins

### Error: Cloudinary upload fails
- Make sure the upload preset is set to "Unsigned"
- Verify the cloud name is correct: `dz4v0ymjw`

## Next Steps

Once everything is set up:
1. ✅ Database schema created
2. ✅ Environment variables configured
3. ✅ Cloudinary preset created
4. ✅ Admin account created

You're ready to proceed with building the authentication pages and registration form!
