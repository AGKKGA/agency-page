"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { EmailVerificationStep } from "@/components/registration/steps/step-1-email";
import { PersonalInfoStep } from "@/components/registration/steps/step-2-personal";
import { EducationStep } from "@/components/registration/steps/step-3-education";
import { ApplicationStep } from "@/components/registration/steps/step-4-application";
import { DocumentsStep } from "@/components/registration/steps/step-5-documents";
import { AdditionalInfoStep } from "@/components/registration/steps/step-6-additional";
import { ReviewStep } from "@/components/registration/steps/step-7-review";

import type {
    PersonalInfoData,
    EducationData,
    ApplicationDetailsData,
    DocumentsData,
    AdditionalInfoData,
} from "@/lib/validations/registration";

const STEPS = [
    "Email Verification",
    "Personal Information",
    "Education Background",
    "Application Details",
    "Documents",
    "Additional Information",
    "Review & Submit",
];

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [email, setEmail] = useState("");
    const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfoData>>({});
    const [education, setEducation] = useState<Partial<EducationData>>({});
    const [application, setApplication] = useState<Partial<ApplicationDetailsData>>({});
    const [documents, setDocuments] = useState<Partial<DocumentsData>>({ recommendationLetters: [], otherCertificates: [] });
    const [additionalInfo, setAdditionalInfo] = useState<Partial<AdditionalInfoData>>({ acceptTerms: false });

    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/registration/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    personal: personalInfo,
                    education,
                    application,
                    documents,
                    additional: additionalInfo,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Registration failed");
                return;
            }

            toast.success("Registration successful! Check your email for login credentials.");
            router.push(`/registration/success?ref=${result.referenceNumber}`);
        } catch (error) {
            toast.error("An error occurred during registration");
            console.error("Registration error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Student Registration</h1>
                    <p className="text-muted-foreground">
                        Complete the form below to apply for our services
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">Step {currentStep + 1} of {STEPS.length}</span>
                                <span className="text-muted-foreground">{STEPS[currentStep]}</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{STEPS[currentStep]}</CardTitle>
                        <CardDescription>
                            {currentStep === 0 && "Verify your email address to get started"}
                            {currentStep === 1 && "Tell us about yourself"}
                            {currentStep === 2 && "Share your educational background"}
                            {currentStep === 3 && "What are you looking to study?"}
                            {currentStep === 4 && "Upload your required documents"}
                            {currentStep === 5 && "A few more details"}
                            {currentStep === 6 && "Review your application before submitting"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentStep === 0 && (
                            <EmailVerificationStep
                                email={email}
                                onEmailChange={setEmail}
                                onVerified={handleNext}
                            />
                        )}
                        {currentStep === 1 && (
                            <PersonalInfoStep
                                data={personalInfo}
                                onChange={setPersonalInfo}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {currentStep === 2 && (
                            <EducationStep
                                data={education}
                                onChange={setEducation}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {currentStep === 3 && (
                            <ApplicationStep
                                data={application}
                                onChange={setApplication}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {currentStep === 4 && (
                            <DocumentsStep
                                data={documents}
                                onChange={setDocuments}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {currentStep === 5 && (
                            <AdditionalInfoStep
                                data={additionalInfo}
                                onChange={setAdditionalInfo}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        )}
                        {currentStep === 6 && (
                            <ReviewStep
                                email={email}
                                personal={personalInfo}
                                education={education}
                                application={application}
                                documents={documents}
                                additional={additionalInfo}
                                onEdit={(step) => setCurrentStep(step)}
                                onSubmit={handleSubmit}
                                onBack={handleBack}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
