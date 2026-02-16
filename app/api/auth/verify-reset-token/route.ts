import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        // For Supabase Auth, the token verification happens during password update
        // This endpoint just validates that a token was provided
        // The actual verification happens in the reset-password route

        return NextResponse.json({
            success: true,
            valid: true,
        });
    } catch (error) {
        console.error('Verify token error:', error);
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 400 }
        );
    }
}
