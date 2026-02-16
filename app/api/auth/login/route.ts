import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Get user role from public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User data not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            role: userData.role,
            user: {
                id: authData.user.id,
                email: authData.user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
