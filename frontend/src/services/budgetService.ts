import { supabase } from '../lib/supabase';
import { CurrencyService, Currency } from './currencyService';

export interface BudgetData {
  totalBudget: number | null;
  totalEstimatedCost: number | null;
  currency: string;
  userCurrency: Currency;
  categories: {
    [key: string]: {
      budgeted: number;
      estimated: number;
      actual?: number;
    };
  };
  perDayCosts: Array<{
    day: number;
    date: string;
    city: string;
    budgeted: number;
    estimated: number;
  }>;
  alerts: string[];
  // New fields for detailed cost breakdown
  accommodations: Array<{
    id: string;
    name: string;
    city: string;
    price_per_night: number;
    currency_id: string;
    originalCurrency: Currency;
    convertedCost: number;
  }>;
  transportCosts: Array<{
    id: string;
    from_city: string;
    to_city: string;
    mode: string;
    cost: number;
    currency_id: string;
    originalCurrency: Currency;
    convertedCost: number;
  }>;
  activities: Array<{
    id: string;
    name: string;
    cost: number;
    currency_id: string;
    originalCurrency: Currency;
    convertedCost: number;
  }>;
  currencies: Currency[];
}

export interface TripBudget {
  id: string;
  trip_id: string;
  budget: number | null;
  currency: string;
  total_estimated_cost: number | null;
  created_at: string;
  updated_at: string;
}

export interface CostItem {
  id: string;
  trip_id: string;
  trip_stop_id: string | null;
  category: 'transport' | 'accommodation' | 'activities' | 'meals' | 'other';
  amount: number;
  currency_id: string | null;
  created_at: string;
}

