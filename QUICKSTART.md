# Quick Start Guide

## ✅ Project is Ready!

Your Next.js + Supabase Vertical Reels app is now set up and running!

## 🚀 Access the App

The development server is running at: **http://localhost:3000**

## 📋 Next Steps

### 1. Set Up Supabase Storage Bucket

You need to create a storage bucket for videos:

1. Go to: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/storage/buckets
2. Click "New bucket"
3. Name it: `videos`
4. Make it **Public** (or configure RLS policies if you prefer)
5. Click "Create bucket"

### 2. Set Up Test Credentials

For testing purposes, you have two options:

#### Option A: Disable Email Confirmation (Recommended for Testing)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/auth/providers
2. Scroll down to **Email** provider settings
3. **Disable** "Confirm email" toggle
4. Click "Save"

Now you can create test accounts without email verification!

#### Option B: Create a Test Account

1. Open http://localhost:3000/auth in your browser
2. Click "Don't have an account? Sign up"
3. Enter test credentials:
   - **Email**: `test@example.com` (or any email)
   - **Password**: `test123456` (or any password)
4. Click "Create Account"
5. If email confirmation is enabled, check your email and click the confirmation link
6. If email confirmation is disabled, you'll be logged in immediately!

#### Test Credentials (if you disabled email confirmation)

You can use these credentials to test:
- **Email**: `test@example.com`
- **Password**: `test123456`

Or create your own test account with any email/password combination.

#### Check Existing Users

To see if there are any existing users in your Supabase project:
1. Go to: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/auth/users
2. You'll see a list of all registered users
3. You can reset passwords or manage users from here

### 3. Test the App

1. Open http://localhost:3000 in your browser
2. Sign in with your test credentials
3. Upload a video from the upload page
4. View it in the feed!

## 🎯 What's Included

- ✅ Next.js 16 with App Router
- ✅ Supabase integration (Database + Storage + Auth)
- ✅ Video feed with TikTok-style scrolling
- ✅ Video upload functionality
- ✅ Authentication system
- ✅ Modern UI with Tailwind CSS

## 🔧 Environment Variables

Already configured in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📁 Project Location

The new Next.js project is located at:
```
/Users/macbookpro/Desktop/code/vertical-reels-nextjs
```

## 🆚 Differences from Original

- **No Express server needed** - Next.js handles everything
- **No separate database connection** - Uses Supabase client directly
- **Simpler setup** - Just environment variables, no DATABASE_URL needed
- **Better performance** - Next.js optimizations
- **Easier deployment** - Can deploy to Vercel with one click

## 🐛 Troubleshooting

### Videos not uploading?
- Make sure the `videos` bucket exists in Supabase Storage
- Check that the bucket is public or has proper RLS policies

### Authentication not working?
- Verify your Supabase URL and anon key in `.env.local`
- Check Supabase Auth settings in the dashboard

### Video upload failing with "row-level security policy" error?

This happens when RLS (Row Level Security) is enabled on the `videos` table but no policies allow inserts. You have two options:

#### Option A: Set up RLS Policies (Recommended for Production)

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/sql
2. Run this SQL to allow authenticated users to insert their own videos:

```sql
-- Enable RLS on videos table (if not already enabled)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, for clean setup)
DROP POLICY IF EXISTS "Users can insert their own videos" ON videos;
DROP POLICY IF EXISTS "Anyone can view videos" ON videos;

-- Allow authenticated users to insert videos
CREATE POLICY "Users can insert their own videos"
ON videos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = creator_id);

-- Allow anyone to read videos (for the feed)
CREATE POLICY "Anyone can view videos"
ON videos
FOR SELECT
TO public
USING (true);
```

#### Option B: Use Service Role Key (For Development Only)

1. Get your Service Role Key from: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/settings/api
2. Add it to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** The service role key bypasses RLS, so only use it in development. For production, use Option A.

### Server not starting?
```bash
cd /Users/macbookpro/Desktop/code/vertical-reels-nextjs
npm run dev
```

Enjoy your new Next.js app! 🎉
