import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DocumentsPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Get applicant data
    const { data: applicant } = await supabase
        .from('applicants')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!applicant) {
        redirect('/register');
    }

    const documents = [
        {
            name: 'Profile Picture',
            url: applicant.profile_picture_url,
            type: 'image',
            required: true,
        },
        {
            name: 'Passport',
            url: applicant.passport_url,
            type: 'document',
            required: true,
        },
        {
            name: 'CV / Resume',
            url: applicant.cv_url,
            type: 'document',
            required: true,
        },
        {
            name: 'Academic Transcript',
            url: applicant.transcript_url,
            type: 'document',
            required: true,
        },
        {
            name: 'English Test (IELTS/TOEFL)',
            url: applicant.english_test_url,
            type: 'document',
            required: false,
        },
        {
            name: 'Motivation Letter',
            url: applicant.motivation_letter_url,
            type: 'document',
            required: false,
        },
    ];

    // Add recommendation letters
    if (applicant.recommendation_letters && applicant.recommendation_letters.length > 0) {
        applicant.recommendation_letters.forEach((url: string, index: number) => {
            documents.push({
                name: `Recommendation Letter ${index + 1}`,
                url,
                type: 'document',
                required: false,
            });
        });
    }

    // Add other certificates
    if (applicant.other_certificates && applicant.other_certificates.length > 0) {
        applicant.other_certificates.forEach((url: string, index: number) => {
            documents.push({
                name: `Certificate ${index + 1}`,
                url,
                type: 'document',
                required: false,
            });
        });
    }

    return (
        <DashboardLayout
            user={{
                name: `${applicant.first_name} ${applicant.last_name}`,
                email: user.email!,
                avatar: applicant.profile_picture_url,
            }}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage your uploaded documents
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> If you need to update any documents, please contact our support team or send a message through the Messages section.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-base">{doc.name}</CardTitle>
                                    </div>
                                    {doc.required && (
                                        <Badge variant="outline" className="text-xs">
                                            Required
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {doc.url ? (
                                    <div className="space-y-2">
                                        {doc.type === 'image' && (
                                            <img
                                                src={doc.url}
                                                alt={doc.name}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex gap-2">
                                            <Button asChild size="sm" variant="outline" className="flex-1">
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View
                                                </a>
                                            </Button>
                                            <Button asChild size="sm" variant="outline" className="flex-1">
                                                <a href={doc.url} download>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                        <Badge className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Uploaded
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-muted-foreground">Not uploaded</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
