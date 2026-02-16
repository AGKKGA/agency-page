"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const referenceNumber = searchParams.get("ref");
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (!referenceNumber) {
            router.push("/register");
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/login");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [referenceNumber, router]);

    if (!referenceNumber) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">Registration Successful!</CardTitle>
                    <CardDescription className="text-lg">
                        Your application has been submitted successfully
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            Your Reference Number
                        </p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {referenceNumber}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                            Please save this number for future reference
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Email Sent</p>
                                <p className="text-sm text-muted-foreground">
                                    We've sent your login credentials to your email address
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Application Received</p>
                                <p className="text-sm text-muted-foreground">
                                    Our team will review your application and contact you soon
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Dashboard Access</p>
                                <p className="text-sm text-muted-foreground">
                                    You can now log in to track your application status
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Next Steps:</strong> Check your email for login credentials. You'll be redirected to the login page in {countdown} seconds.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function RegistrationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
