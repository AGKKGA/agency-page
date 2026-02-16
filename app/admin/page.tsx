import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Get user data and check role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    // Redirect non-admin to dashboard
    if (userData?.role !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Welcome, Nadir! Manage your agency platform.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                    Total Applications
                                </h3>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    0
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                                <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
                                    Pending Review
                                </h3>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    0
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                                <h3 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100">
                                    Accepted
                                </h3>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    0
                                </p>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                                <h3 className="text-lg font-semibold mb-2 text-orange-900 dark:text-orange-100">
                                    Blog Posts
                                </h3>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    0
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100">
                                🎨 Admin Panel Features (Coming Soon)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                        Application Management
                                    </h4>
                                    <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 text-sm">
                                        <li>View all applications</li>
                                        <li>Update application status</li>
                                        <li>Send messages to students</li>
                                        <li>Download documents</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                        Website Customization
                                    </h4>
                                    <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 text-sm">
                                        <li>Edit homepage sections</li>
                                        <li>Manage blog posts</li>
                                        <li>Create custom pages</li>
                                        <li>Update site design</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                        Content Management
                                    </h4>
                                    <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 text-sm">
                                        <li>Media library</li>
                                        <li>Testimonials</li>
                                        <li>Partner universities</li>
                                        <li>Email templates</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                        Analytics & Reports
                                    </h4>
                                    <ul className="list-disc list-inside text-indigo-700 dark:text-indigo-300 space-y-1 text-sm">
                                        <li>Application statistics</li>
                                        <li>Conversion rates</li>
                                        <li>Popular destinations</li>
                                        <li>Monthly reports</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
