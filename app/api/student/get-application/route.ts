import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

        // Get applicant data
        const { data: applicant, error: applicantError } = await supabase
            .from('applicants')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (applicantError) {
            console.error('Applicant fetch error:', applicantError);
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            applicant,
        });
    } catch (error) {
        console.error('Get application error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
