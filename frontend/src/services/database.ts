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
