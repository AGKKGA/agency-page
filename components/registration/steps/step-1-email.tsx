"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface EmailVerificationStepProps {
    email: string;
    onEmailChange: (email: string) => void;
    onVerified: () => void;
}

export function EmailVerificationStep({
    email,
    onEmailChange,
    onVerified,
}: EmailVerificationStepProps) {
    const [step, setStep] = useState<"email" | "verify">("email");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to send verification code");
                return;
            }

            toast.success("Verification code sent to your email!");
            setStep("verify");
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!code || code.length !== 6) {
            toast.error("Please enter the 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Invalid verification code");
                return;
            }

            toast.success("Email verified successfully!");
            onVerified();
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "email") {
        return (
            <div className="space-y-6">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
                        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                        We'll send a verification code to this email
                    </p>
                </div>

                <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !email}
                    className="w-full"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Verification Code
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    We've sent a 6-digit verification code to <strong>{email}</strong>
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    disabled={isLoading}
                    className="text-center text-2xl tracking-widest"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Change Email
                </Button>
                <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || code.length !== 6}
                    className="flex-1"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Code
                </Button>
            </div>

            <Button
                variant="link"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full"
            >
                Resend Code
            </Button>
        </div>
    );
}
