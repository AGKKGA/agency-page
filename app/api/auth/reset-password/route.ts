import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Update password using Supabase Auth
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            return NextResponse.json(
                { error: 'Failed to reset password' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
