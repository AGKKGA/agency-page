-- Student Registration Agency Platform - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE
);

-- ============================================
-- APPLICANTS TABLE
-- ============================================
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  reference_number TEXT UNIQUE NOT NULL,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  current_country TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  profile_picture_url TEXT NOT NULL,
  
  -- Education
  highest_education TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  institution_country TEXT,
  field_of_study TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  gpa TEXT NOT NULL,
  transcript_url TEXT NOT NULL,
  
  -- Application Details
  desired_country TEXT NOT NULL,
  desired_program_level TEXT NOT NULL,
  desired_field TEXT NOT NULL,
  preferred_intake TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  need_scholarship BOOLEAN DEFAULT FALSE,
  
  -- Documents (Cloudinary URLs)
  passport_url TEXT NOT NULL,
  english_test_url TEXT,
  cv_url TEXT NOT NULL,
  motivation_letter_url TEXT,
  recommendation_letters JSONB DEFAULT '[]'::jsonb,
  other_certificates JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  current_status TEXT DEFAULT 'submitted' CHECK (
    current_status IN ('submitted', 'under_review', 'documents_required', 
                       'processing', 'accepted', 'rejected', 'on_hold', 'cancelled')
  ),
  
  -- Additional Info
  how_heard_about_us TEXT,
  referrer_name TEXT,
  special_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STATUS HISTORY TABLE
-- ============================================
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  message_to_student TEXT,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  message_text TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  featured_image_url TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG CATEGORIES TABLE
-- ============================================
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDIA LIBRARY TABLE
-- ============================================
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'document', 'video')),
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  folder TEXT,
  uploaded_by UUID REFERENCES users(id),
  used_in TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOM PAGES TABLE
-- ============================================
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  meta_description TEXT,
  featured_image_url TEXT,
  show_in_menu BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  home_country TEXT NOT NULL,
  university TEXT NOT NULL,
  program TEXT,
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  admission_year INTEGER,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PARTNER UNIVERSITIES TABLE
-- ============================================
CREATE TABLE partner_universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL TEMPLATES TABLE
-- ============================================
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OTP CODES TABLE (for email verification)
-- ============================================
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  count INTEGER;
  ref_number TEXT;
BEGIN
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  
  SELECT COUNT(*) + 1 INTO count
  FROM applicants
  WHERE reference_number LIKE 'APP-' || year || '-%';
  
  ref_number := 'APP-' || year || '-' || LPAD(count::TEXT, 4, '0');
  
  RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Applicants policies