export class BudgetService {
  // Get budget data for a specific trip
  static async getTripBudget(tripId: string, userId?: string): Promise<BudgetData> {
    try {
      // Get trip details
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('budget, currency, total_estimated_cost')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Get user's preferred currency
      const userCurrency = userId ? await CurrencyService.getUserCurrency(userId) : null;
      const defaultCurrency = await CurrencyService.getCurrencyByCode('USD');
      const finalUserCurrency = userCurrency || defaultCurrency;

      if (!finalUserCurrency) {
        throw new Error('Unable to determine user currency');
      }

      // Get all currencies for reference
      const currencies = await CurrencyService.getAllCurrencies();

      // Get cost items for the trip
      let costItems: any[] = [];
      try {
        const { data: costItemsData, error: costError } = await supabase
          .from('cost_items')
          .select(`
            *,
            trip_stops!inner(
              cities(name)
            )
          `)
          .eq('trip_id', tripId);

        if (costError) throw costError;
        costItems = costItemsData || [];
      } catch (error) {
        console.warn('Error fetching cost items:', error);
        costItems = [];
      }

      // Get trip stops for daily breakdown
      let tripStops: any[] = [];
      try {
        const { data: stopsData, error: stopsError } = await supabase
          .from('trip_stops')
          .select(`
            *,
            cities(name)
          `)
          .eq('trip_id', tripId)
          .order('start_date');

        if (stopsError) throw stopsError;
        tripStops = stopsData || [];
      } catch (error) {
        console.warn('Error fetching trip stops:', error);
        tripStops = [];
      }

      // Get accommodation costs from trip_accommodations table
      let accommodations: any[] = [];
      try {
        const { data: accData, error: accError } = await supabase
          .from('trip_accommodations')
          .select(`
            *,
            accommodations(
              name,
              price_per_night,
              currency_id,
              cities(name)
            )
          `)
          .eq('trip_id', tripId);

        if (accError) throw accError;
        accommodations = accData || [];
      } catch (error) {
        console.warn('Error fetching accommodations:', error);
        accommodations = [];
      }

      // Get transport costs from trip_transport_details table
      let transportCosts: any[] = [];
      try {
        const { data: transportData, error: transportError } = await supabase
          .from('trip_transport_details')
          .select(`
            *,
            from_city:cities!trip_transport_details_from_city_id_fkey(name),
            to_city:cities!trip_transport_details_to_city_id_fkey(name)
          `)
          .eq('trip_id', tripId);

        if (transportError) throw transportError;
        transportCosts = transportData || [];
      } catch (error) {
        console.warn('Error fetching transport costs:', error);
        transportCosts = [];
      }

      // Get trip activities with costs
      let tripActivities: any[] = [];
      try {
        // First get trip stops for this trip
        const { data: tripStopsForActivities, error: stopsForActivitiesError } = await supabase
          .from('trip_stops')
          .select('id')
          .eq('trip_id', tripId);

        if (stopsForActivitiesError) throw stopsForActivitiesError;

        if (tripStopsForActivities && tripStopsForActivities.length > 0) {
          const stopIds = tripStopsForActivities.map(stop => stop.id);
          
          const { data: activitiesData, error: activitiesError } = await supabase
            .from('trip_activities')
            .select(`
              *,
              activities(
                name,
                cost,
                currency_id
              )
            `)
            .in('trip_stop_id', stopIds);

          if (activitiesError) throw activitiesError;
          tripActivities = activitiesData || [];
        }
              } catch (error) {
          console.warn('Error fetching trip activities:', error);
          tripActivities = [];
        }

      console.log('Processing accommodations:', accommodations?.length || 0);
      // Process accommodations with currency conversion
      const processedAccommodations = await Promise.all(
        (accommodations || []).map(async (acc) => {
          const originalCurrency = currencies.find(c => c.id === acc.accommodations?.currency_id);
          const convertedCost = originalCurrency 
            ? await CurrencyService.convertCurrency(
                acc.accommodations.price_per_night || 0,
                acc.accommodations.currency_id,
                finalUserCurrency.id
              )
            : acc.accommodations.price_per_night || 0;

          return {
            id: acc.id,
            name: acc.accommodations?.name || 'Unknown',
            city: acc.accommodations?.cities?.name || 'Unknown',
            price_per_night: acc.accommodations?.price_per_night || 0,
            currency_id: acc.accommodations?.currency_id || '',
            originalCurrency: originalCurrency || currencies[0],
            convertedCost
          };
        })
      );

      // Process transport costs with currency conversion
      const processedTransportCosts = await Promise.all(
        (transportCosts || []).map(async (transport) => {
          const originalCurrency = currencies.find(c => c.id === transport.currency_id);
          const convertedCost = originalCurrency && transport.currency_id
            ? await CurrencyService.convertCurrency(
                transport.cost || 0,
                transport.currency_id,
                finalUserCurrency.id
              )
            : transport.cost || 0;

          return {
            id: transport.id,
            from_city: transport.from_city?.name || 'Unknown',
            to_city: transport.to_city?.name || 'Unknown',
            mode: transport.transport_mode,
            cost: transport.cost || 0,
            currency_id: transport.currency_id || '',
            originalCurrency: originalCurrency || currencies[0],
            convertedCost
          };
        })
      );

      // Process trip activities with currency conversion
      const processedActivities = await Promise.all(
        (tripActivities || []).map(async (activity) => {
          const originalCurrency = currencies.find(c => c.id === activity.activities?.currency_id);
          const convertedCost = originalCurrency && activity.activities?.currency_id
            ? await CurrencyService.convertCurrency(
                activity.activities.cost || 0,
                activity.activities.currency_id,
                finalUserCurrency.id
              )
            : activity.activities?.cost || 0;

          return {
            id: activity.id,
            name: activity.activities?.name || 'Unknown',
            cost: activity.activities?.cost || 0,
            currency_id: activity.activities?.currency_id || '',
            originalCurrency: originalCurrency || currencies[0],
            convertedCost
          };
        })
      );

      // Process cost items with currency conversion
      const processedCostItems = await Promise.all(
        (costItems || []).map(async (item) => {
          const originalCurrency = currencies.find(c => c.id === item.currency_id);
          const convertedAmount = originalCurrency && item.currency_id
            ? await CurrencyService.convertCurrency(
                item.amount || 0,
                item.currency_id,
                finalUserCurrency.id
              )
            : item.amount || 0;

          return {
            ...item,
            originalCurrency: originalCurrency || currencies[0],
            convertedAmount
          };
        })
      );

      // Calculate total estimated cost by summing all converted costs
      const totalAccommodationCost = processedAccommodations.reduce((sum, acc) => sum + acc.convertedCost, 0);
      const totalTransportCost = processedTransportCosts.reduce((sum, transport) => sum + transport.convertedCost, 0);
      const totalActivitiesCost = processedActivities.reduce((sum, activity) => sum + activity.convertedCost, 0);
      const totalCostItemsCost = processedCostItems.reduce((sum, item) => sum + item.convertedAmount, 0);

      const totalEstimatedCost = totalAccommodationCost + totalTransportCost + totalActivitiesCost + totalCostItemsCost;

      console.log('Cost breakdown:', {
        accommodation: totalAccommodationCost,
        transport: totalTransportCost,
        activities: totalActivitiesCost,
        costItems: totalCostItemsCost,
        total: totalEstimatedCost
      });

      // If we have no costs at all, try to use the trip's stored total_estimated_cost as fallback
      if (totalEstimatedCost === 0 && trip.total_estimated_cost) {
        console.log('No costs found, using trip stored total_estimated_cost as fallback');
      }

      // Calculate category breakdown including accommodation and transport costs
      const categories: { [key: string]: { budgeted: number; estimated: number } } = {
        'Transport': { budgeted: 0, estimated: totalTransportCost },
        'Accommodation': { budgeted: 0, estimated: totalAccommodationCost },
        'Activities': { budgeted: 0, estimated: totalActivitiesCost },
        'Food & Dining': { budgeted: 0, estimated: 0 },
        'Other': { budgeted: 0, estimated: 0 }
      };

      // Add cost items to appropriate categories
      processedCostItems.forEach(item => {
        const category = this.mapCategory(item.category);
        if (categories[category]) {
          categories[category].estimated += item.convertedAmount;
        }
      });

      // Calculate daily costs
      const perDayCosts = tripStops?.map((stop, index) => {
        const dayCosts = processedCostItems?.filter(item => 
          item.trip_stop_id === stop.id
        ) || [];
        
        const totalCost = dayCosts.reduce((sum, item) => sum + item.convertedAmount, 0);
        const dailyBudget = (trip.budget || 0) / (tripStops.length || 1);

        return {
          day: index + 1,
          date: stop.start_date || '',
          city: stop.cities?.name || 'Unknown City',
          budgeted: dailyBudget,
          estimated: totalCost
        };
      }) || [];

      // Generate alerts
      const alerts: string[] = [];
      if (trip.budget && totalEstimatedCost) {
        const difference = totalEstimatedCost - trip.budget;
        if (difference > 0) {
          const percentage = (difference / trip.budget) * 100;
          alerts.push(`Trip is ${percentage.toFixed(1)}% over budget`);
        }
      }

      // Check category overruns
      Object.entries(categories).forEach(([category, data]) => {
        if (data.estimated > data.budgeted && data.budgeted > 0) {
          const percentage = ((data.estimated - data.budgeted) / data.budgeted) * 100;
          alerts.push(`${category} spending is ${percentage.toFixed(1)}% over budget`);
        }
      });

      return {
        totalBudget: trip.budget || 0,
        totalEstimatedCost: totalEstimatedCost || 0,
        currency: trip.currency || 'USD',
        userCurrency: finalUserCurrency,
        categories,
        perDayCosts,
        alerts,
        accommodations: processedAccommodations,
        transportCosts: processedTransportCosts,
        activities: processedActivities,
        currencies
      };
    } catch (error) {
      console.error('Error fetching trip budget:', error);
      throw error;
    }
  }

