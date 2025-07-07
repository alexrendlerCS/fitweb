# FitWeb Studio - Hybrid Onboarding Setup

## Overview

This implementation provides a complete hybrid onboarding flow for FitWeb Studio, allowing trainers to apply for web services with manual admin approval and Stripe payment integration.

## Features Implemented

### ✅ Completed Features

1. **Updated Package Pricing** - All three tiers updated with new pricing structure
2. **Application Form** - Complete trainer application system with validation
3. **Admin Dashboard** - Full admin interface to manage applications
4. **Status Tracking** - Trainers can check their application status
5. **Database Integration** - Supabase integration for data storage

### 🔧 Technical Components

- **Application Form** (`/apply`) - Collects trainer information
- **Admin Dashboard** (`/admin/applications`) - Manage applications
- **Status Page** (`/status`) - Check application status
- **Database Schema** - Supabase table for applications

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Create the `trainer_applications` table with the following schema:

```sql
CREATE TABLE trainer_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  selected_tier TEXT NOT NULL CHECK (selected_tier IN ('starter', 'pro', 'elite')),
  goals TEXT NOT NULL,
  instagram_url TEXT,
  calendly_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  stripe_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Package Pricing Updates

All package pages have been updated with the new pricing structure:

- **Starter**: $1,000 setup + $150/month (max 10 clients)
- **Pro**: $1,250 setup + $175/month (max 15 clients)
- **Elite**: $1,500+ setup + $200-300/month (20+ clients)

### 4. Application Flow

1. Trainers click "Apply Now" on package pages
2. Fill out application form at `/apply`
3. Admin reviews applications at `/admin/applications`
4. Admin approves and adds Stripe payment link
5. Trainer completes payment
6. Status updated to "paid" and onboarding begins

## Admin Workflow

### Managing Applications

1. **Review Applications** - View all applications in the admin dashboard
2. **Approve/Reject** - Click on applications to review details and take action
3. **Add Payment Links** - For approved applications, add Stripe payment link
4. **Track Status** - Monitor application progress through the workflow

### Status Management

- **Pending** - New applications awaiting review
- **Approved** - Application approved, payment link added
- **Paid** - Payment completed, ready for onboarding
- **Rejected** - Application not approved

## Database Schema

### trainer_applications Table

| Field         | Type      | Description                          |
| ------------- | --------- | ------------------------------------ |
| id            | UUID      | Primary key                          |
| full_name     | TEXT      | Trainer's full name                  |
| email         | TEXT      | Contact email                        |
| business_name | TEXT      | Fitness business name                |
| selected_tier | TEXT      | Package tier (starter/pro/elite)     |
| goals         | TEXT      | Business goals and requirements      |
| instagram_url | TEXT      | Optional Instagram profile           |
| calendly_url  | TEXT      | Optional Calendly link               |
| status        | TEXT      | Application status                   |
| stripe_link   | TEXT      | Stripe payment link (added by admin) |
| created_at    | TIMESTAMP | Application submission date          |

## Next Steps

### Immediate Actions Needed

1. **Set up Supabase** - Create project and table
2. **Configure environment variables** - Add Supabase credentials
3. **Test application flow** - Submit test applications
4. **Set up admin access** - Secure admin dashboard

### Future Enhancements

1. **Email notifications** - Automated emails for status changes
2. **Onboarding flow** - Post-payment setup process
3. **Referral system** - Track and manage referrals
4. **Analytics dashboard** - Business metrics and insights

## Security Considerations

- Admin dashboard should be protected with authentication
- Supabase RLS (Row Level Security) should be configured
- Environment variables should be kept secure
- Payment links should be validated before use

## Support

For technical support or questions about the implementation, contact the development team.
