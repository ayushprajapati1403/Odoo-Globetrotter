import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// User operations
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async updateProfile(userId: string, updates: Partial<Tables['users']['Update']>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async createProfile(profile: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  }
}

// Trip operations
export const tripService = {
  async getUserTrips(userId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_stops (
          *,
          city: cities (*)
        )
      `)
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getTrip(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_stops (
          *,
          city: cities (*),
          trip_activities (
            *,
            activity: activities (*)
          )
        )
      `)
      .eq('id', tripId)
      .eq('deleted', false)
      .single()
    return { data, error }
  },

  async createTrip(trip: Tables['trips']['Insert']) {
    const { data, error } = await supabase
      .from('trips')
      .insert(trip)
      .select()
      .single()
    return { data, error }
  },

  async updateTrip(tripId: string, updates: Tables['trips']['Update']) {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single()
    return { data, error }
  },

  async deleteTrip(tripId: string) {
    const { error } = await supabase
      .from('trips')
      .update({ deleted: true })
      .eq('id', tripId)
    return { error }
  },

  async createSharedLink(tripId: string, expiresAt?: string) {
    const { data, error } = await sharedTripService.createSharedLink(tripId, expiresAt);
    return { data, error };
  },

  async getSharedLink(tripId: string) {
    const { data, error } = await sharedTripService.getSharedLink(tripId);
    return { data, error };
  }
}

// City operations
export const cityService = {
  async searchCities(query: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .or(`name.ilike.%${query}%,country.ilike.%${query}%`)
      .order('popularity_score', { ascending: false })
      .limit(10)
    return { data, error }
  },

  async getPopularCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('popularity_score', { ascending: false })
      .limit(12)
    return { data, error }
  },

  async getCity(cityId: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', cityId)
      .single()
    return { data, error }
  }
}

// Activity operations
export const activityService = {
  async getCityActivities(cityId: string) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('city_id', cityId)
      .eq('deleted', false)
      .order('name')
    return { data, error }
  },

  async searchActivities(query: string, cityId?: string) {
    let queryBuilder = supabase
      .from('activities')
      .select('*')
      .eq('deleted', false)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    if (cityId) {
      queryBuilder = queryBuilder.eq('city_id', cityId)
    }

    const { data, error } = await queryBuilder.order('name')
    return { data, error }
  }
}

// Trip Stop operations
export const tripStopService = {
  async createTripStop(tripStop: Tables['trip_stops']['Insert']) {
    const { data, error } = await supabase
      .from('trip_stops')
      .insert(tripStop)
      .select()
      .single()
    return { data, error }
  },

  async updateTripStop(stopId: string, updates: Tables['trip_stops']['Update']) {
    const { data, error } = await supabase
      .from('trip_stops')
      .update(updates)
      .eq('id', stopId)
      .select()
      .single()
    return { data, error }
  },

  async deleteTripStop(stopId: string) {
    const { error } = await supabase
      .from('trip_stops')
      .delete()
      .eq('id', stopId)
    return { error }
  }
}

// Trip Activity operations
export const tripActivityService = {
  async createTripActivity(activity: Tables['trip_activities']['Insert']) {
    const { data, error } = await supabase
      .from('trip_activities')
      .insert(activity)
      .select()
      .single()
    return { data, error }
  },

  async updateTripActivity(activityId: string, updates: Tables['trip_activities']['Update']) {
    const { data, error } = await supabase
      .from('trip_activities')
      .update(updates)
      .eq('id', activityId)
      .select()
      .single()
    return { data, error }
  },

  async deleteTripActivity(activityId: string) {
    const { error } = await supabase
      .from('trip_activities')
      .delete()
      .eq('id', activityId)
    return { error }
  }
}

// Accommodation operations
export const accommodationService = {
  async getCityAccommodations(cityId: string) {
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('city_id', cityId)
      .order('price_per_night')
    return { data, error }
  }
}

// Transport operations
export const transportService = {
  async getTransportCost(fromCityId: string, toCityId: string) {
    const { data, error } = await supabase
      .from('transport_costs')
      .select('*')
      .or(`and(from_city_id.eq.${fromCityId},to_city_id.eq.${toCityId}),and(from_city_id.eq.${toCityId},to_city_id.eq.${fromCityId})`)
    return { data, error }
  }
}

// Currency operations
export const currencyService = {
  async getCurrencies() {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .order('code')
    return { data, error }
  },

  async getExchangeRate(currencyCode: string) {
    const { data, error } = await supabase
      .from('currencies')
      .select('exchange_rate_to_usd')
      .eq('code', currencyCode)
      .single()
    return { data, error }
  }
}