  // Get all trips with budget information for the current user
  static async getUserTripBudgets(): Promise<Array<{
    trip_id: string;
    trip_name: string;
    budget: number | null;
    total_estimated_cost: number | null;
    currency: string;
    status: 'over_budget' | 'within_budget' | 'no_budget';
  }>> {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('id, name, budget, total_estimated_cost, currency')
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return trips?.map(trip => {
        let status: 'over_budget' | 'within_budget' | 'no_budget' = 'no_budget';
        
        if (trip.budget && trip.total_estimated_cost) {
          status = trip.total_estimated_cost > trip.budget ? 'over_budget' : 'within_budget';
        }

        return {
          trip_id: trip.id,
          trip_name: trip.name,
          budget: trip.budget,
          total_estimated_cost: trip.total_estimated_cost,
          currency: trip.currency || 'USD',
          status
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching user trip budgets:', error);
      throw error;
    }
  }

  // Update trip budget
  static async updateTripBudget(tripId: string, budget: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ budget })
        .eq('id', tripId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating trip budget:', error);
      throw error;
    }
  }

  // Add cost item to trip
  static async addCostItem(tripId: string, costData: {
    trip_stop_id?: string;
    category: 'transport' | 'accommodation' | 'activities' | 'meals' | 'other';
    amount: number;
    currency_id?: string;
  }): Promise<CostItem> {
    try {
      const { data, error } = await supabase
        .from('cost_items')
        .insert({
          trip_id: tripId,
          ...costData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding cost item:', error);
      throw error;
    }
  }

  // Get accommodation count for a trip
  static async getTripAccommodationCount(tripId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('trip_accommodations')
        .select('*', { count: 'exact', head: true })
        .eq('trip_id', tripId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching accommodation count:', error);
      return 0;
    }
  }

  // Helper method to map database categories to display categories
  private static mapCategory(dbCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'transport': 'Transport',
      'accommodation': 'Accommodation',
      'activities': 'Activities',
      'meals': 'Food & Dining',
      'other': 'Other'
    };
    return categoryMap[dbCategory] || 'Other';
  }
}
