import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApplicationStatusCard } from '@/components/dashboard/application-status-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Clock } from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Get user role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role !== 'student') {
        redirect('/admin');
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

    // Count documents
    const documentCount = [
        applicant.passport_url,
        applicant.cv_url,
        applicant.transcript_url,
        applicant.english_test_url,
        applicant.motivation_letter_url,
        ...(applicant.recommendation_letters || []),
        ...(applicant.other_certificates || []),
    ].filter(Boolean).length;

    // Get messages count (we'll create this table later)
    // For now, just use 0
    const messagesCount = 0;

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
                    <h1 className="text-3xl font-bold">Welcome back, {applicant.first_name}!</h1>
                    <p className="text-muted-foreground mt-1">
                        Here's an overview of your application
                    </p>
                </div>

                {/* Application Status */}
                <ApplicationStatusCard
                    status={applicant.status}
                    referenceNumber={applicant.reference_number}
                    submittedAt={applicant.created_at}
                    updatedAt={applicant.updated_at}
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Documents Uploaded
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{documentCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Total files submitted
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Messages
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{messagesCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Unread messages
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Days Since Submission
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.floor(
                                    (new Date().getTime() - new Date(applicant.created_at).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Application age
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Application Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application Details</CardTitle>
                        <CardDescription>
                            Your submitted application information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Desired Country</p>
                                <p className="text-base">{applicant.desired_country}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Program Level</p>
                                <p className="text-base capitalize">{applicant.desired_program_level}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Field of Study</p>
                                <p className="text-base">{applicant.desired_field}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Preferred Intake</p>
                                <p className="text-base capitalize">{applicant.preferred_intake}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                                <p className="text-base">{applicant.budget_range}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Scholarship</p>
                                <p className="text-base">{applicant.need_scholarship ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
