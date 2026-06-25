-- Create contact_enquiries table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for unread queries lookup
CREATE INDEX IF NOT EXISTS idx_enquiries_unread ON contact_enquiries(is_read) WHERE is_read = FALSE;

-- Create email_logs table for tracking appointment confirmation, alerts, reminders, and failures
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_type VARCHAR(50) NOT NULL, -- e.g., 'Appointment Confirmation', 'Doctor Notification', 'Reminder Email'
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    appointment_id UUID, -- Optional link to appointments table (can be null or UUID)
    status VARCHAR(20) NOT NULL, -- 'Pending', 'Sent', 'Delivered', 'Failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for status/recipient searches
CREATE INDEX IF NOT EXISTS idx_email_logs_lookup ON email_logs(recipient_email, status);
CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs(appointment_id);

-- Phase 1: Content Management Tables

-- 1. Home Slider Table
CREATE TABLE IF NOT EXISTS home_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Awards Table (Simplified Schema)
CREATE TABLE IF NOT EXISTS awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Testimonials Table (Enhanced Schema)
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name VARCHAR(100) NOT NULL,
    treatment_received VARCHAR(100),
    testimonial_text TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    patient_image_url TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Phase 2: Content Management Tables

-- 5. Case Studies Table (Enhanced)
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    image_url TEXT, -- Cover image in 'case-studies' bucket
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    display_order INT DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Seminars Table (Simplified)
CREATE TABLE IF NOT EXISTS seminars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255), -- Optional Title
    description TEXT, -- Optional Description
    image_url TEXT, -- Banner image in 'seminars' bucket
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    display_order INT DEFAULT 0 NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Treatments Table (Enhanced)
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_content TEXT NOT NULL,
    image_url TEXT, -- Image in 'treatments' bucket
    status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    display_order INT DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. About Page Config Table (Predefined Fixed Sections Schema)
