import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function ProfilePage() {
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
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and view your application information
                    </p>
                </div>

                {/* Application Information (Read-only) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application Information</CardTitle>
                        <CardDescription>
                            This information was submitted with your application and cannot be edited
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-3">Personal Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Name:</span>{" "}
                                        <span className="font-medium">{applicant.first_name} {applicant.last_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Date of Birth:</span>{" "}
                                        <span className="font-medium">{new Date(applicant.date_of_birth).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Gender:</span>{" "}
                                        <span className="font-medium capitalize">{applicant.gender || 'Not specified'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Nationality:</span>{" "}
                                        <span className="font-medium">{applicant.nationality}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Country:</span>{" "}
                                        <span className="font-medium">{applicant.current_country}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Education Background</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Highest Education:</span>{" "}
                                        <span className="font-medium">{applicant.highest_education}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Institution:</span>{" "}
                                        <span className="font-medium">{applicant.institution_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Field of Study:</span>{" "}
                                        <span className="font-medium">{applicant.field_of_study}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Graduation Year:</span>{" "}
                                        <span className="font-medium">{applicant.graduation_year}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">GPA:</span>{" "}
                                        <span className="font-medium">{applicant.gpa}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Application Preferences</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Desired Country:</span>{" "}
                                        <span className="font-medium">{applicant.desired_country}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Program Level:</span>{" "}
                                        <span className="font-medium capitalize">{applicant.desired_program_level}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Desired Field:</span>{" "}
                                        <span className="font-medium">{applicant.desired_field}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Preferred Intake:</span>{" "}
                                        <span className="font-medium capitalize">{applicant.preferred_intake}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Budget Range:</span>{" "}
                                        <span className="font-medium">{applicant.budget_range}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Account Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Email:</span>{" "}
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Reference Number:</span>{" "}
                                        <span className="font-medium">{applicant.reference_number}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Status:</span>{" "}
                                        <span className="font-medium capitalize">{applicant.status}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Submitted:</span>{" "}
                                        <span className="font-medium">{new Date(applicant.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Editable Profile Information */}
                <ProfileForm applicant={applicant} />
            </div>
        </DashboardLayout>
    );
}
