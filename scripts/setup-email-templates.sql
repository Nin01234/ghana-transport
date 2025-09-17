-- Setup email templates for Supabase Auth
-- This would typically be configured in the Supabase dashboard

-- Email confirmation template
INSERT INTO auth.email_templates (template_name, subject, body_html, body_text) VALUES (
  'confirmation',
  'Confirm your email - GhanaTransit',
  '
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm your email - GhanaTransit</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #22c55e, #eab308); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🚌 Welcome to GhanaTransit!</h1>
        <p>Confirm your email to get started</p>
      </div>
      <div class="content">
        <h2>Hello there!</h2>
        <p>Thank you for signing up for GhanaTransit. To complete your registration and start booking your journeys across Ghana, please confirm your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
        </div>
        
        <p>If the button above doesn''t work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">{{ .ConfirmationURL }}</p>
        
        <p><strong>Why verify your email?</strong></p>
        <ul>
          <li>Secure your account</li>
          <li>Receive booking confirmations</li>
          <li>Get real-time bus updates</li>
          <li>Access customer support</li>
        </ul>
        
        <p>If you didn''t create an account with GhanaTransit, you can safely ignore this email.</p>
        
        <p>Welcome aboard!<br>The GhanaTransit Team</p>
      </div>
      <div class="footer">
        <p>GhanaTransit - Connecting Ghana, One Journey at a Time</p>
        <p>If you have any questions, contact us at support@ghanatransit.com</p>
      </div>
    </div>
  </body>
  </html>
  ',
  'Welcome to GhanaTransit!

Thank you for signing up. To complete your registration, please confirm your email address by clicking the link below:

{{ .ConfirmationURL }}

If you didn''t create an account with GhanaTransit, you can safely ignore this email.

Welcome aboard!
The GhanaTransit Team

---
GhanaTransit - Connecting Ghana, One Journey at a Time
support@ghanatransit.com'
) ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text;
