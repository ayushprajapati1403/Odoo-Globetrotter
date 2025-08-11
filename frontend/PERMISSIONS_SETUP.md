# Trip Permissions System Setup Guide

## Overview

This guide explains the new permission system that replaces the complex `user_trips` table with a simpler, more efficient approach based on direct trip ownership and admin privileges.

## New Permission System

### **Core Principles:**
1. **Trip Ownership**: Users can only edit/delete trips where `user_id` matches their ID
2. **Admin Access**: Admins can edit/delete ALL trips regardless of ownership
3. **Public/Private**: Public trips can be viewed by anyone, private trips only by owners and admins

### **Permission Levels:**
- **Owner**: Full control over their own trips (create, read, update, delete)
- **Admin**: Full control over ALL trips (create, read, update, delete)
- **Viewer**: Read-only access to public trips

## Database Schema

### **Trips Table Structure:**
```sql
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NULL,                    -- Trip owner
  name text NOT NULL,
  description text NULL,
  start_date date NULL,
  end_date date NULL,
  is_public boolean NULL DEFAULT true,  -- Public/private visibility
  cover_photo_url text NULL,
  currency text NULL DEFAULT 'USD',
  total_estimated_cost numeric(12, 2) NULL,
  metadata jsonb NULL DEFAULT '{}',
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  deleted boolean NULL DEFAULT false,
  trip_type text NULL DEFAULT 'custom',
  created_by uuid NULL,                 -- Who created the trip
  CONSTRAINT trips_pkey PRIMARY KEY (id),
  CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

### **Key Changes:**
- ✅ **Removed**: `user_trips` table complexity
- ✅ **Simplified**: Direct ownership through `user_id` field
- ✅ **Efficient**: No more complex joins for permission checks
- ✅ **Scalable**: Easy to add new permission types

## Admin Configuration

### **Option 1: Email-based Admin List**
```typescript
// In frontend/src/utils/permissions.ts
const adminEmails = [
  'admin@yourdomain.com',
  'superuser@yourdomain.com',
  // Add more admin emails
];

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return adminEmails.includes(user.email || '');
};
```

### **Option 2: Database Role Field**
```sql
-- Add role field to users table
ALTER TABLE public.users ADD COLUMN role text DEFAULT 'user';

-- Set admin users
UPDATE public.users SET role = 'admin' WHERE email IN ('admin@yourdomain.com');

-- Create index for performance
CREATE INDEX idx_users_role ON public.users(role);
```

Then update the permission utility:
```typescript
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return data?.role === 'admin';
};
```

### **Option 3: User Metadata**
```typescript
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.isAdmin === true;
};
```

## Component Updates

### **MyTrips Component:**
- ✅ **Simplified data fetching**: Direct query to trips table
- ✅ **Permission checks**: Uses utility functions for clean code
- ✅ **Admin support**: Shows admin badge and allows admin actions
- ✅ **Role display**: Shows user's role for each trip

### **EditTrip Component:**
- ✅ **Permission validation**: Checks if user can edit before loading
- ✅ **Admin access**: Admins can edit any trip
- ✅ **Owner access**: Trip owners can edit their own trips

### **CreateTrip Component:**
- ✅ **Simplified creation**: No more user_trips table entries
- ✅ **Direct ownership**: Sets user_id directly on trip creation

## Migration from Old System

### **If you have existing user_trips data:**

1. **Backup your data:**
```sql
-- Create backup table
CREATE TABLE user_trips_backup AS SELECT * FROM user_trips;
```

2. **Update trips table:**
```sql
-- Set user_id based on user_trips data
UPDATE trips t 
SET user_id = ut.user_id 
FROM user_trips ut 
WHERE t.id = ut.trip_id AND ut.role = 1; -- Assuming role 1 was 'owner'
```

3. **Verify the migration:**
```sql
-- Check that all trips have proper user_id
SELECT COUNT(*) as trips_without_owner 
FROM trips 
WHERE user_id IS NULL;
```

4. **Drop old table (after verification):**
```sql
DROP TABLE user_trips;
```

## Testing the System

### **Test Cases:**

1. **Trip Owner:**
   - ✅ Can view their own trips
   - ✅ Can edit their own trips
   - ✅ Can delete their own trips
   - ✅ Can change trip visibility

2. **Admin User:**
   - ✅ Can view all trips
   - ✅ Can edit all trips
   - ✅ Can delete all trips
   - ✅ Can manage any trip settings

3. **Regular User:**
   - ✅ Can view public trips
   - ❌ Cannot edit trips they don't own
   - ❌ Cannot delete trips they don't own
   - ❌ Cannot access private trips they don't own

### **Testing Commands:**
```sql
-- Check trip ownership
SELECT t.name, t.user_id, u.email as owner_email
FROM trips t
JOIN users u ON t.user_id = u.id
WHERE t.deleted = false;

-- Check admin users
SELECT email, role FROM users WHERE role = 'admin';

-- Verify permissions work
SELECT 
  t.name,
  t.is_public,
  CASE 
    WHEN t.user_id = 'your-user-id' THEN 'Owner'
    ELSE 'Not Owner'
  END as ownership
FROM trips t;
```

## Security Considerations

### **Row Level Security (RLS):**
```sql
-- Enable RLS on trips table
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policy for trip owners
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (user_id = auth.uid());

-- Policy for public trips
CREATE POLICY "Anyone can view public trips" ON trips
  FOR SELECT USING (is_public = true);

-- Policy for trip owners to edit
CREATE POLICY "Users can edit own trips" ON trips
  FOR UPDATE USING (user_id = auth.uid());

-- Policy for trip owners to delete
CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (user_id = auth.uid());
```

### **Admin Override:**
```sql
-- Admin can do everything (add this after other policies)
CREATE POLICY "Admins have full access" ON trips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Performance Benefits

### **Before (with user_trips):**
- ❌ Multiple table joins required
- ❌ Complex permission queries
- ❌ Slower data fetching
- ❌ More complex caching

### **After (direct ownership):**
- ✅ Single table queries
- ✅ Simple permission checks
- ✅ Faster data fetching
- ✅ Easier caching strategies

## Troubleshooting

### **Common Issues:**

1. **"Access Denied" errors:**
   - Check if `user_id` is properly set on trips
   - Verify admin configuration
   - Check user authentication status

2. **Trips not showing:**
   - Verify `deleted = false` filter
   - Check if user_id matches current user
   - Ensure proper database permissions

3. **Admin not working:**
   - Verify admin email/role configuration
   - Check permission utility function
   - Test with known admin user

### **Debug Commands:**
```sql
-- Check current user's trips
SELECT * FROM trips WHERE user_id = 'your-user-id';

-- Check admin status
SELECT role FROM users WHERE id = 'your-user-id';

-- Verify trip ownership
SELECT t.*, u.email as owner_email 
FROM trips t 
JOIN users u ON t.user_id = u.id;
```

## Next Steps

1. **Choose admin configuration method** (email list, database role, or metadata)
2. **Update permission utilities** with your chosen method
3. **Test the system** with different user types
4. **Implement RLS policies** for additional security
5. **Update other components** to use the new permission system

This new system provides a much cleaner, more efficient, and easier-to-maintain permission structure for your trip management application!
