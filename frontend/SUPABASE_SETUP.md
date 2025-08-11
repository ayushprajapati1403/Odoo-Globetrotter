# Supabase Setup Guide

This guide will help you connect your React frontend to Supabase.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Installation

1. Install Supabase dependencies:
```bash
npm install @supabase/supabase-js
```

## Environment Configuration

1. Copy the `env.example` file to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit `.env.local` and add your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Run the database schema provided in the project requirements
3. Make sure to enable Row Level Security (RLS) policies for your tables

## Authentication Setup

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your authentication providers (Email, Google, etc.)
3. Set up email templates if using email authentication

## Row Level Security (RLS) Policies

Here are some example RLS policies you might need:

### Users table
```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Trips table
```sql
-- Users can see their own trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create trips
CREATE POLICY "Users can create trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own trips
CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own trips
CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);
```

### Cities table (public read access)
```sql
-- Anyone can read cities
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);
```

### Activities table (public read access)
```sql
-- Anyone can read activities
CREATE POLICY "Activities are viewable by everyone" ON activities
  FOR SELECT USING (true);
```

## Usage

The frontend is now configured with:

1. **Supabase Client** (`src/lib/supabase.ts`) - Main client configuration
2. **Authentication Context** (`src/contexts/AuthContext.tsx`) - User authentication state management
3. **Database Services** (`src/services/database.ts`) - Functions for database operations
4. **TypeScript Types** - Full type safety for your database schema

## Testing the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. Try signing up/signing in to test authentication

## Troubleshooting

- **Environment variables not loading**: Make sure your `.env.local` file is in the root directory
- **CORS errors**: Check your Supabase project settings for allowed origins
- **RLS policy errors**: Verify your RLS policies are correctly configured
- **Type errors**: Make sure all Supabase dependencies are properly installed

## Next Steps

1. Update your components to use the `useAuth` hook for authentication
2. Replace hardcoded data with calls to the database services
3. Implement proper error handling for database operations
4. Add loading states for async operations
