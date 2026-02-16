import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateOTP } from '@/lib/utils/otp';
import { sendVerificationEmail } from '@/lib/email/service';

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

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Generate OTP
        const code = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiration

        // Store OTP in database
        const { error: otpError } = await supabase
            .from('otp_codes')
            .insert({
                email,
                code,
                expires_at: expiresAt.toISOString(),
                used: false,
            });

        if (otpError) {
            console.error('OTP storage error:', otpError);
            return NextResponse.json(
                { error: 'Failed to generate verification code' },
                { status: 500 }
            );
        }

        // Send email
        try {
            await sendVerificationEmail(email, code);
        } catch (emailError) {
            console.error('Email send error:', emailError);
            return NextResponse.json(
                { error: 'Failed to send verification email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
