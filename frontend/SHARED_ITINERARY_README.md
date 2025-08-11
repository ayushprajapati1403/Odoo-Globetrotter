# Shared Itinerary Functionality

This document explains how to use the shared itinerary feature in the travel app.

## Overview

The shared itinerary feature allows users to share their trip plans with others via public URLs. Anyone with the link can view the trip details without needing to create an account.

## How It Works

### 1. Creating a Shared Link

Users can share their trips by clicking the share button (📤) in the My Trips page:

```typescript
// When user clicks share button
const handleShareTrip = async (tripId: string) => {
  const { data, error } = await tripService.createSharedLink(tripId);
  if (data) {
    const shareUrl = `${window.location.origin}/shared/${data.token}`;
    await navigator.clipboard.writeText(shareUrl);
    // Show success message
  }
};
```

### 2. Database Structure

The shared links are stored in the `shared_links` table:

```sql
CREATE TABLE public.shared_links (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid REFERENCES public.trips(id),
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
```

### 3. Viewing Shared Itineraries

Shared itineraries are accessible via the `/shared/:token` route:

```typescript
// Route in App.tsx
<Route path="/shared/:token" element={<SharedItinerary />} />

// Component fetches data using token
const { token } = useParams<{ token: string }>();
const { data, error } = await sharedTripService.getSharedTripByToken(token);
```

## Features

### Public Access
- No authentication required to view shared trips
- Responsive design for mobile and desktop
- Beautiful UI with trip statistics

### Trip Information Displayed
- Trip name and description
- Cover photo
- Date range and duration
- Cities visited
- Total estimated cost
- Creator information
- Detailed itinerary with activities

### Sharing Options
- Copy link to clipboard
- Social media sharing (Facebook, Twitter, WhatsApp, Email)
- QR code generation (planned feature)

## Security Considerations

1. **Trip Privacy**: Only trips marked as `is_public = true` can be shared
2. **Token Generation**: Unique tokens are generated for each shared link
3. **Expiration**: Links can have optional expiration dates
4. **Access Control**: Shared links only show trip data, no editing capabilities

## Database Queries

### Fetching Shared Trip
```typescript
const { data, error } = await supabase
  .from('shared_links')
  .select(`
    *,
    trip: trips (
      *,
      user: users (id, name, email),
      trip_stops (
        *,
        city: cities (*, currency: currencies (*)),
        trip_activities (
          *,
          activity: activities (*, currency: currencies (*))
        )
      )
    )
  `)
  .eq('token', token)
  .eq('trip.deleted', false)
  .eq('trip.is_public', true)
  .single();
```

### Creating Shared Link
```typescript
const token = Math.random().toString(36).substring(2, 15) + 
              Math.random().toString(36).substring(2, 15);

const { data, error } = await supabase
  .from('shared_links')
  .insert({
    trip_id: tripId,
    token,
    expires_at: expiresAt
  })
  .select()
  .single();
```

## Usage Examples

### For Trip Creators
1. Go to My Trips page
2. Click the share button (📤) on any trip
3. Share link is automatically copied to clipboard
4. Send the link to friends, family, or post on social media

### For Trip Viewers
1. Click on a shared trip link
2. View the complete itinerary
3. See all planned activities, costs, and dates
4. Option to copy the trip to their own account (if authenticated)

## Future Enhancements

- [ ] QR code generation for easy mobile sharing
- [ ] Link expiration management
- [ ] Analytics tracking (views, shares)
- [ ] Comment system on shared trips
- [ ] Collaborative trip planning
- [ ] Export to PDF/Calendar formats

## Troubleshooting

### Common Issues

1. **"Trip not found" error**
   - Check if the trip exists and is public
   - Verify the token is correct
   - Ensure the trip hasn't been deleted

2. **"This trip is private" error**
   - Only public trips can be shared
   - Trip creator must set `is_public = true`

3. **Database connection issues**
   - Verify Supabase configuration
   - Check environment variables
   - Ensure database tables exist

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs
3. Test database connection
4. Validate token format
5. Check trip permissions

## API Endpoints

- `GET /shared/:token` - View shared itinerary
- `POST /api/shared-links` - Create shared link (internal)
- `DELETE /api/shared-links/:id` - Delete shared link (internal)

## Dependencies

- React Router for navigation
- Supabase for database operations
- Lucide React for icons
- Tailwind CSS for styling
- React hooks for state management
