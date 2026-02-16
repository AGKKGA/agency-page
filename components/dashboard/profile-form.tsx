"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    city: z.string().optional(),
    postal_code: z.string().optional(),
});

const passwordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

interface ProfileFormProps {
    applicant: {
        phone: string;
        city?: string;
        postal_code?: string;
    };
}

export function ProfileForm({ applicant }: ProfileFormProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const profileForm = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone: applicant.phone,
            city: applicant.city || "",
            postal_code: applicant.postal_code || "",
        },
    });

    const passwordForm = useForm<PasswordData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onUpdateProfile = async (data: ProfileData) => {
        setIsUpdating(true);

        try {
            const response = await fetch("/api/student/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to update profile");
                return;
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const onChangePassword = async (data: PasswordData) => {
        setIsChangingPassword(true);

        try {
            const response = await fetch("/api/student/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to change password");
                return;
            }

            toast.success("Password changed successfully!");
            passwordForm.reset();
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Update Profile */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                        Update your contact details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                            <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={profileForm.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={profileForm.control}
                                    name="postal_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Must be at least 8 characters
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isChangingPassword}>
                                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
