"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { applicationDetailsSchema, type ApplicationDetailsData } from "@/lib/validations/registration";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ApplicationStepProps {
    data: Partial<ApplicationDetailsData>;
    onChange: (data: Partial<ApplicationDetailsData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ApplicationStep({ data, onChange, onNext, onBack }: ApplicationStepProps) {
    const form = useForm<ApplicationDetailsData>({
        resolver: zodResolver(applicationDetailsSchema),
        defaultValues: data as ApplicationDetailsData,
    });

    const onSubmit = (values: ApplicationDetailsData) => {
        onChange(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="desiredCountry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desired Study Country *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., United Kingdom" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="desiredProgramLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Program Level *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select program level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                    <SelectItem value="master">Master's Degree</SelectItem>
                                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                                    <SelectItem value="diploma">Diploma</SelectItem>
                                    <SelectItem value="certificate">Certificate</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="desiredField"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desired Field of Study *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Data Science" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="preferredIntake"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Intake *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select intake" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="fall">Fall (September/October)</SelectItem>
                                    <SelectItem value="spring">Spring (January/February)</SelectItem>
                                    <SelectItem value="summer">Summer (May/June)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget Range (per year) *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select budget range" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                                    <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
                                    <SelectItem value="20k-30k">$20,000 - $30,000</SelectItem>
                                    <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                                    <SelectItem value="over-50k">Over $50,000</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="needScholarship"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>I need scholarship assistance</FormLabel>
                                <FormDescription>
                                    Check this if you're looking for scholarship opportunities
                                </FormDescription>
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
