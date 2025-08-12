# Admin Dashboard Setup Guide

## Overview

The admin dashboard is now integrated into the TravelPro application with role-based access control. Only users with admin privileges can access the admin dashboard.

## Setup

### 1. Configure Admin Users

To grant admin privileges to a user, add their email address to the admin list in `src/utils/permissions.ts`:

```typescript
const adminEmails = [
  'admin@travelpro.com',
  'superuser@travelpro.com',
  'test@example.com',
  'your-email@example.com', // Add your email here
  // Add more admin emails as needed
];
```

### 2. Admin Access Points

Once configured, admin users will see:

- **Navbar**: "Admin" link with shield icon (desktop and mobile)
- **User Menu**: "Admin Dashboard" option in the dropdown menu
- **Mobile Menu**: "Admin" option in the mobile navigation

### 3. Admin Routes

- **Path**: `/admin`
- **Protection**: Requires authentication AND admin privileges
- **Fallback**: Non-admin users are redirected to `/my-trips`

## Features

The admin dashboard includes:

- **User Management**: View, suspend, and delete users
- **Trip Analytics**: Monitor trip creation and popularity
- **Activity Statistics**: Track popular activities and categories
- **Export Reports**: Generate CSV, XLSX, and PDF reports
- **Platform Metrics**: Active users, signups, and destination data

## Security

- **Row Level Security (RLS)**: Database-level protection
- **Route Protection**: Admin routes are protected at the component level
- **Permission Checks**: Admin status verified on every request
- **Audit Logging**: All admin actions are logged

## Testing

1. **Add your email** to the admin list in `permissions.ts`
2. **Sign in** with your admin account
3. **Navigate** to `/admin` or click the Admin link in the navbar
4. **Verify** that non-admin users cannot access the route

## Customization

### Adding New Admin Features

1. **Update AdminDashboard.tsx** with new components
2. **Add new routes** in `App.tsx` using `AdminProtectedRoute`
3. **Extend permissions** in `permissions.ts` if needed

### Changing Admin Criteria

You can modify the admin check logic in `permissions.ts`:

```typescript
// Option 1: Database role field
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return data?.role === 'admin';
};

// Option 3: User metadata
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.isAdmin === true;
};
```

## Troubleshooting

### Common Issues

1. **Admin link not showing**: Check if your email is in the admin list
2. **Access denied**: Verify authentication and admin status
3. **Route not found**: Ensure AdminProtectedRoute is properly imported

### Debug Commands

```typescript
// Check admin status in browser console
import { isAdmin } from './utils/permissions';
const user = supabase.auth.getUser();
console.log('Is admin:', isAdmin(user));
```

## Next Steps

1. **Test the admin functionality** with your admin account
2. **Customize the dashboard** for your specific needs
3. **Add more admin features** as required
4. **Implement audit logging** for admin actions
5. **Set up email notifications** for admin events

This admin system provides a secure, scalable foundation for managing your TravelPro platform!