CREATE POLICY "Students can view own application" ON applicants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all applications" ON applicants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Status history policies
CREATE POLICY "Students can view own status history" ON status_history
  FOR SELECT USING (
    applicant_id IN (
      SELECT id FROM applicants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage status history" ON status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    applicant_id IN (
      SELECT id FROM applicants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can manage all messages" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Blog posts policies (public can read published)
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Blog categories policies
CREATE POLICY "Public can view categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON blog_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Site settings policies
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Media library policies
CREATE POLICY "Public can view media" ON media_library
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Custom pages policies
CREATE POLICY "Public can view published pages" ON custom_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage pages" ON custom_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Testimonials policies
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Partner universities policies
CREATE POLICY "Public can view active partners" ON partner_universities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage partners" ON partner_universities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Email templates policies
CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- OTP codes policies (no public access)
CREATE POLICY "System can manage OTP codes" ON otp_codes
  FOR ALL USING (true);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_applicants_user_id ON applicants(user_id);
CREATE INDEX idx_applicants_status ON applicants(current_status);
CREATE INDEX idx_applicants_created_at ON applicants(created_at DESC);
CREATE INDEX idx_status_history_applicant_id ON status_history(applicant_id);
CREATE INDEX idx_messages_applicant_id ON messages(applicant_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX idx_otp_codes_email ON otp_codes(email);
CREATE INDEX idx_otp_codes_expires_at ON otp_codes(expires_at);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Universities', 'universities', 'Information about partner universities', '#3b82f6'),
  ('Visa Info', 'visa-info', 'Visa application guides and tips', '#10b981'),
  ('Success Stories', 'success-stories', 'Student success stories', '#f59e0b'),
  ('Country Guides', 'country-guides', 'Study destination guides', '#8b5cf6');

-- Insert default email templates
INSERT INTO email_templates (template_key, subject, body_html, variables) VALUES
  ('verification', 'Verify Your Email - Student Registration Agency', 
   '<h1>Email Verification</h1><p>Your verification code is: <strong>{{code}}</strong></p><p>This code expires in 10 minutes.</p>',
   '["code"]'::jsonb),
  
  ('registration_confirmation', 'Application Received - {{reference_number}}',
   '<h1>Application Submitted Successfully!</h1><p>Dear {{name}},</p><p>Your application has been received. Reference number: <strong>{{reference_number}}</strong></p><p>Login credentials:</p><ul><li>Email: {{email}}</li><li>Password: {{password}}</li></ul>',
   '["name", "reference_number", "email", "password"]'::jsonb),
  
  ('status_update', 'Application Status Updated - {{new_status}}',
   '<h1>Status Update</h1><p>Dear {{name}},</p><p>Your application status has been updated to: <strong>{{new_status}}</strong></p><p>{{message}}</p>',
   '["name", "new_status", "message"]'::jsonb);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('homepage_config', '{
    "hero": {
      "enabled": true,
      "headline": "Your Gateway to Global Education",
      "subheadline": "We help students achieve their dreams of studying abroad",
      "backgroundImageUrl": "",
      "overlayOpacity": 0.5,
      "ctaText": "Apply Now",
      "ctaLink": "/register",
      "textAlignment": "center"
    },
    "about": {
      "enabled": true,
      "title": "About Us",
      "content": "<p>We are a leading education consultancy helping students achieve their dreams.</p>",
      "imageUrl": "",
      "backgroundColor": "#f3f4f6",
      "stats": [
        {"number": "500+", "label": "Students Placed"},
        {"number": "50+", "label": "Partner Universities"},
        {"number": "15+", "label": "Countries"},
        {"number": "98%", "label": "Success Rate"}
      ]
    },
    "services": {
      "enabled": true,
      "title": "Our Services",
      "layout": "grid",
      "columnsPerRow": 3,
      "items": [
        {"icon": "GraduationCap", "title": "University Selection", "description": "Find the perfect university for your goals"},
        {"icon": "FileText", "title": "Application Support", "description": "Complete application assistance"},
        {"icon": "Plane", "title": "Visa Guidance", "description": "Expert visa application support"}
      ]
    },
    "testimonials": {
      "enabled": true,
      "title": "Student Success Stories",
      "displayStyle": "carousel",
      "itemsToShow": 3
    },
    "partners": {
      "enabled": true,
      "title": "Our Partner Universities",
      "scrollSpeed": "medium",
      "hoverEffect": "zoom"
    },
    "contact": {
      "enabled": true,
      "title": "Get in Touch",
      "showContactForm": true,
      "mapEmbedCode": ""
    },
    "sectionOrder": ["hero", "about", "services", "testimonials", "partners", "contact"]
  }'::jsonb),
  
  ('navigation_menu', '{
    "items": [
      {"label": "Home", "link": "/", "type": "link"},
      {"label": "About", "link": "/about", "type": "link"},
      {"label": "Blog", "link": "/blog", "type": "link"},
      {"label": "Contact", "link": "/contact", "type": "link"}
    ],
    "ctaButton": {
      "enabled": true,
      "text": "Apply Now",
      "link": "/register"
    }
  }'::jsonb),
  
  ('site_design', '{
    "primaryColor": "#3b82f6",
    "secondaryColor": "#10b981",
    "accentColor": "#f59e0b",
    "fontPairing": "Inter",
    "logoUrl": "",
    "faviconUrl": ""
  }'::jsonb);

COMMENT ON TABLE users IS 'User accounts for students and admins';
COMMENT ON TABLE applicants IS 'Student application data';
COMMENT ON TABLE status_history IS 'Log of all status changes';
COMMENT ON TABLE messages IS 'Messages between students and admin';
COMMENT ON TABLE blog_posts IS 'Blog posts for the website';
COMMENT ON TABLE site_settings IS 'Customizable site configuration';
