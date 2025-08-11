import { supabase } from '../lib/supabase';

// Transport Types
export interface TransportCost {
  id: string;
  from_city_id: string;
  to_city_id: string;
  mode: string;
  avg_cost: number;
  avg_duration_minutes: number;
  provider: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  currency_id: string;
}

export interface TransportDetails {
  id: string;
  trip_id: string;
  from_city_id: string;
  to_city_id: string;
  transport_mode: string;
  provider: string;
  departure_time: string;
  arrival_time: string;
  cost: number;
  currency_id: string;
  booking_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
  // Joined data from database queries
  currency?: {
    code: string;
    symbol: string;
  };
  from_city?: {
    name: string;
    country: string;
  };
  to_city?: {
    name: string;
    country: string;
  };
}

export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Transport Service
export class TransportService {
  
  // Get transport costs between two cities
  static async getTransportCosts(fromCityId: string, toCityId: string) {
    try {
      const { data, error } = await supabase
        .from('transport_costs')
        .select(`
          *,
          from_city:cities!transport_costs_from_city_id_fkey(name, country),
          to_city:cities!transport_costs_to_city_id_fkey(name, country),
          currency:currencies(code, symbol)
        `)
        .eq('from_city_id', fromCityId)
        .eq('to_city_id', toCityId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transport costs:', error);
      throw error;
    }
  }

  // Get all transport costs (reference data)
  static async getAllTransportCosts() {
    try {
      const { data, error } = await supabase
        .from('transport_costs')
        .select(`
          *,
          currency:currencies(code, symbol)
        `)
        .order('from_city_id', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all transport costs:', error);
      throw error;
    }
  }

  // Get all currencies
  static async getAllCurrencies() {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  // Add transport cost reference data
  static async addTransportCost(transportData: {
    from_city_id: string;
    to_city_id: string;
    mode: string;
    avg_cost: number;
    avg_duration_minutes: number;
    provider: string;
    currency_id: string;
    metadata?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('transport_costs')
        .insert(transportData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding transport cost:', error);
      throw error;
    }
  }

  // Get all transport modes
  static async getTransportModes(): Promise<TransportMode[]> {
    // This could be fetched from a database table, but for now we'll return static data
    return [
      { id: 'plane', name: 'Plane', icon: '✈️', description: 'Air travel between cities' },
      { id: 'train', name: 'Train', icon: '🚂', description: 'Rail travel between cities' },
      { id: 'bus', name: 'Bus', icon: '🚌', description: 'Bus travel between cities' },
      { id: 'car', name: 'Car', icon: '🚗', description: 'Car rental or driving' },
      { id: 'ferry', name: 'Ferry', icon: '⛴️', description: 'Water transport' },
      { id: 'walking', name: 'Walking', icon: '🚶', description: 'Walking between nearby locations' },
      { id: 'bicycle', name: 'Bicycle', icon: '🚲', description: 'Bicycle rental or cycling' },
      { id: 'other', name: 'Other', icon: '🚀', description: 'Other transport methods' }
    ];
  }

  // Add transport details to a trip
  static async addTransportDetails(tripId: string, transportData: {
    from_city_id: string;
    to_city_id: string;
    transport_mode: string;
    provider: string;
    departure_time: string;
    arrival_time: string;
    cost: number;
    currency_id: string;
    booking_reference?: string;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('trip_transport_details')
        .insert({
          trip_id: tripId,
          ...transportData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding transport details:', error);
      throw error;
    }
  }

  // Update transport details
  static async updateTransportDetails(transportId: string, updates: Partial<TransportDetails>) {
    try {
      const { data, error } = await supabase
        .from('trip_transport_details')
        .update(updates)
        .eq('id', transportId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating transport details:', error);
      throw error;
    }
  }

  // Delete transport details
  static async deleteTransportDetails(transportId: string) {
    try {
      const { error } = await supabase
        .from('trip_transport_details')
        .delete()
        .eq('id', transportId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting transport details:', error);
      throw error;
    }
  }

  // Get transport details for a trip
  static async getTripTransportDetails(tripId: string) {
    try {
      const { data, error } = await supabase
        .from('trip_transport_details')
        .select(`
          *,
          from_city:cities!trip_transport_details_from_city_id_fkey(name, country),
          to_city:cities!trip_transport_details_to_city_id_fkey(name, country),
          currency:currencies(code, symbol)
        `)
        .eq('trip_id', tripId)
        .order('departure_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trip transport details:', error);
      throw error;
    }
  }

  // Get transport details between two specific cities in a trip
  static async getTransportDetailsBetweenCities(tripId: string, fromCityId: string, toCityId: string) {
    try {
      const { data, error } = await supabase
        .from('trip_transport_details')
        .select(`
          *,
          from_city:cities!trip_transport_details_from_city_id_fkey(name, country),
          to_city:cities!trip_transport_details_to_city_id_fkey(name, country),
          currency:currencies(code, symbol)
        `)
        .eq('trip_id', tripId)
        .eq('from_city_id', fromCityId)
        .eq('to_city_id', toCityId)
        .order('departure_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transport details between cities:', error);
      throw error;
    }
  }

  // Calculate total transport cost for a trip
  static async calculateTripTransportCost(tripId: string, targetCurrency: string = 'USD') {
    try {
      const transportDetails = await this.getTripTransportDetails(tripId);
      
      let totalCost = 0;
      const currencyRates: { [key: string]: number } = {};

      // Get currency exchange rates
      const { data: currencies } = await supabase
        .from('currencies')
        .select('code, exchange_rate_to_usd');

      if (currencies) {
        currencies.forEach(currency => {
          currencyRates[currency.code] = currency.exchange_rate_to_usd;
        });
      }

      // Calculate total cost in target currency
      transportDetails.forEach(transport => {
        if (transport.cost && transport.currency) {
          const transportCurrency = transport.currency.code || transport.currency;
          const rate = currencyRates[transportCurrency] || 1;
          totalCost += transport.cost * rate;
        }
      });

      return totalCost;
    } catch (error) {
      console.error('Error calculating transport cost:', error);
      throw error;
    }
  }
}
