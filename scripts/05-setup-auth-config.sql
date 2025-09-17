-- Configure Supabase Auth settings
-- Note: These settings should be configured in the Supabase Dashboard
-- This file serves as documentation of required settings

/*
Required Auth Configuration in Supabase Dashboard:

1. Site URL: https://your-domain.com (or http://localhost:3000 for development)

2. Redirect URLs:
   - https://your-domain.com/auth/callback
   - https://your-domain.com/auth/verify-email
   - http://localhost:3000/auth/callback (for development)
   - http://localhost:3000/auth/verify-email (for development)

3. Email Templates:
   - Confirmation: Custom template with GhanaTransit branding
   - Recovery: Custom template for password reset
   - Magic Link: Custom template for passwordless login

4. SMTP Settings:
   - Configure custom SMTP or use Supabase's default
   - Ensure "Enable email confirmations" is checked

5. Security Settings:
   - Enable email confirmation
   - Set session timeout as needed
   - Configure password requirements

6. OAuth Providers (if needed):
   - Google OAuth
   - Facebook OAuth
*/

-- Create email template for confirmation
INSERT INTO auth.email_templates (template_name, subject, body_html, body_text) VALUES (
  'confirmation',
  'Welcome to GhanaTransit - Confirm your email',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GhanaTransit</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e, #eab308); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚌 GhanaTransit</div>
            <h1>Welcome Aboard!</h1>
            <p>Confirm your email to start your journey</p>
        </div>
        <div class="content">
            <h2>Hello there!</h2>
            <p>Thank you for joining GhanaTransit, Ghana''s premier smart transport platform. To complete your registration and start booking your journeys across beautiful Ghana, please confirm your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            </div>
            
            <p>If the button doesn''t work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; background: #f0f0f0; padding: 10px; border-radius: 4px;">{{ .ConfirmationURL }}</p>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #22c55e;">🎉 What''s waiting for you:</h3>
                <ul style="margin: 0;">
                    <li>🚌 Book buses across 50+ cities in Ghana</li>
                    <li>📍 Real-time GPS tracking</li>
                    <li>💳 Secure mobile money & card payments</li>
                    <li>⭐ Earn loyalty points on every trip</li>
                    <li>📱 24/7 customer support</li>
                </ul>
            </div>
            
            <p>If you didn''t create an account with GhanaTransit, you can safely ignore this email.</p>
            
            <p>Safe travels!<br><strong>The GhanaTransit Team</strong></p>
        </div>
        <div class="footer">
            <p><strong>GhanaTransit</strong> - Connecting Ghana, One Journey at a Time</p>
            <p>Questions? Contact us at <a href="mailto:support@ghanatransit.com">support@ghanatransit.com</a></p>
        </div>
    </div>
</body>
</html>',
  'Welcome to GhanaTransit!

Thank you for joining Ghana''s premier smart transport platform. 

To complete your registration and start booking your journeys across Ghana, please confirm your email address by clicking the link below:

{{ .ConfirmationURL }}

What''s waiting for you:
- Book buses across 50+ cities in Ghana
- Real-time GPS tracking  
- Secure mobile money & card payments
- Earn loyalty points on every trip
- 24/7 customer support

If you didn''t create an account with GhanaTransit, you can safely ignore this email.

Safe travels!
The GhanaTransit Team

---
GhanaTransit - Connecting Ghana, One Journey at a Time
Questions? Contact us at support@ghanatransit.com'
) ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text;
