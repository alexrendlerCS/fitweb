# Email Setup Guide for FitWeb Studio

## Current Setup

✅ **Resend is now configured and ready to use!**

The application system is configured to send email notifications when new applications are submitted using Resend.

## Setup Steps

### 1. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to your dashboard and get your API key
3. Add to your `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   ```

### 2. Verify Your Domain (Optional but Recommended)

1. In your Resend dashboard, add and verify your domain
2. This allows you to send from `hello@yourdomain.com` instead of the default Resend domain
3. If you don't verify a domain, emails will come from `onboarding@resend.dev`

### 3. Test the Setup

1. Start your development server
2. Submit a test application
3. Check your email for the notification

## Email Content

The system sends emails with:

- Applicant's name, email, and business
- Selected package tier
- Business goals and requirements
- Social media links (if provided)
- Application ID for tracking

## Customization

You can modify the email content in `app/api/applications/route.ts` around line 40-50.

## Alternative Email Services

If you prefer a different email service, you can easily switch:

### SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Add to your `.env.local`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```
4. Install the package:
   ```bash
   pnpm add @sendgrid/mail
   ```
5. Update the email route to use SendGrid

### Nodemailer (Gmail)

1. Install nodemailer:
   ```bash
   pnpm add nodemailer
   ```
2. Set up Gmail app password
3. Add to your `.env.local`:
   ```
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   ```
