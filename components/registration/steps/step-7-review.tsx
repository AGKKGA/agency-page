"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Edit } from "lucide-react";
import type {
    PersonalInfoData,
    EducationData,
    ApplicationDetailsData,
    DocumentsData,
    AdditionalInfoData,
} from "@/lib/validations/registration";

interface ReviewStepProps {
    email: string;
    personal: Partial<PersonalInfoData>;
    education: Partial<EducationData>;
    application: Partial<ApplicationDetailsData>;
    documents: Partial<DocumentsData>;
    additional: Partial<AdditionalInfoData>;
    onEdit: (step: number) => void;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function ReviewStep({
    email,
    personal,
    education,
    application,
    documents,
    additional,
    onEdit,
    onSubmit,
    onBack,
    isSubmitting,
}: ReviewStepProps) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    Please review your information carefully before submitting. You can edit any section by clicking the edit button.
                </p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Email</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{email}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Name:</strong> {personal.firstName} {personal.lastName}</div>
                    <div><strong>DOB:</strong> {personal.dateOfBirth}</div>
                    <div><strong>Phone:</strong> {personal.phone}</div>
                    <div><strong>Nationality:</strong> {personal.nationality}</div>
                    <div><strong>Country:</strong> {personal.currentCountry}</div>
                    {personal.city && <div><strong>City:</strong> {personal.city}</div>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Education</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Level:</strong> {education.highestEducation}</div>
                    <div><strong>Institution:</strong> {education.institutionName}</div>
                    <div><strong>Field:</strong> {education.fieldOfStudy}</div>
                    <div><strong>Year:</strong> {education.graduationYear}</div>
                    <div><strong>GPA:</strong> {education.gpa}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Application Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Country:</strong> {application.desiredCountry}</div>
                    <div><strong>Program:</strong> {application.desiredProgramLevel}</div>
                    <div><strong>Field:</strong> {application.desiredField}</div>
                    <div><strong>Intake:</strong> {application.preferredIntake}</div>
                    <div><strong>Budget:</strong> {application.budgetRange}</div>
                    <div><strong>Scholarship:</strong> {application.needScholarship ? "Yes" : "No"}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Documents</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <div>✅ Passport uploaded</div>
                    <div>✅ CV/Resume uploaded</div>
                    {documents.englishTestUrl && <div>✅ English Test uploaded</div>}
                    {documents.motivationLetterUrl && <div>✅ Motivation Letter uploaded</div>}
                </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                </Button>
            </div>
        </div>
    );
}
