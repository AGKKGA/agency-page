"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        async function verifyToken() {
            try {
                const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
                setIsValidToken(response.ok);
            } catch (error) {
                setIsValidToken(false);
            }
        }

        verifyToken();
    }, [token]);

    async function onSubmit(data: ResetPasswordFormData) {
        if (!token) return;
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to reset password");
                return;
            }

            toast.success("Password reset successful!");
            router.push("/login");
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isValidToken === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Invalid Link</CardTitle>
                        <CardDescription className="text-center">
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Button asChild className="w-full">
                                <Link href="/forgot-password">Request New Link</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/login">Back to Login</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">Enter your new password below</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reset Password
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
