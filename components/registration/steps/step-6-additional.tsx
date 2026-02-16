"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { additionalInfoSchema, type AdditionalInfoData } from "@/lib/validations/registration";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdditionalInfoStepProps {
    data: Partial<AdditionalInfoData>;
    onChange: (data: Partial<AdditionalInfoData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function AdditionalInfoStep({ data, onChange, onNext, onBack }: AdditionalInfoStepProps) {
    const form = useForm<AdditionalInfoData>({
        resolver: zodResolver(additionalInfoSchema),
        defaultValues: data as AdditionalInfoData,
    });

    const onSubmit = (values: AdditionalInfoData) => {
        onChange(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="howHeardAboutUs"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>How did you hear about us?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="google">Google Search</SelectItem>
                                    <SelectItem value="social-media">Social Media</SelectItem>
                                    <SelectItem value="friend">Friend/Family</SelectItem>
                                    <SelectItem value="advertisement">Advertisement</SelectItem>
                                    <SelectItem value="education-fair">Education Fair</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="referrerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Referrer Name (if applicable)</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of person who referred you" {...field} />
                            </FormControl>
                            <FormDescription>
                                If someone referred you to our services, please provide their name
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specialNotes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Special Notes / Requirements</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any special requirements or additional information you'd like to share..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    I accept the terms and conditions *
                                </FormLabel>
                                <FormDescription>
                                    By checking this box, you agree to our terms of service and privacy policy
                                </FormDescription>
                                <FormMessage />
                            </div>
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
