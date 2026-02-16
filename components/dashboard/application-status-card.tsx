"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ApplicationStatusCardProps {
    status: string;
    referenceNumber: string;
    submittedAt: string;
    updatedAt: string;
}

const statusConfig = {
    pending: {
        label: "Pending Review",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock,
        description: "Your application is waiting to be reviewed by our team.",
    },
    under_review: {
        label: "Under Review",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: AlertCircle,
        description: "Our team is currently reviewing your application.",
    },
    approved: {
        label: "Approved",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: CheckCircle,
        description: "Congratulations! Your application has been approved.",
    },
    rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: XCircle,
        description: "Unfortunately, your application was not approved.",
    },
    submitted: {
        label: "Submitted to Universities",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: CheckCircle,
        description: "Your application has been submitted to universities.",
    },
};

export function ApplicationStatusCard({
    status,
    referenceNumber,
    submittedAt,
    updatedAt,
}: ApplicationStatusCardProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Application Status</CardTitle>
                    <Badge className={config.color}>{config.label}</Badge>
                </div>
                <CardDescription>Reference: {referenceNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-sm">{config.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium">
                            {new Date(submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">
                            {new Date(updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {status === "pending" && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Next Steps:</strong> Our team will review your application within 3-5 business days. You'll receive an email notification once the review is complete.
                        </p>
                    </div>
                )}

                {status === "under_review" && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>In Progress:</strong> We're carefully reviewing your documents and information. We may contact you if we need any additional information.
                        </p>
                    </div>
                )}

                {status === "approved" && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            <strong>Congratulations!</strong> We'll now proceed with submitting your application to your desired universities. Check your messages for more details.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
