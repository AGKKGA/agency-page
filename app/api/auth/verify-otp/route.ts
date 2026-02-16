import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOTPExpired } from '@/lib/utils/otp';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Get OTP from database
        const { data: otpData, error: otpError } = await supabase
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('code', code)
            .eq('used', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (otpError || !otpData) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Check if expired
        if (isOTPExpired(otpData.expires_at)) {
            return NextResponse.json(
                { error: 'Verification code has expired' },
                { status: 400 }
            );
        }

        // Mark as used
        await supabase
            .from('otp_codes')
            .update({ used: true })
            .eq('id', otpData.id);

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
