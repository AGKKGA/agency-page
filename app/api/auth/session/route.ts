import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        // Get user role
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, email_verified')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                role: userData.role,
                emailVerified: userData.email_verified,
            },
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}
