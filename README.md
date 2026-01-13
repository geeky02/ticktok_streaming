# Vertical Reels - Next.js + Supabase

A TikTok-like vertical video feed application built with Next.js and Supabase.

## Features

- 📱 Vertical video feed (TikTok-style scrolling)
- 🎥 Video upload to Supabase Storage
- 🔐 Authentication with Supabase Auth
- 📊 Video metadata management
- 🎨 Modern UI with Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xvqncrmtwddckrfzzxos.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cW5jcm10d2RkY2tyZnp6eG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDI0NTIsImV4cCI6MjA4Mzc3ODQ1Mn0.wNCejFgaf30xGmJ_MDN__8pszweQWAdXod1tfRBstag

# Optional: For admin operations
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Set Up Supabase Storage

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xvqncrmtwddckrfzzxos/storage/buckets
2. Create a storage bucket named `videos`
3. Make it public (or configure RLS policies as needed)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vertical-reels-nextjs/
├── app/
│   ├── api/              # API routes
│   │   ├── videos/       # Video CRUD operations
│   │   └── upload-url/   # Signed upload URL generation
│   ├── auth/             # Authentication page
│   ├── upload/            # Video upload page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Feed page (home)
│   └── providers.tsx      # React Query provider
├── components/
│   ├── ui/                # UI components (Button, Input, Toast)
│   ├── VideoPlayer.tsx    # Video player component
│   └── Navbar.tsx         # Navigation bar
├── hooks/
│   ├── use-auth.ts        # Authentication hook
│   ├── use-videos.ts      # Video data hooks
│   └── use-toast.ts       # Toast notifications
└── lib/
    ├── supabase.ts        # Client-side Supabase client
    ├── supabase-server.ts # Server-side Supabase client
    └── utils.ts           # Utility functions
```

## Database Schema

The `videos` table structure:

- `id` (UUID, primary key)
- `creator_id` (TEXT) - User ID from Supabase Auth
- `video_url` (TEXT) - URL to video in Supabase Storage
- `thumbnail_url` (TEXT, optional)
- `description` (TEXT, optional)
- `aspect_ratio` (TEXT, optional)
- `duration` (INTEGER, optional)
- `created_at` (TIMESTAMP)

## API Routes

### GET `/api/videos`
Fetch videos with optional pagination:
- `cursor` (query param): Timestamp cursor for pagination
- `limit` (query param): Number of videos to fetch (default: 10)

### POST `/api/videos`
Create a new video record:
```json
{
  "creator_id": "user-id",
  "video_url": "https://...",
  "description": "Video caption",
  "duration": 30,
  "aspect_ratio": "9:16"
}
```

### POST `/api/upload-url`
Get a signed URL for uploading to Supabase Storage:
```json
{
  "filename": "video.mp4",
  "contentType": "video/mp4"
}
```

## Technologies

- **Next.js 16** - React framework
- **Supabase** - Backend (Database, Storage, Auth)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Framer Motion** - Animations

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Notes

- Videos are stored in Supabase Storage bucket named `videos`
- Authentication uses Supabase Auth
- The app uses server-side Supabase client for API routes
- Client-side uses the anon key for user operations
