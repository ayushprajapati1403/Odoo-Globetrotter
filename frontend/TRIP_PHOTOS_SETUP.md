# Trip Photo Storage Setup Guide

This guide explains how to set up and use the new trip photo storage system that stores cover photos in Supabase Storage instead of full URLs.

## Overview

The system now stores trip cover photos in a Supabase Storage bucket called `trip` and stores only the storage path in the database. This provides better security, cost control, and easier management.

## Database Changes

### 1. Update the trips table

```sql
-- Update the trips table to store storage paths instead of full URLs
ALTER TABLE public.trips 
ALTER COLUMN cover_photo_url TYPE character varying(255);

-- Add a comment to clarify the field usage
COMMENT ON COLUMN public.trips.cover_photo_url IS 'Storage path for trip cover photo (e.g., trip/uuid/filename.jpg)';
```

## Storage Setup

### 1. Create the trip storage bucket

In your Supabase dashboard:
1. Go to Storage
2. Click "Create a new bucket"
3. Name: `trip`
4. Public bucket: ✅ (for public trip photos)
5. File size limit: 5MB
6. Allowed MIME types: `image/*`

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on the trip storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### 3. Set up RLS policies

```sql
-- Policy for users to upload trip cover photos (only to their own trips)
CREATE POLICY "Users can upload trip cover photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'trip' AND 
  auth.uid()::text = (
    SELECT user_id::text 
    FROM public.trips 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Policy for users to view trip cover photos (public trips or their own trips)
CREATE POLICY "Users can view trip cover photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'trip' AND (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE id::text = (storage.foldername(name))[1] 
      AND (is_public = true OR user_id = auth.uid())
    )
  )
);

-- Policy for users to update trip cover photos (only their own trips)
CREATE POLICY "Users can update trip cover photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'trip' AND 
  auth.uid()::text = (
    SELECT user_id::text 
    FROM public.trips 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Policy for users to delete trip cover photos (only their own trips)
CREATE POLICY "Users can delete trip cover photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'trip' AND 
  auth.uid()::text = (
    SELECT user_id::text 
    FROM public.trips 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Admin can manage all trip photos
CREATE POLICY "Admins can manage all trip photos" ON storage.objects
FOR ALL USING (
  bucket_id = 'trip' AND 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Code Changes Made

### 1. CreateTrip.tsx
- Updated `TripFormData` interface to allow `null` for `cover_photo_url`
- Modified `handlePhotoUpload` to upload to Supabase Storage
- Photos are initially uploaded to `trip/temp/` and moved to `trip/{tripId}/` after trip creation
- Updated image preview to use Supabase Storage URLs

### 2. EditTrip.tsx
- Updated `TripFormData` interface to allow `null` for `cover_photo_url`
- Modified `handlePhotoUpload` to upload to Supabase Storage
- Photos are initially uploaded to `trip/temp/` and moved to `trip/{tripId}/` after trip update
- Old photos are deleted when new ones are uploaded
- Updated image preview to use Supabase Storage URLs

### 3. MyTrips.tsx
- Updated trip card images to use Supabase Storage URLs
- Images now display from `supabase.storage.from('trip').getPublicUrl(path).data.publicUrl`

### 4. TripSuggestions.tsx
- Added cover photo display to admin trip suggestions
- Images now display from Supabase Storage with proper styling

## How It Works

### 1. Photo Upload Process
1. User selects a photo file
2. File is validated (type, size)
3. Photo is uploaded to `trip/temp/{filename}` in Supabase Storage
4. Temporary path is stored in form state
5. When trip is created/updated, photo is moved to `trip/{tripId}/{filename}`
6. Temporary file is deleted
7. Database is updated with the final storage path

### 2. Photo Display Process
1. Component reads `cover_photo_url` from trip data
2. Uses `supabase.storage.from('trip').getPublicUrl(path).data.publicUrl` to generate public URL
3. Displays image with proper fallback handling

### 3. Security Features
- RLS policies ensure users can only access photos for trips they own or public trips
- Temporary uploads are cleaned up automatically
- File type and size validation
- Unique filename generation prevents conflicts

## File Structure

```
trip/
├── temp/           # Temporary uploads (cleaned up after processing)
├── {tripId1}/     # Trip 1 photos
│   ├── photo1.jpg
│   └── photo2.png
├── {tripId2}/     # Trip 2 photos
│   └── cover.jpg
└── ...
```

## Benefits

1. **Security**: RLS policies control access to photos
2. **Cost Control**: No external URL storage costs
3. **Management**: Centralized storage management
4. **Performance**: CDN benefits from Supabase
5. **Scalability**: Easy to implement photo optimization later

## Troubleshooting

### Common Issues

1. **403 Forbidden on upload**
   - Check RLS policies are properly set
   - Verify user is authenticated
   - Ensure trip ownership

2. **Photos not displaying**
   - Check storage bucket exists and is public
   - Verify RLS policies allow viewing
   - Check console for storage errors

3. **Upload failures**
   - Verify file size < 5MB
   - Check file type is image/*
   - Ensure storage bucket has proper permissions

### Debug Steps

1. Check browser console for storage errors
2. Verify RLS policies in Supabase dashboard
3. Test storage bucket permissions
4. Check file upload limits and types

## Future Enhancements

1. **Image Optimization**: Implement automatic resizing and compression
2. **Multiple Photos**: Support for photo galleries per trip
3. **Photo Management**: Bulk upload and organization tools
4. **CDN Integration**: Custom domain for faster photo delivery
5. **Backup System**: Automatic backup to external storage

## Testing

### Test Cases

1. **Create Trip with Photo**
   - Upload photo during trip creation
   - Verify photo appears in trip list
   - Check photo is stored in correct location

2. **Edit Trip Photo**
   - Change photo on existing trip
   - Verify old photo is deleted
   - Check new photo displays correctly

3. **Public vs Private Photos**
   - Create public trip with photo
   - Verify other users can see photo
   - Test private trip photo access

4. **Photo Deletion**
   - Delete trip with photo
   - Verify photo is removed from storage
   - Check storage cleanup

5. **Admin Access**
   - Test admin ability to manage all photos
   - Verify admin can view/edit any trip photo

This setup provides a robust, secure, and scalable solution for trip photo management while maintaining good user experience and performance.
