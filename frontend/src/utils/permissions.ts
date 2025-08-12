import { User } from '@supabase/supabase-js';

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_public: boolean;
  cover_photo_url: string | null;
  currency: string;
  total_estimated_cost: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  trip_type: string;
  created_by: string | null;
}

/**
 * Check if the current user is an admin
 * This function should be customized based on your admin identification logic
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // Option 1: Check if user has admin role in your users table
  // You can implement this by checking a role field in your users table
  
  // Option 2: Check if user email is in admin list
  // Add admin email addresses here to grant admin privileges
  const adminEmails = [
    'admin@travelpro.com',
    'superuser@travelpro.com',
    'test@example.com',
    'prajapatiayush1403@gmail.com', // For testing purposes 
    // Add more admin emails as needed
  ];
  
  return adminEmails.includes(user.email || '');
  
  // Option 3: Check user metadata for admin flag
  // return user.user_metadata?.isAdmin === true;
};

/**
 * Check if the current user owns a trip
 */
export const isTripOwner = (trip: Trip, user: User | null): boolean => {
  if (!user) return false;
  return trip.user_id === user.id;
};

/**
 * Check if the current user can edit a trip
 */
export const canEditTrip = (trip: Trip, user: User | null): boolean => {
  if (!user) return false;
  
  // Admins can edit all trips
  if (isAdmin(user)) return true;
  
  // Trip owners can edit their own trips
  return isTripOwner(trip, user);
};

/**
 * Check if the current user can delete a trip
 */
export const canDeleteTrip = (trip: Trip, user: User | null): boolean => {
  if (!user) return false;
  
  // Admins can delete all trips
  if (isAdmin(user)) return true;
  
  // Only trip owners can delete their own trips
  return isTripOwner(trip, user);
};

/**
 * Check if the current user can view a trip
 */
export const canViewTrip = (trip: Trip, user: User | null): boolean => {
  if (!user) return false;
  
  // Admins can view all trips
  if (isAdmin(user)) return true;
  
  // Trip owners can view their own trips
  if (isTripOwner(trip, user)) return true;
  
  // Public trips can be viewed by anyone
  if (trip.is_public) return true;
  
  // Private trips can only be viewed by owners and admins
  return false;
};

/**
 * Get user's role for a specific trip
 */
export const getTripRole = (trip: Trip, user: User | null): string => {
  if (!user) return 'none';
  
  if (isAdmin(user)) return 'admin';
  if (isTripOwner(trip, user)) return 'owner';
  
  return 'viewer';
};
