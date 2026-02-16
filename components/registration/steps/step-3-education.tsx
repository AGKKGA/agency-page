"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/registration/file-upload";
import { educationSchema, type EducationData } from "@/lib/validations/registration";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EducationStepProps {
    data: Partial<EducationData>;
    onChange: (data: Partial<EducationData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function EducationStep({ data, onChange, onNext, onBack }: EducationStepProps) {
    const form = useForm<EducationData>({
        resolver: zodResolver(educationSchema),
        defaultValues: data as EducationData,
    });

    const onSubmit = (values: EducationData) => {
        onChange(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="highestEducation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highest Education Level *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Bachelor's Degree" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="institutionName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="University Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="institutionCountry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Field of Study *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="graduationYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Graduation Year *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="2024"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gpa"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GPA / Grade *</FormLabel>
                                <FormControl>
                                    <Input placeholder="3.5 / 4.0 or A" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="transcriptUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="Academic Transcript"
                                folder="transcripts"
                                accept="application/pdf,image/*"
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
