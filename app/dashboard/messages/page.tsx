import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default async function MessagesPage() {
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

    // TODO: Fetch messages from database when messages table is created
    const messages: any[] = [];

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
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-muted-foreground mt-1">
                        View messages from your application advisor
                    </p>
                </div>

                {messages.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-md">
                                You don't have any messages at the moment. Your application advisor will send you updates and important information here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message: any) => (
                            <Card key={message.id}>
                                <CardHeader>
                                    <CardTitle>{message.subject}</CardTitle>
                                    <CardDescription>
                                        {new Date(message.created_at).toLocaleDateString()} at{' '}
                                        {new Date(message.created_at).toLocaleTimeString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
