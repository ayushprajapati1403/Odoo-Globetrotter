import { supabase } from '../lib/supabase';

export interface BudgetData {
  totalBudget: number | null;
  totalEstimatedCost: number | null;
  currency: string;
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
  static async getTripBudget(tripId: string): Promise<BudgetData> {
    try {
      // Get trip details
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('budget, currency, total_estimated_cost')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Get cost items for the trip
      const { data: costItems, error: costError } = await supabase
        .from('cost_items')
        .select(`
          *,
          trip_stops!inner(
            cities(name)
          )
        `)
        .eq('trip_id', tripId);

      if (costError) throw costError;

      // Get trip stops for daily breakdown
      const { data: tripStops, error: stopsError } = await supabase
        .from('trip_stops')
        .select(`
          *,
          cities(name)
        `)
        .eq('trip_id', tripId)
        .order('start_date');

      if (stopsError) throw stopsError;

      // Calculate category breakdown
      const categories: { [key: string]: { budgeted: number; estimated: number } } = {
        'Transport': { budgeted: 0, estimated: 0 },
        'Accommodation': { budgeted: 0, estimated: 0 },
        'Activities': { budgeted: 0, estimated: 0 },
        'Food & Dining': { budgeted: 0, estimated: 0 },
        'Other': { budgeted: 0, estimated: 0 }
      };

      costItems?.forEach(item => {
        const category = this.mapCategory(item.category);
        if (categories[category]) {
          categories[category].estimated += item.amount;
        }
      });

      // Calculate daily costs
      const perDayCosts = tripStops?.map((stop, index) => {
        const dayCosts = costItems?.filter(item => 
          item.trip_stop_id === stop.id
        ) || [];
        
        const totalCost = dayCosts.reduce((sum, item) => sum + item.amount, 0);
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
      if (trip.budget && trip.total_estimated_cost) {
        const difference = trip.total_estimated_cost - trip.budget;
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
        totalEstimatedCost: trip.total_estimated_cost || 0,
        currency: trip.currency || 'USD',
        categories,
        perDayCosts,
        alerts
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