CREATE TABLE IF NOT EXISTS about_page_config (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    hero_title VARCHAR(255) NOT NULL,
    hero_subtitle TEXT,
    hero_image_url TEXT, -- Image in 'about' bucket
    story_content TEXT NOT NULL, -- Story text
    
    -- Mission & Vision
    show_mission_vision BOOLEAN DEFAULT TRUE NOT NULL,
    mission_text TEXT,
    vision_text TEXT,
    
    -- Clinic Statistics strip
    show_clinic_stats BOOLEAN DEFAULT TRUE NOT NULL,
    stats_years_count VARCHAR(20) DEFAULT '15+' NOT NULL,
    stats_patients_count VARCHAR(20) DEFAULT '10k+' NOT NULL,
    stats_satisfaction_rate VARCHAR(20) DEFAULT '99%' NOT NULL,
    
    -- Value Grid Content (Fixed 4 Cards)
    show_values_grid BOOLEAN DEFAULT TRUE NOT NULL,
    value_card1_title VARCHAR(100) DEFAULT 'Constitutional Approach' NOT NULL,
    value_card1_desc TEXT NOT NULL,
    value_card2_title VARCHAR(100) DEFAULT 'Gentle & Non-Toxic' NOT NULL,
    value_card2_desc TEXT NOT NULL,
    value_card3_title VARCHAR(100) DEFAULT 'Experienced Practitioners' NOT NULL,
    value_card3_desc TEXT NOT NULL,
    value_card4_title VARCHAR(100) DEFAULT 'Comprehensive Wellness' NOT NULL,
    value_card4_desc TEXT NOT NULL,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add SEO fields to Phase 1 tables if not present
ALTER TABLE awards ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE awards ADD COLUMN IF NOT EXISTS seo_description TEXT;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Phase 3: Content Management Tables

-- 9. Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key VARCHAR(50) UNIQUE NOT NULL, -- 'confirm_patient', 'alert_doctor', 'reminder_24h'
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Template Version History Table
CREATE TABLE IF NOT EXISTS email_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    version INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Global SEO Settings Table (Expanded)
CREATE TABLE IF NOT EXISTS global_seo_config (
    id UUID PRIMARY KEY DEFAULT '11111111-1111-1111-1111-111111111111'::uuid,
    site_name VARCHAR(150) DEFAULT 'Narayan Homoeopathic Chikitsalaya' NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    og_image_url TEXT,
    clinic_phone VARCHAR(20) DEFAULT '+91-1332 270021' NOT NULL,
    clinic_email VARCHAR(255) DEFAULT 'homoeopathy4u@gmail.com' NOT NULL,
    clinic_address TEXT DEFAULT 'First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667' NOT NULL,
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee' NOT NULL,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    linkedin_url TEXT,
    google_analytics_id VARCHAR(50),
    google_tag_manager_id VARCHAR(50),
    google_search_console_verification TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Automated Seeding Script for Page Content & Core Templates

-- Seed Global SEO Configuration
INSERT INTO global_seo_config (id, meta_title, meta_description, clinic_phone, clinic_email, clinic_address)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Narayan Homoeopathic Chikitsalaya | Constitutional Homeopathy Roorkee',
    'Schedule professional constitutional homeopathy consultations at Narayan Clinic Roorkee. Safe, natural remedies tailored to your health profile.',
    '+91-1332 270021',
    'homoeopathy4u@gmail.com',
    'First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667'
) ON CONFLICT (id) DO NOTHING;

-- Seed About Us Predefined Sections
INSERT INTO about_page_config (
    id, hero_title, hero_subtitle, story_content, 
    show_mission_vision, mission_text, vision_text,
    show_clinic_stats, stats_years_count, stats_patients_count, stats_satisfaction_rate,
    show_values_grid, value_card1_title, value_card1_desc, value_card2_title, value_card2_desc,
    value_card3_title, value_card3_desc, value_card4_title, value_card4_desc
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Empowering Your Health Naturally',
    'Constitutional homeopathy consultations customized for your unique lifestyle and wellness goals.',
    'At Narayan Homoeopathic Chikitsalaya, we believe in restoring balance. Our clinic has served the Roorkee community for over 15 years, integrating traditional homeopathy values with modern diagnostics.',
    true,
    'To offer constitutional healing that restores complete health gently and safely.',
    'To make gentle constitutional homoeopathic care accessible to every household in Roorkee.',
    true, '15+', '10k+', '99%',
    true,
    'Constitutional Approach', 'Tailored to your genetic and behavioral blueprint.',
    'Gentle & Non-Toxic', 'Safe constitutional remedies with zero side effects.',
    'Experienced Doctors', 'Consultation under certified homeopathic medical experts.',
    'Comprehensive Wellness', 'Improving overall vitality and physiological resilience.'
) ON CONFLICT (id) DO NOTHING;

-- Seed Patient Email Template
INSERT INTO email_templates (template_key, name, subject, body_html)
VALUES (
    'confirm_patient',
    'Appointment Confirmation (Patient)',
    'Appointment Confirmed - {{appointmentId}}',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 12px;">
      <h2>Appointment Confirmation</h2>
      <p>Dear <strong>{{patientName}}</strong>,</p>
      <p>Your constitutional homeopathy consultation has been successfully scheduled. Details are below:</p>
      <ul>
        <li><strong>Booking ID:</strong> {{appointmentId}}</li>
        <li><strong>Date:</strong> {{appointmentDate}}</li>
        <li><strong>Time Slot:</strong> {{appointmentTime}}</li>
        <li><strong>Clinic Location:</strong> {{clinicAddress}}</li>
        <li><strong>Contact Phone:</strong> {{clinicPhone}}</li>
      </ul>
      <p>If you need to change your appointment date/time, please contact us at {{clinicPhone}}.</p>
    </div>'
) ON CONFLICT (template_key) DO NOTHING;

-- Seed Doctor Alert Template
INSERT INTO email_templates (template_key, name, subject, body_html)
VALUES (
    'alert_doctor',
    'Doctor Notification Alert',
    '[ALERT] New Appointment Booking - {{appointmentId}}',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 12px;">
      <h2>New Consultation Booked</h2>
      <p>A new appointment has been scheduled in the patient registry:</p>
      <ul>
        <li><strong>Patient Name:</strong> {{patientName}}</li>
        <li><strong>Patient Phone:</strong> {{patientPhone}}</li>
        <li><strong>Patient Email:</strong> {{patientEmail}}</li>
        <li><strong>Date:</strong> {{appointmentDate}}</li>
        <li><strong>Time Slot:</strong> {{appointmentTime}}</li>
      </ul>
    </div>'
) ON CONFLICT (template_key) DO NOTHING;
