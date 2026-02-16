import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { oldPassword, newPassword } = await request.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Old and new passwords are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Verify old password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: oldPassword,
        });

        if (signInError) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (updateError) {
            console.error('Password update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
