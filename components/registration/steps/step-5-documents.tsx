"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/registration/file-upload";
import { documentsSchema, type DocumentsData } from "@/lib/validations/registration";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentsStepProps {
    data: Partial<DocumentsData>;
    onChange: (data: Partial<DocumentsData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function DocumentsStep({ data, onChange, onNext, onBack }: DocumentsStepProps) {
    const form = useForm<DocumentsData>({
        resolver: zodResolver(documentsSchema),
        defaultValues: data as DocumentsData,
    });

    const onSubmit = (values: DocumentsData) => {
        onChange(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="passportUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="Passport"
                                folder="passports"
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

                <FormField
                    control={form.control}
                    name="cvUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="CV / Resume"
                                folder="cvs"
                                accept="application/pdf"
                                maxSize={5}
                                currentFile={field.value}
                                onUploadComplete={field.onChange}
                                required
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="englishTestUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="English Test (IELTS/TOEFL)"
                                folder="english-tests"
                                accept="application/pdf,image/*"
                                maxSize={5}
                                currentFile={field.value || ""}
                                onUploadComplete={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="motivationLetterUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FileUpload
                                label="Motivation Letter"
                                folder="motivation-letters"
                                accept="application/pdf"
                                maxSize={5}
                                currentFile={field.value || ""}
                                onUploadComplete={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Recommendation letters and other certificates can be uploaded in the next step or later through your dashboard.
                    </p>
                </div>

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
