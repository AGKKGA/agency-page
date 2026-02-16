"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/registration/file-upload";
import { personalInfoSchema, type PersonalInfoData } from "@/lib/validations/registration";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PersonalInfoStepProps {
    data: Partial<PersonalInfoData>;
    onChange: (data: Partial<PersonalInfoData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function PersonalInfoStep({ data, onChange, onNext, onBack }: PersonalInfoStepProps) {
    const form = useForm<PersonalInfoData>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: data as PersonalInfoData,
    });

    const onSubmit = (values: PersonalInfoData) => {
        onChange(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth *</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nationality *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., American" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currentCountry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Country *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., United States" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
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
                        control={form.control}
                        name="postalCode"
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

                <FormField
                    control={form.control}
                    name="profilePictureUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="Profile Picture"
                                folder="profile-pictures"
                                accept="image/*"
                                maxSize={5}
                                currentFile={field.value}
                                onUploadComplete={field.onChange}
                                required
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onBack}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button type="submit" className="flex-1">
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </Form>
    );
}
