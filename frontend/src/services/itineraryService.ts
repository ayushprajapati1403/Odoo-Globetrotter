import { supabase } from '../lib/supabase';

// Database Types
export interface City {
  id: string;
  name: string;
  country: string;
  iso_country_code: string;
  lat: number;
  lng: number;
  population: bigint;
  cost_index: number;
  avg_daily_hotel: number;
  popularity_score: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  currency_id: string;
}

export interface TripStop {
  id: string;
  trip_id: string;
  seq: number;
  city_id: string;
  start_date: string;
  end_date: string;
  local_transport_cost: number;
  accommodation_estimate: number;
  notes: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  city?: City; // Joined city data
  activities?: TripActivity[]; // Activities for this stop
}

export interface Activity {
  id: string;
  city_id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  duration_minutes: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  currency_id: string;
  start_time: string;
  end_time: string;
}

export interface TripActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string;
  name: string;
  scheduled_date: string;
  start_time: string;
  duration_minutes: number;
  cost: number;
  notes: string;
  created_at: string;
  updated_at: string;
  activity?: Activity; // Joined activity data
}

export interface AdminTrip {
  id: string;
  user_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  cover_photo_url: string;
  currency: string;
  total_estimated_cost: number;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  trip_type: 'admin_defined' | 'custom';
  created_by: string;
}

// Itinerary Service
export class ItineraryService {
  
  // Get trip details with stops
  static async getTripWithStops(tripId: string) {
    try {
      // Get trip details
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .eq('deleted', false)
        .single();

      if (tripError) throw tripError;

      // Get trip stops with city information
      const { data: stops, error: stopsError } = await supabase
        .from('trip_stops')
        .select(`
          *,
          city:cities(*)
        `)
        .eq('trip_id', tripId)
        .order('seq', { ascending: true });

      if (stopsError) throw stopsError;

      // Get activities for each stop
      const stopsWithActivities = await Promise.all(
        (stops || []).map(async (stop) => {
          const { data: activities, error: activitiesError } = await supabase
            .from('trip_activities')
            .select(`
              *,
              activity:activities(*)
            `)
            .eq('trip_stop_id', stop.id)
            .order('scheduled_date', { ascending: true })
            .order('start_time', { ascending: true });

          if (activitiesError) {
            console.error('Error fetching activities for stop:', activitiesError);
            return { ...stop, activities: [] };
          }

          return { ...stop, activities: activities || [] };
        })
      );

      return { trip, stops: stopsWithActivities };
    } catch (error) {
      console.error('Error fetching trip with stops:', error);
      throw error;
    }
  }

  // Get trip stop with activities
  static async getTripStopWithActivities(stopId: string) {
    try {
      const { data: stop, error: stopError } = await supabase
        .from('trip_stops')
        .select(`
          *,
          city:cities(*)
        `)
        .eq('id', stopId)
        .single();

      if (stopError) throw stopError;

      // Get activities for this stop
      const { data: activities, error: activitiesError } = await supabase
        .from('trip_activities')
        .select(`
          *,
          activity:activities(*)
        `)
        .eq('trip_stop_id', stopId)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (activitiesError) throw activitiesError;

      return { stop, activities: activities || [] };
    } catch (error) {
      console.error('Error fetching trip stop with activities:', error);
      throw error;
    }
  }

  // Add new city to trip
  static async addCityToTrip(tripId: string, cityData: {
    city_id: string;
    start_date: string;
    end_date: string;
    notes?: string;
  }) {
    try {
      // Validate required fields
      if (!cityData.city_id) {
        throw new Error('City ID is required');
      }
      if (!cityData.start_date) {
        throw new Error('Start date is required');
      }
      if (!cityData.end_date) {
        throw new Error('End date is required');
      }

      // Validate date logic
      const startDate = new Date(cityData.start_date);
      const endDate = new Date(cityData.end_date);
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }

      // Get current max sequence number
      const { data: maxSeq, error: seqError } = await supabase
        .from('trip_stops')
        .select('seq')
        .eq('trip_id', tripId)
        .order('seq', { ascending: false })
        .limit(1)
        .single();

      if (seqError && seqError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error(`Failed to get sequence number: ${seqError.message}`);
      }

      const nextSeq = (maxSeq?.seq || 0) + 1;

      const { data: stop, error } = await supabase
        .from('trip_stops')
        .insert({
          trip_id: tripId,
          seq: nextSeq,
          ...cityData
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This city is already added to the trip');
        } else if (error.code === '23503') {
          throw new Error('Invalid city ID or trip ID');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      return stop;
    } catch (error) {
      console.error('Error adding city to trip:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while adding the city');
      }
    }
  }

