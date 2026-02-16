// Quick script to test Supabase connection
// Run with: node scripts/test-connection.js

require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('🔍 Testing Supabase Connection...\n');

    // Check environment variables
    console.log('Environment Variables:');
    console.log('✓ NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');
    console.log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
    console.log('✓ CLOUDINARY_CLOUD_NAME:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
    console.log('✓ CLOUDINARY_UPLOAD_PRESET:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? '✓ Set' : '✗ Missing');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('\n❌ Missing Supabase credentials. Please update .env.local');
        console.log('\nTo get your anon key:');
        console.log('1. Go to https://supabase.com/dashboard/project/qypkqtzymftsvgiwvtvz/settings/api');
        console.log('2. Copy the "anon public" key');
        console.log('3. Update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
        return;
    }

    // Try to connect to Supabase
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            }
        });

        if (response.ok) {
            console.log('\n✅ Supabase connection successful!');

            // Test if tables exist
            const tablesResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_categories?select=*&limit=1`, {
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                }
            });

            if (tablesResponse.ok) {
                console.log('✅ Database schema is set up correctly!');
                const data = await tablesResponse.json();
                if (data.length > 0) {
                    console.log('✅ Seed data found!');
                }
            } else {
                console.log('\n⚠️  Database tables not found.');
                console.log('Please run the schema.sql file in Supabase SQL Editor.');
                console.log('See SETUP_GUIDE.md for instructions.');
            }
        } else {
            console.log('\n❌ Supabase connection failed');
            console.log('Status:', response.status);
            console.log('Please check your credentials in .env.local');
        }
    } catch (error) {
        console.log('\n❌ Connection error:', error.message);
    }
}

testConnection();
