import { z } from 'zod';

// Step 2: Personal Information
export const personalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.string().optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    nationality: z.string().min(1, 'Nationality is required'),
    currentCountry: z.string().min(1, 'Current country is required'),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    profilePictureUrl: z.string().url('Profile picture is required'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// Step 3: Education Background
export const educationSchema = z.object({
    highestEducation: z.string().min(1, 'Highest education is required'),
    institutionName: z.string().min(2, 'Institution name is required'),
    institutionCountry: z.string().optional(),
    fieldOfStudy: z.string().min(2, 'Field of study is required'),
    graduationYear: z.number().min(1950).max(2030),
    gpa: z.string().min(1, 'GPA/Grade is required'),
    transcriptUrl: z.string().url('Transcript is required'),
});

export type EducationData = z.infer<typeof educationSchema>;

// Step 4: Application Details
export const applicationDetailsSchema = z.object({
    desiredCountry: z.string().min(1, 'Desired country is required'),
    desiredProgramLevel: z.string().min(1, 'Program level is required'),
    desiredField: z.string().min(1, 'Field of study is required'),
    preferredIntake: z.string().min(1, 'Preferred intake is required'),
    budgetRange: z.string().min(1, 'Budget range is required'),
    needScholarship: z.boolean(),
});

export type ApplicationDetailsData = z.infer<typeof applicationDetailsSchema>;

// Step 5: Documents
export const documentsSchema = z.object({
    passportUrl: z.string().url('Passport is required'),
    englishTestUrl: z.string().url().optional().or(z.literal('')),
    cvUrl: z.string().url('CV/Resume is required'),
    motivationLetterUrl: z.string().url().optional().or(z.literal('')),
    recommendationLetters: z.array(z.string().url()).max(3),
    otherCertificates: z.array(z.string().url()).max(5),
});

export type DocumentsData = z.infer<typeof documentsSchema>;

// Step 6: Additional Information
export const additionalInfoSchema = z.object({
    howHeardAboutUs: z.string().optional(),
    referrerName: z.string().optional(),
    specialNotes: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
});

export type AdditionalInfoData = z.infer<typeof additionalInfoSchema>;

// Complete registration data
export const completeRegistrationSchema = z.object({
    email: z.string().email(),
    personal: personalInfoSchema,
    education: educationSchema,
    application: applicationDetailsSchema,
    documents: documentsSchema,
    additional: additionalInfoSchema,
});

export type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>;
