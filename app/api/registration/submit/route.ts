import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { completeRegistrationSchema } from '@/lib/validations/registration';
import { generatePassword } from '@/lib/utils/password';
import { sendRegistrationConfirmation } from '@/lib/email/service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate data
        const validationResult = completeRegistrationSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid form data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const data = validationResult.data;
        const supabase = await createClient();

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', data.email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Generate password
        const password = generatePassword();

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/login`,
                data: {
                    role: 'student',
                },
            },
        });

        if (authError || !authData.user) {
            console.error('Auth creation error:', authError);
            return NextResponse.json(
                { error: 'Failed to create user account' },
                { status: 500 }
            );
        }

        // Create user in public.users table
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: data.email,
                role: 'student',
                email_verified: true,
            });

        if (userError) {
            console.error('User table error:', userError);
            return NextResponse.json(
                { error: 'Failed to create user profile' },
                { status: 500 }
            );
        }

        // Generate reference number using database function
        const { data: refData, error: refError } = await supabase
            .rpc('generate_reference_number');

        if (refError || !refData) {
            console.error('Reference number error:', refError);
            return NextResponse.json(
                { error: 'Failed to generate reference number' },
                { status: 500 }
            );
        }

        const referenceNumber = refData;

        // Create applicant record
        const { error: applicantError } = await supabase
            .from('applicants')
            .insert({
                user_id: authData.user.id,
                reference_number: referenceNumber,
                first_name: data.personal.firstName,
                last_name: data.personal.lastName,
                date_of_birth: data.personal.dateOfBirth,
                gender: data.personal.gender || null,
                phone: data.personal.phone,
                nationality: data.personal.nationality,
                current_country: data.personal.currentCountry,
                city: data.personal.city || null,
                postal_code: data.personal.postalCode || null,
                profile_picture_url: data.personal.profilePictureUrl,
                highest_education: data.education.highestEducation,
                institution_name: data.education.institutionName,
                institution_country: data.education.institutionCountry || null,
                field_of_study: data.education.fieldOfStudy,
                graduation_year: data.education.graduationYear,
                gpa: data.education.gpa,
                transcript_url: data.education.transcriptUrl,
                desired_country: data.application.desiredCountry,
                desired_program_level: data.application.desiredProgramLevel,
                desired_field: data.application.desiredField,
                preferred_intake: data.application.preferredIntake,
                budget_range: data.application.budgetRange,
                need_scholarship: data.application.needScholarship,
                passport_url: data.documents.passportUrl,
                english_test_url: data.documents.englishTestUrl || null,
                cv_url: data.documents.cvUrl,
                motivation_letter_url: data.documents.motivationLetterUrl || null,
                recommendation_letters: data.documents.recommendationLetters,
                other_certificates: data.documents.otherCertificates,
                how_heard_about_us: data.additional.howHeardAboutUs || null,
                referrer_name: data.additional.referrerName || null,
                special_notes: data.additional.specialNotes || null,
                status: 'pending',
            });

        if (applicantError) {
            console.error('Applicant creation error:', applicantError);
            return NextResponse.json(
                { error: 'Failed to create application' },
                { status: 500 }
            );
        }

        // Send confirmation email
        try {
            await sendRegistrationConfirmation(
                data.email,
                `${data.personal.firstName} ${data.personal.lastName}`,
                referenceNumber,
                password
            );
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Don't fail the registration if email fails
        }

        return NextResponse.json({
            success: true,
            referenceNumber,
            message: 'Registration successful! Check your email for login credentials.',
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
