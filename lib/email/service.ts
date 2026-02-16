import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplate {
    to: string;
    subject: string;
    html: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailTemplate) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Email send error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email service error:', error);
        throw error;
    }
}

/**
 * Send OTP verification email
 */
export async function sendVerificationEmail(email: string, code: string) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3b82f6; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Email Verification</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Hi there!</p>
          <p style="font-size: 16px; color: #374151;">Your verification code is:</p>
          <div style="background-color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; border: 2px solid #3b82f6;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #6b7280;">This code expires in 10 minutes.</p>
          <p style="font-size: 14px; color: #6b7280;">If you didn't request this code, please ignore this email.</p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
          <p>© ${new Date().getFullYear()} Student Registration Agency. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Verify Your Email - Student Registration Agency',
        html,
    });
}

/**
 * Send registration confirmation email
 */
export async function sendRegistrationConfirmation(
    email: string,
    name: string,
    referenceNumber: string,
    password: string
) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #10b981; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">✅ Application Submitted!</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
          <p style="font-size: 16px; color: #374151;">Thank you for submitting your application! We've successfully received your documents and information.</p>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #1e40af;">Your Application Reference Number:</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; color: #3b82f6; font-weight: bold;">${referenceNumber}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #374151;">Your Login Credentials:</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Password:</strong> ${password}</p>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #ef4444;">⚠️ Please save these credentials in a safe place and change your password after first login.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Access Your Dashboard
            </a>
          </div>
          
          <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #374151;">What happens next?</p>
            <ol style="margin: 10px 0; padding-left: 20px; color: #6b7280;">
              <li style="margin: 5px 0;">Our team will review your application</li>
              <li style="margin: 5px 0;">We'll contact you if we need any additional documents</li>
              <li style="margin: 5px 0;">We'll submit your application to universities</li>
              <li style="margin: 5px 0;">You'll be notified of admission decisions</li>
            </ol>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">If you have any questions, feel free to reply to this email.</p>
          
          <p style="font-size: 16px; color: #374151; margin-top: 30px;">Best regards,<br><strong>Student Registration Agency Team</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
          <p>© ${new Date().getFullYear()} Student Registration Agency. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: `Application Received - ${referenceNumber}`,
        html,
    });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3b82f6; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Password Reset Request</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Hi there!</p>
          <p style="font-size: 16px; color: #374151;">We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 14px; color: #3b82f6; word-break: break-all;">${resetUrl}</p>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">⚠️ This link expires in 1 hour.</p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, please ignore this email or contact us if you have concerns.</p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
          <p>© ${new Date().getFullYear()} Student Registration Agency. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Password Reset Request - Student Registration Agency',
        html,
    });
}

/**
 * Send status update email
 */
export async function sendStatusUpdateEmail(
    email: string,
    name: string,
    referenceNumber: string,
    oldStatus: string,
    newStatus: string,
    message?: string
) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3b82f6; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Application Status Update</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
          <p style="font-size: 16px; color: #374151;">There's an update on your application (Ref: <strong>${referenceNumber}</strong>).</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your application status has changed from:</p>
            <p style="margin: 0; font-size: 18px; color: #9ca3af; text-decoration: line-through;">${oldStatus}</p>
            <p style="margin: 10px 0; font-size: 24px; font-weight: bold; color: #3b82f6;">→ ${newStatus}</p>
          </div>
          
          ${message ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">Message from your agent:</p>
            <p style="margin: 10px 0 0 0; color: #78350f;">${message}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              View Full Details
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">If you have any questions, please don't hesitate to reach out.</p>
          
          <p style="font-size: 16px; color: #374151; margin-top: 30px;">Best regards,<br><strong>Student Registration Agency Team</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af;">
          <p>© ${new Date().getFullYear()} Student Registration Agency. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: `Application Status Updated - ${newStatus}`,
        html,
    });
}
