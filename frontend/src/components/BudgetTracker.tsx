import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Hotel,
  Car,
  Loader2
} from 'lucide-react';

// Import actual services
import { BudgetService } from '../services/budgetService';
import { CurrencyService, Currency } from '../services/currencyService';
import { useAuth } from '../contexts/AuthContext';

// Mock Toast Hook
const useToast = () => ({
  showSuccess: (msg: string) => console.log('Success:', msg),
  showError: (msg: string) => console.error('Error:', msg)
});

interface AccommodationCost {
  trip_stop_id: string;
  city_name: string;
  nights: number;
  price_per_night: number;
  total_cost: number;
  original_currency: string;
  converted_cost_usd: number;
  user_currency_cost: number;
}

interface TransportCost {
  from_city: string;
  to_city: string;
  mode: string;
  cost: number;
  original_currency: string;
  converted_cost_usd: number;
  user_currency_cost: number;
}

interface TripBudget {
  trip_id: string;
  trip_name: string;
  budget: number | null;
  total_estimated_cost: number | null;
  currency: string;
  status: 'over_budget' | 'within_budget' | 'no_budget';
  accommodation_costs?: Array<{
    id: string;
    name: string;
    city: string;
    price_per_night: number;
    currency_id: string;
    originalCurrency: Currency;
    convertedCost: number;
  }>;
  transport_costs?: Array<{
    id: string;
    from_city: string;
    to_city: string;
    mode: string;
    cost: number;
    currency_id: string;
    originalCurrency: Currency;
    convertedCost: number;
  }>;
  total_accommodation_user_currency?: number;
  total_transport_user_currency?: number;
}

// Remove local Currency interface since we're importing it from CurrencyService

