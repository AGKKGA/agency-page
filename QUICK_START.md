# Quick Start Checklist

Before you can run the application, complete these steps:

## ✅ Step 1: Get Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/qypkqtzymftsvgiwvtvz/settings/api
2. Find the **"anon public"** key (starts with `eyJ...`)
3. Copy it
4. Open `.env.local` file
5. Replace `YOUR_ANON_KEY_HERE_FROM_SUPABASE_DASHBOARD` with the key you copied

## ✅ Step 2: Run Database Schema

1. Go to: https://supabase.com/dashboard/project/qypkqtzymftsvgiwvtvz/sql/new
2. Open the file: `supabase/schema.sql` in your code editor
3. Copy ALL the contents (Ctrl+A, Ctrl+C)
4. Paste into the Supabase SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success" message

## ✅ Step 3: Create Cloudinary Upload Preset

1. Go to: https://cloudinary.com/console/settings/upload
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set:
   - Preset name: `agency_unsigned`
   - Signing mode: **Unsigned**
   - Folder: `agency`
5. Click **Save**

## ✅ Step 4: Create Admin Account

1. Go back to Supabase SQL Editor
2. Run this SQL (change the password!):

```sql
-- Create admin in auth.users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
  'authenticated', 'authenticated', 'nadir@agency.com',
  crypt('YourSecurePassword123!', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{"role":"admin"}', NOW(), NOW(), '', ''
);

-- Create admin in public.users
INSERT INTO public.users (id, email, password_hash, role, email_verified)
SELECT id, email, encrypted_password, 'admin', true
FROM auth.users WHERE email = 'nadir@agency.com';
```

## ✅ Step 5: Test the Setup

Run in terminal:
```bash
pnpm dev
```

Open: http://localhost:3000

If you see the homepage without errors, you're ready! 🎉

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.
