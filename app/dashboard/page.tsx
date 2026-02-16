import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    // Redirect admin to admin panel
    if (userData?.role === 'admin') {
        redirect('/admin');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Welcome back, {user.email}!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                    Application Status
                                </h3>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    Pending
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                                <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
                                    Documents
                                </h3>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    0/7
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                                <h3 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                                    Messages
                                </h3>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    0
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                                🚧 Dashboard Under Construction
                            </h3>
                            <p className="text-yellow-800 dark:text-yellow-200">
                                The full student dashboard is being built. You'll soon be able to:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-yellow-800 dark:text-yellow-200 space-y-1">
                                <li>View your application status in real-time</li>
                                <li>Upload and manage documents</li>
                                <li>Communicate with your agent</li>
                                <li>Track university applications</li>
                                <li>Receive notifications</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