const BudgetTracker: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [tripBudgets, setTripBudgets] = useState<TripBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'over_budget' | 'within_budget' | 'no_budget'>('all');
  const [userCurrency, setUserCurrency] = useState<Currency | null>(null);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Fetch user currency
      const userCurrencyData = await CurrencyService.getUserCurrency(user.id);
      setUserCurrency(userCurrencyData);
      
      // Fetch trip budgets
      const data = await BudgetService.getUserTripBudgets();
      setTripBudgets(data as TripBudget[]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTripCostDetails = async (tripId: string) => {
    if (!user) return;
    
    try {
      setLoadingDetails(tripId);
      
      // Fetch complete budget data for the trip using BudgetService
      const budgetData = await BudgetService.getTripBudget(tripId, user.id);
      
      // Update the trip with the detailed budget information
      setTripBudgets(prev => prev.map(trip => 
        trip.trip_id === tripId 
          ? { 
              ...trip, 
              accommodation_costs: budgetData.accommodations,
              transport_costs: budgetData.transportCosts,
              total_accommodation_user_currency: budgetData.accommodations.reduce((sum, acc) => sum + acc.convertedCost, 0),
              total_transport_user_currency: budgetData.transportCosts.reduce((sum, trans) => sum + trans.convertedCost, 0)
            }
          : trip
      ));
    } catch (error) {
      console.error('Error fetching trip cost details:', error);
      showError('Failed to load cost details');
    } finally {
      setLoadingDetails(null);
    }
  };



  const handleTripExpand = async (tripId: string) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
      const trip = tripBudgets.find(t => t.trip_id === tripId);
      if (!trip?.accommodation_costs && !trip?.transport_costs) {
        await fetchTripCostDetails(tripId);
      }
    }
  };

  const filteredTrips = tripBudgets.filter(trip => {
    const matchesSearch = trip.trip_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over_budget':
        return 'text-red-600 bg-red-100';
      case 'within_budget':
        return 'text-green-600 bg-green-100';
      case 'no_budget':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over_budget':
        return <TrendingUp className="h-4 w-4" />;
      case 'within_budget':
        return <TrendingDown className="h-4 w-4" />;
      case 'no_budget':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over_budget':
        return 'Over Budget';
      case 'within_budget':
        return 'Within Budget';
      case 'no_budget':
        return 'No Budget Set';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (amount: number | null | undefined, currencyCode?: string) => {
    if (amount === null || amount === undefined) return 'Not set';
    
    // If userCurrency is available, use it for formatting
    if (userCurrency && !currencyCode) {
      return CurrencyService.formatCurrency(amount, userCurrency);
    }
    
    const code = currencyCode || userCurrency?.code || 'USD';
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'SGD': 'S$',
      'HKD': 'HK$',
      'INR': '₹'
    };
    return `${symbols[code] || code} ${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const handleTripClick = (tripId: string) => {
    console.log('Navigate to trip details:', tripId);
    // Replace with your navigation logic
  };

  const handleCreateTrip = () => {
    console.log('Navigate to create trip');
    // Replace with your navigation logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Tracker</h1>
              <p className="text-gray-600 text-lg">
                Monitor and manage budgets across all your trips
                {userCurrency && (
                  <span className="ml-2 text-sm">
                    (Displaying in {userCurrency.code})
                  </span>
                )}
              </p>
            </div>
            
            <button
              onClick={handleCreateTrip}
              className="mt-4 lg:mt-0 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Trip</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="over_budget">Over Budget</option>
              <option value="within_budget">Within Budget</option>
              <option value="no_budget">No Budget Set</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">{tripBudgets.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Over Budget</p>
                <p className="text-3xl font-bold text-red-600">
                  {tripBudgets.filter(t => t.status === 'over_budget').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Within Budget</p>
                <p className="text-3xl font-bold text-green-600">
                  {tripBudgets.filter(t => t.status === 'within_budget').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">No Budget Set</p>
                <p className="text-3xl font-bold text-gray-600">
                  {tripBudgets.filter(t => t.status === 'no_budget').length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Trips</h2>
            <p className="text-gray-600 mt-1">Click on any trip to expand cost breakdown or view detailed budget</p>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No trips found' : 'No trips yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first trip to start tracking your budget'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={handleCreateTrip}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Your First Trip
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTrips.map((trip) => (
                <div key={trip.trip_id} className="hover:bg-gray-50 transition-colors">
                  <div
                    onClick={() => handleTripExpand(trip.trip_id)}
                    className="p-6 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{trip.trip_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(trip.status)}
                              <span>{getStatusText(trip.status)}</span>
                            </div>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Budget: {formatCurrency(trip.budget, trip.currency)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <PieChart className="h-4 w-4" />
                            <span>Estimated: {formatCurrency(trip.total_estimated_cost, trip.currency)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Currency: {trip.currency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTripClick(trip.trip_id);
                          }}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Details
                        </button>
                        <div className="text-gray-400">
                          {expandedTrip === trip.trip_id ? (
                            <TrendingDown className="h-5 w-5" />
                          ) : (
                            <TrendingUp className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Cost Details */}
                  {expandedTrip === trip.trip_id && (
                    <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                      {loadingDetails === trip.trip_id ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                          <span className="ml-2 text-gray-600">Loading cost details...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                          {/* Accommodation Costs */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <Hotel className="h-4 w-4 mr-2 text-blue-600" />
                                Accommodation Costs
                              </h4>
                              {trip.total_accommodation_user_currency && (
                                <span className="text-sm font-medium text-blue-600">
                                  Total: {formatCurrency(trip.total_accommodation_user_currency)}
                                </span>
                              )}
                            </div>
                            
                            {trip.accommodation_costs && trip.accommodation_costs.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {trip.accommodation_costs.map((acc, idx) => (
                                  <div key={idx} className="text-sm border-l-2 border-blue-200 pl-3 py-1">
                                    <div className="font-medium text-gray-800">{acc.city}</div>
                                    <div className="text-gray-600">
                                      1 night × {formatCurrency(acc.price_per_night, acc.originalCurrency.code)}
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                      = {formatCurrency(acc.convertedCost)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No accommodation costs recorded</p>
                            )}
                          </div>

                          {/* Transport Costs */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <Car className="h-4 w-4 mr-2 text-green-600" />
                                Transport Costs
                              </h4>
                              {trip.total_transport_user_currency && (
                                <span className="text-sm font-medium text-green-600">
                                  Total: {formatCurrency(trip.total_transport_user_currency)}
                                </span>
                              )}
                            </div>
                            
                            {trip.transport_costs && trip.transport_costs.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {trip.transport_costs.map((trans, idx) => (
                                  <div key={idx} className="text-sm border-l-2 border-green-200 pl-3 py-1">
                                    <div className="font-medium text-gray-800">
                                      {trans.from_city} → {trans.to_city}
                                    </div>
                                    <div className="text-gray-600">
                                      {trans.mode} - {formatCurrency(trans.cost, trans.originalCurrency.code)}
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                      = {formatCurrency(trans.convertedCost)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No transport costs recorded</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Total Summary */}
                      {(trip.total_accommodation_user_currency || trip.total_transport_user_currency) && (
                        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              Total Trip Cost (Accommodation + Transport):
                            </span>
                            <span className="text-lg font-bold text-purple-600">
                              {formatCurrency(
                                (trip.total_accommodation_user_currency || 0) + 
                                (trip.total_transport_user_currency || 0)
                              )}
                            </span>
                          </div>
                          {trip.budget && (
                            <div className="mt-2 text-sm text-gray-600">
                              Budget Remaining: {formatCurrency(
                                trip.budget - ((trip.total_accommodation_user_currency || 0) + 
                                (trip.total_transport_user_currency || 0))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;