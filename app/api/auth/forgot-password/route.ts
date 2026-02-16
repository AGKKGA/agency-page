import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPasswordResetEmail } from '@/lib/email/service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Check if user exists
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single();

        // Always return success to prevent email enumeration
        if (userError || !user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists, a reset email has been sent',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

        // Store reset token in database (you'll need to add a password_reset_tokens table)
        // For now, we'll use Supabase Auth's built-in password reset
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
        });

        if (resetError) {
            console.error('Password reset error:', resetError);
            return NextResponse.json(
                { error: 'Failed to send reset email' },
                { status: 500 }
            );
        }

        // Send custom email (optional - Supabase already sends one)
        // Uncomment if you want to send your own styled email
        // await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json({
            success: true,
            message: 'Password reset email sent',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