  // Update trip stop
  static async updateTripStop(stopId: string, updates: Partial<Pick<TripStop, 'start_date' | 'end_date' | 'notes'>>) {
    try {
      const { data, error } = await supabase
        .from('trip_stops')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', stopId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating trip stop:', error);
      throw error;
    }
  }

  // Delete trip stop
  static async deleteTripStop(stopId: string) {
    try {
      // First delete all activities in this stop
      await supabase
        .from('trip_activities')
        .delete()
        .eq('trip_stop_id', stopId);

      // Then delete the stop
      const { error } = await supabase
        .from('trip_stops')
        .delete()
        .eq('id', stopId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting trip stop:', error);
      throw error;
    }
  }

  // Reorder trip stops
  static async reorderTripStops(tripId: string, stopIds: string[]) {
    try {
      const updates = stopIds.map((id, index) => ({
        id,
        seq: index + 1,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('trip_stops')
        .upsert(updates);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reordering trip stops:', error);
      throw error;
    }
  }

  // Add activity to trip stop
  static async addActivityToStop(stopId: string, activityData: {
    activity_id: string;
    scheduled_date: string;
    start_time?: string;
    notes?: string;
  }) {
    try {
      // Validate required fields
      if (!activityData.activity_id) {
        throw new Error('Activity ID is required');
      }
      if (!activityData.scheduled_date) {
        throw new Error('Scheduled date is required');
      }

      // Validate date logic
      const scheduledDate = new Date(activityData.scheduled_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (scheduledDate < today) {
        throw new Error('Scheduled date cannot be in the past');
      }



      // Get the activity details to populate the name, cost, and duration
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .select('name, cost, duration_minutes')
        .eq('id', activityData.activity_id)
        .eq('deleted', false)
        .single();

      if (activityError) {
        if (activityError.code === 'PGRST116') {
          throw new Error('Selected activity not found or has been deleted');
        }
        throw new Error(`Failed to get activity details: ${activityError.message}`);
      }

      const { data, error } = await supabase
        .from('trip_activities')
        .insert({
          trip_stop_id: stopId,
          activity_id: activityData.activity_id,
          name: activity.name,
          cost: activity.cost,
          scheduled_date: activityData.scheduled_date,
          start_time: activityData.start_time,
          duration_minutes: activity.duration_minutes,
          notes: activityData.notes
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This activity is already scheduled for this time');
        } else if (error.code === '23503') {
          throw new Error('Invalid activity ID or trip stop ID');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error adding activity to stop:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while adding the activity');
      }
    }
  }

  // Update trip activity
  static async updateTripActivity(activityId: string, updates: Partial<TripActivity>) {
    try {
      // If activity_id is being updated, get the new activity details
      if (updates.activity_id) {
        const { data: activity, error: activityError } = await supabase
          .from('activities')
          .select('name, cost, duration_minutes')
          .eq('id', updates.activity_id)
          .eq('deleted', false)
          .single();

        if (activityError) throw activityError;

        updates.name = activity.name;
        updates.cost = activity.cost;
        updates.duration_minutes = activity.duration_minutes;
      }

      const { data, error } = await supabase
        .from('trip_activities')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating trip activity:', error);
      throw error;
    }
  }

  // Delete trip activity
  static async deleteTripActivity(activityId: string) {
    try {
      const { error } = await supabase
        .from('trip_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting trip activity:', error);
      throw error;
    }
  }

  // Search cities
  static async searchCities(query: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .or(`name.ilike.%${query}%,country.ilike.%${query}%`)
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  }

  // Get popular cities
  static async getPopularCities(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular cities:', error);
      throw error;
    }
  }

  // Get activities for a city
  static async getCityActivities(cityId: string) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('city_id', cityId)
        .eq('deleted', false)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching city activities:', error);
      throw error;
    }
  }

  // Get admin-created trips for suggestions
  static async getAdminTripSuggestions() {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('trip_type', 'admin_defined')
        .eq('deleted', false)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching admin trip suggestions:', error);
      throw error;
    }
  }

  // Clone admin trip for user
  static async cloneAdminTrip(adminTripId: string, userId: string, customizations: {
    name?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }) {
    try {
      // Get admin trip details
      const { data: adminTrip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', adminTripId)
        .single();

      if (tripError) throw tripError;

      // Create new trip for user
      const { data: newTrip, error: newTripError } = await supabase
        .from('trips')
        .insert({
          user_id: userId,
          name: customizations.name || `${adminTrip.name} (Copy)`,
          description: customizations.description || adminTrip.description,
          start_date: customizations.start_date || adminTrip.start_date,
          end_date: customizations.end_date || adminTrip.end_date,
          is_public: false,
          trip_type: 'custom',
          metadata: { cloned_from: adminTripId }
        })
        .select()
        .single();

      if (newTripError) throw newTripError;

      // Clone trip stops
      const { data: stops, error: stopsError } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('trip_id', adminTripId)
        .order('seq', { ascending: true });

      if (stopsError) throw stopsError;

      if (stops && stops.length > 0) {
        const newStops = stops.map(stop => ({
          trip_id: newTrip.id,
          seq: stop.seq,
          city_id: stop.city_id,
          start_date: stop.start_date,
          end_date: stop.end_date,
          local_transport_cost: stop.local_transport_cost,
          accommodation_estimate: stop.accommodation_estimate,
          notes: stop.notes,
          metadata: stop.metadata
        }));

        const { error: insertStopsError } = await supabase
          .from('trip_stops')
          .insert(newStops);

        if (insertStopsError) throw insertStopsError;
      }

      return newTrip;
    } catch (error) {
      console.error('Error cloning admin trip:', error);
      throw error;
    }
  }

  // Get trip statistics
  static async getTripStats(tripId: string) {
    try {
      // Get trip stops count
      const { count: stopsCount, error: stopsError } = await supabase
        .from('trip_stops')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', tripId);

      if (stopsError) throw stopsError;

      // Get total activities count
      const { count: activitiesCount, error: activitiesError } = await supabase
        .from('trip_activities')
        .select('*', { count: 'exact', head: true })
        .eq('trip_stops!trip_id', tripId);

      if (activitiesError) throw activitiesError;

      // Get total cost
      const { data: activities, error: costError } = await supabase
        .from('trip_activities')
        .select('cost')
        .eq('trip_stops!trip_id', tripId);

      if (costError) throw costError;

      const totalCost = activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0;

      return {
        stopsCount: stopsCount || 0,
        activitiesCount: activitiesCount || 0,
        totalCost
      };
    } catch (error) {
      console.error('Error getting trip stats:', error);
      throw error;
    }
  }
}
