import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin
} from 'lucide-react';
import { BudgetService } from '../services/budgetService';
import { useToast } from './Toast';

interface TripBudget {
  trip_id: string;
  trip_name: string;
  budget: number | null;
  total_estimated_cost: number | null;
  currency: string;
  status: 'over_budget' | 'within_budget' | 'no_budget';
}

const BudgetTracker: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [tripBudgets, setTripBudgets] = useState<TripBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'over_budget' | 'within_budget' | 'no_budget'>('all');

  useEffect(() => {
    fetchTripBudgets();
  }, []);

  const fetchTripBudgets = async () => {
    try {
      setLoading(true);
      const data = await BudgetService.getUserTripBudgets();
      setTripBudgets(data);
    } catch (error) {
      console.error('Error fetching trip budgets:', error);
      showError('Failed to load trip budgets');
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return 'Not set';
    
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'SGD': 'S$',
      'HKD': 'HK$'
    };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
  };

  const handleTripClick = (tripId: string) => {
    navigate(`/budget/${tripId}`);
  };

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <p className="text-gray-600 text-lg">Monitor and manage budgets across all your trips</p>
            </div>
            
            <button
              onClick={handleCreateTrip}
              className="mt-4 lg:mt-0 bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors flex items-center space-x-2"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
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
            <p className="text-gray-600 mt-1">Click on any trip to view its detailed budget breakdown</p>
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
                  className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                >
                  Create Your First Trip
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.trip_id}
                  onClick={() => handleTripClick(trip.trip_id)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
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
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span className="text-sm">View Budget</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
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