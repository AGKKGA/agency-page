import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
    phone: z.string().min(10).optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
});

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

        const body = await request.json();

        // Validate data
        const validationResult = updateProfileSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Update applicant record (only allowed fields)
        const { error: updateError } = await supabase
            .from('applicants')
            .update({
                phone: data.phone,
                city: data.city,
                postal_code: data.postal_code,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Profile update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
