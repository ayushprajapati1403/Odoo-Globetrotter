import { supabase } from '../lib/supabase';

export interface Accommodation {
  id: string;
  city_id: string;
  provider: string;
  name: string;
  price_per_night: number;
  currency: string;
  currency_id: string | null;
  metadata: any;
  created_at: string;
}

export interface TripAccommodation {
  id: string;
  trip_id: string;
  accommodation_id: string;
  check_in_date: string;
  check_out_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  accommodation?: Accommodation;
}

export interface AccommodationFormData {
  accommodation_id: string;
  check_in_date: string;
  check_out_date: string;
  notes: string;
}

export class AccommodationService {
  // Get all accommodations for a city
  static async getCityAccommodations(cityId: string): Promise<Accommodation[]> {
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('city_id', cityId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching city accommodations:', error);
      throw error;
    }
  }

  // Get trip accommodations
  static async getTripAccommodations(tripId: string): Promise<TripAccommodation[]> {
    try {
      const { data, error } = await supabase
        .from('trip_accommodations')
        .select(`
          *,
          accommodation:accommodations(*)
        `)
        .eq('trip_id', tripId)
        .order('check_in_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trip accommodations:', error);
      throw error;
    }
  }

  // Add accommodation to trip
  static async addTripAccommodation(tripId: string, accommodationData: AccommodationFormData): Promise<TripAccommodation> {
    try {
      const { data, error } = await supabase
        .from('trip_accommodations')
        .insert({
          trip_id: tripId,
          accommodation_id: accommodationData.accommodation_id,
          check_in_date: accommodationData.check_in_date,
          check_out_date: accommodationData.check_out_date,
          notes: accommodationData.notes || null
        })
        .select(`
          *,
          accommodation:accommodations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding trip accommodation:', error);
      throw error;
    }
  }

  // Update trip accommodation
  static async updateTripAccommodation(accommodationId: string, accommodationData: AccommodationFormData): Promise<TripAccommodation> {
    try {
      const { data, error } = await supabase
        .from('trip_accommodations')
        .update({
          accommodation_id: accommodationData.accommodation_id,
          check_in_date: accommodationData.check_in_date,
          check_out_date: accommodationData.check_out_date,
          notes: accommodationData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', accommodationId)
        .select(`
          *,
          accommodation:accommodations(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating trip accommodation:', error);
      throw error;
    }
  }

  // Delete trip accommodation
  static async deleteTripAccommodation(accommodationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trip_accommodations')
        .delete()
        .eq('id', accommodationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting trip accommodation:', error);
      throw error;
    }
  }

  // Get accommodation by ID
  static async getAccommodationById(accommodationId: string): Promise<Accommodation | null> {
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', accommodationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      throw error;
    }
  }
}