// Shared Trip operations
export const sharedTripService = {
  async getSharedTripByToken(token: string) {
    console.log('sharedTripService: Getting shared trip by token:', token);
    
    try {
      // First, get the shared link to find the trip_id
      const { data: linkData, error: linkError } = await supabase
        .from('shared_links')
        .select('id, trip_id, token, expires_at, created_at')
        .eq('token', token)
        .maybeSingle();
      
      if (linkError) {
        console.error('sharedTripService: Error finding shared link:', linkError);
        return { data: null, error: linkError };
      }
      
      if (!linkData || !linkData.trip_id) {
        console.error('sharedTripService: No shared link found for token:', token);
        return { data: null, error: new Error('Shared link not found') };
      }
      
      console.log('sharedTripService: Found shared link for trip_id:', linkData.trip_id);
      
      // Now get the trip with all its related data
      let { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select(`
          *,
          trip_stops (
            *,
            city: cities (
              *,
              currency: currencies (*)
            ),
            trip_activities (
              *,
              activity: activities (
                *,
                currency: currencies (*)
              )
            )
          )
        `)
        .eq('id', linkData.trip_id)
        .eq('deleted', false)
        .maybeSingle();
      
      if (tripError) {
        console.error('sharedTripService: Error fetching trip data:', tripError);
        
        // If the complex query fails, try a simpler approach
        console.log('sharedTripService: Trying simpler trip query...');
        const { data: simpleTripData, error: simpleTripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', linkData.trip_id)
          .eq('deleted', false)
          .maybeSingle();
        
        if (simpleTripError) {
          console.error('sharedTripService: Simple trip query also failed:', simpleTripError);
          return { data: null, error: simpleTripError };
        }
        
        if (!simpleTripData) {
          return { data: null, error: new Error('Trip not found or has been deleted') };
        }
        
        // Use the simple trip data
        tripData = simpleTripData;
      }
      
      if (!tripData) {
        console.error('sharedTripService: Trip not found or deleted:', linkData.trip_id);
        return { data: null, error: new Error('Trip not found or has been deleted') };
      }
      
      console.log('sharedTripService: Successfully fetched trip data:', tripData);
      console.log('sharedTripService: Trip cover_photo_url:', tripData.cover_photo_url);
      console.log('sharedTripService: Trip fields available:', Object.keys(tripData));
      
      // Get user data separately since trips.user_id references auth.users
      let userData = null;
      if (tripData.user_id) {
        // Since we can't easily access auth.users from the client,
        // we'll use a fallback approach
        userData = {
          id: tripData.user_id,
          name: 'Trip Creator',
          email: 'user@example.com'
        };
      }
      
      // Return the data in the expected format
      return { 
        data: {
          id: linkData.id,
          trip_id: linkData.trip_id,
          token: token,
          expires_at: linkData.expires_at,
          created_at: linkData.created_at,
          trip: {
            ...tripData,
            user: userData || { id: '', name: null, email: 'Unknown User' },
            trip_stops: tripData.trip_stops || []
          }
        }, 
        error: null 
      };
      
    } catch (error) {
      console.error('sharedTripService: Unexpected error in getSharedTripByToken:', error);
      return { data: null, error: error as any };
    }
  },

  async createSharedLink(tripId: string, expiresAt?: string) {
    console.log('sharedTripService: Creating shared link for trip:', tripId);
    
    try {
      // First check if the trip exists
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('id, name, is_public')
        .eq('id', tripId)
        .eq('deleted', false)
        .maybeSingle();
      
      if (tripError) {
        console.error('sharedTripService: Error checking trip:', tripError);
        throw new Error(`Database error: ${tripError.message}`);
      }
      
      if (!tripData) {
        console.error('sharedTripService: Trip not found in database');
        throw new Error('Trip not found in database');
      }
      
      // Allow sharing of both public and private trips
      console.log('sharedTripService: Trip found:', tripData);
      
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log('sharedTripService: Generated token:', token);
      
      const { data, error } = await supabase
        .from('shared_links')
        .insert({
          trip_id: tripId,
          token,
          expires_at: expiresAt
        })
        .select()
        .single();
      
      if (error) {
        console.error('sharedTripService: Error creating shared link:', error);
        throw new Error(`Failed to create shared link: ${error.message}`);
      }
      
      console.log('sharedTripService: Shared link created successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('sharedTripService: Unexpected error:', error);
      throw error;
    }
  },

  async getSharedLink(tripId: string) {
    console.log('sharedTripService: Getting shared link for trip:', tripId);
    
    try {
      // Use a simpler query approach to avoid 406 errors
      const { data, error } = await supabase
        .from('shared_links')
        .select('*')
        .eq('trip_id', tripId);
      
      if (error) {
        console.error('sharedTripService: Error getting shared links:', error);
        return { data: null, error };
      }
      
      // Sort and get the most recent one
      const sortedData = data?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const mostRecent = sortedData?.[0] || null;
      console.log('sharedTripService: Found shared link:', mostRecent);
      
      return { data: mostRecent, error: null };
    } catch (error) {
      console.error('sharedTripService: Unexpected error getting shared link:', error);
      return { data: null, error: error as any };
    }
  },

  async deleteSharedLink(linkId: string) {
    console.log('sharedTripService: Deleting shared link:', linkId);
    
    try {
      const { error } = await supabase
        .from('shared_links')
        .delete()
        .eq('id', linkId);
      
      if (error) {
        console.error('sharedTripService: Error deleting shared link:', error);
        throw new Error(`Failed to delete shared link: ${error.message}`);
      }
      
      console.log('sharedTripService: Shared link deleted successfully');
      return { error: null };
    } catch (error) {
      console.error('sharedTripService: Unexpected error deleting shared link:', error);
      throw error;
    }
  }
}
