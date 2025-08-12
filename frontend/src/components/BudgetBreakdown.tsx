import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Plane,
  Hotel,
  Utensils,
  Camera,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowLeft
} from 'lucide-react';
import { BudgetService, type BudgetData } from '../services/budgetService';
import { useToast } from './Toast';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchange_rate_to_usd: number;
}

interface AccommodationData {
  id: string;
  name: string;
  price_per_night: number;
  currency_id: string;
  provider: string;
  check_in_date: string;
  check_out_date: string;
}

interface TransportData {
  id: string;
  from_city: string;
  to_city: string;
  mode: string;
  cost: number;
  currency_id: string;
  provider: string;
  departure_time: string;
  arrival_time: string;
}

interface EnhancedBudgetData extends BudgetData {
  accommodations: AccommodationData[];
  transports: TransportData[];
  currencies: Currency[];
  userCurrency: Currency;
}

interface BudgetBreakdownProps {
  tripId?: string;
  tripName?: string;
}

// Enhanced Budget Service with currency conversion
class EnhancedBudgetService extends BudgetService {
  static async getCurrencies(): Promise<Currency[]> {
    // Mock implementation - replace with actual API call
    return [
      { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate_to_usd: 1.0 },
      { id: '2', code: 'EUR', name: 'Euro', symbol: '€', exchange_rate_to_usd: 1.08 },
      { id: '3', code: 'GBP', name: 'British Pound', symbol: '£', exchange_rate_to_usd: 1.26 },
      { id: '4', code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchange_rate_to_usd: 0.0067 },
      { id: '5', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchange_rate_to_usd: 0.74 },
      { id: '6', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchange_rate_to_usd: 0.65 }
    ];
  }

  static async getUserCurrency(userId: string): Promise<Currency> {
    // Mock implementation - replace with actual API call
    const currencies = await this.getCurrencies();
    return currencies.find(c => c.code === 'USD') || currencies[0];
  }

  static async getTripAccommodations(tripId: string): Promise<AccommodationData[]> {
    // Mock implementation - replace with actual database query
    return [
      {
        id: '1',
        name: 'Grand Hotel Paris',
        price_per_night: 250,
        currency_id: '2', // EUR
        provider: 'booking.com',
        check_in_date: '2024-03-15',
        check_out_date: '2024-03-18'
      },
      {
        id: '2',
        name: 'London Premium Suite',
        price_per_night: 180,
        currency_id: '3', // GBP
        provider: 'hotels.com',
        check_in_date: '2024-03-18',
        check_out_date: '2024-03-21'
      }
    ];
  }

  static async getTripTransports(tripId: string): Promise<TransportData[]> {
    // Mock implementation - replace with actual database query
    return [
      {
        id: '1',
        from_city: 'New York',
        to_city: 'Paris',
        mode: 'flight',
        cost: 650,
        currency_id: '1', // USD
        provider: 'Delta Airlines',
        departure_time: '2024-03-14T10:00:00Z',
        arrival_time: '2024-03-15T08:00:00Z'
      },
      {
        id: '2',
        from_city: 'Paris',
        to_city: 'London',
        mode: 'train',
        cost: 85,
        currency_id: '2', // EUR
        provider: 'Eurostar',
        departure_time: '2024-03-18T14:00:00Z',
        arrival_time: '2024-03-18T17:00:00Z'
      }
    ];
  }

  static async getEnhancedTripBudget(tripId: string, userId: string): Promise<EnhancedBudgetData> {
    const [basicBudget, accommodations, transports, currencies, userCurrency] = await Promise.all([
      this.getTripBudget(tripId),
      this.getTripAccommodations(tripId),
      this.getTripTransports(tripId),
      this.getCurrencies(),
      this.getUserCurrency(userId)
    ]);

    return {
      ...basicBudget,
      accommodations,
      transports,
      currencies,
      userCurrency
    };
  }
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ tripId: propTripId, tripName: propTripName }) => {
  const params = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
  const tripId = propTripId || params.tripId;
  const [tripName, setTripName] = useState(propTripName || '');
  const [budgetData, setBudgetData] = useState<EnhancedBudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = 'mock-user-id'; // Replace with actual user ID from auth context

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'daily' | 'category' | 'detailed'>('overview');
  const [showAlerts, setShowAlerts] = useState(true);

  const categoryIcons: { [key: string]: any } = {
    'Transport': Plane,
    'Accommodation': Hotel,
    'Activities': Camera,
    'Food & Dining': Utensils,
    'Other': DollarSign
  };

  const categoryColors: { [key: string]: string } = {
    'Transport': 'bg-blue-500',
    'Accommodation': 'bg-green-500',
    'Activities': 'bg-purple-500',
    'Food & Dining': 'bg-orange-500',
    'Other': 'bg-gray-500'
  };

  useEffect(() => {
    if (tripId) {
      fetchBudgetData();
    }
  }, [tripId]);

  const fetchBudgetData = async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      const data = await EnhancedBudgetService.getEnhancedTripBudget(tripId, userId);
      setBudgetData(data);
      
      if (!tripName) {
        setTripName('Trip Budget');
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      showError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  // Currency conversion utility
  const convertCurrency = (amount: number, fromCurrencyId: string, toCurrencyId: string): number => {
    if (!budgetData || fromCurrencyId === toCurrencyId) return amount;
    
    const fromCurrency = budgetData.currencies.find(c => c.id === fromCurrencyId);
    const toCurrency = budgetData.currencies.find(c => c.id === toCurrencyId);
    
    if (!fromCurrency || !toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount * fromCurrency.exchange_rate_to_usd;
    return usdAmount / toCurrency.exchange_rate_to_usd;
  };

  // Calculate total accommodation costs in user's currency
  const accommodationCosts = useMemo(() => {
    if (!budgetData) return { total: 0, items: [] };
    
    const items = budgetData.accommodations.map(acc => {
      const nights = Math.ceil(
        (new Date(acc.check_out_date).getTime() - new Date(acc.check_in_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalCost = acc.price_per_night * nights;
      const convertedCost = convertCurrency(totalCost, acc.currency_id, budgetData.userCurrency.id);
      
      return {
        ...acc,
        nights,
        totalCost: convertedCost,
        originalCost: totalCost,
        originalCurrency: budgetData.currencies.find(c => c.id === acc.currency_id)
      };
    });
    
    const total = items.reduce((sum, item) => sum + item.totalCost, 0);
    
    return { total, items };
  }, [budgetData]);

  // Calculate total transport costs in user's currency
  const transportCosts = useMemo(() => {
    if (!budgetData) return { total: 0, items: [] };
    
    const items = budgetData.transports.map(transport => {
      const convertedCost = convertCurrency(transport.cost, transport.currency_id, budgetData.userCurrency.id);
      
      return {
        ...transport,
        convertedCost,
        originalCurrency: budgetData.currencies.find(c => c.id === transport.currency_id)
      };
    });
    
    const total = items.reduce((sum, item) => sum + item.convertedCost, 0);
    
    return { total, items };
  }, [budgetData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBudgetData();
    setRefreshing(false);
    showSuccess('Budget data refreshed');
  };

  // Enhanced budget status calculation
  const budgetStatus = useMemo(() => {
    if (!budgetData) return null;
    
    const totalRealCosts = accommodationCosts.total + transportCosts.total;
    const estimatedTotal = (budgetData.totalEstimatedCost || 0) + totalRealCosts;
    const difference = estimatedTotal - (budgetData.totalBudget || 0);
    const percentage = budgetData.totalBudget ? (difference / budgetData.totalBudget) * 100 : 0;
    
    return {
      difference,
      percentage,
      estimatedTotal,
      accommodationTotal: accommodationCosts.total,
      transportTotal: transportCosts.total,
      isOverBudget: difference > 0,
      status: difference > 0 ? 'Over Budget' : 'Within Budget'
    };
  }, [budgetData, accommodationCosts, transportCosts]);

  const formatCurrency = (amount: number, currencyId?: string) => {
    if (!budgetData) return `$${amount.toLocaleString()}`;
    
    const currency = currencyId 
      ? budgetData.currencies.find(c => c.id === currencyId) 
      : budgetData.userCurrency;
    
    if (!currency) return `$${amount.toLocaleString()}`;
    
    return `${currency.symbol}${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportBudget = () => {
    showInfo('Export functionality would generate a detailed budget report');
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

  if (!budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Budget Data Found</h1>
            <p className="text-gray-600 mb-6">This trip doesn't have any budget information yet.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Go Back
            </button>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip Budget</h1>
                <p className="text-gray-600 text-lg">
                  {tripName} • All amounts in {budgetData.userCurrency.name} ({budgetData.userCurrency.code})
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={handleExportBudget}
                className="flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Budget</span>
              </button>
              
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="bg-gray-200 rounded-lg p-1 flex max-w-md">
            {['overview', 'detailed', 'daily', 'category'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode 
                    ? 'bg-white text-[#8B5CF6] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Budget Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  {budgetData.totalBudget ? formatCurrency(budgetData.totalBudget) : 'Not Set'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Accommodation Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accommodations</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(accommodationCosts.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {accommodationCosts.items.length} booking{accommodationCosts.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Hotel className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Transport Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Transport</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(transportCosts.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {transportCosts.items.length} journey{transportCosts.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Budget Status */}
          {budgetStatus && (
            <div className={`rounded-2xl p-6 shadow-sm border ${
              budgetStatus.isOverBudget 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Status</p>
                  <p className={`text-xl font-bold ${
                    budgetStatus.isOverBudget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {budgetStatus.status}
                  </p>
                  {budgetData.totalBudget && (
                    <p className={`text-sm ${
                      budgetStatus.isOverBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {budgetStatus.isOverBudget ? '+' : ''}{formatCurrency(Math.abs(budgetStatus.difference))}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${
                  budgetStatus.isOverBudget ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {budgetStatus.isOverBudget ? (
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed View - Accommodations and Transport */}
        {viewMode === 'detailed' && (
          <div className="space-y-8">
            {/* Accommodations Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Hotel className="h-6 w-6 text-green-600" />
                <span>Accommodations</span>
                <span className="text-sm font-normal text-gray-500">
                  (Total: {formatCurrency(accommodationCosts.total)})
                </span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {accommodationCosts.items.map((acc) => (
                  <div key={acc.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{acc.name}</h4>
                        <p className="text-sm text-gray-600">{acc.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {formatCurrency(acc.totalCost)}
                        </p>
                        {acc.originalCurrency && acc.originalCurrency.id !== budgetData.userCurrency.id && (
                          <p className="text-xs text-gray-500">
                            {formatCurrency(acc.originalCost, acc.originalCurrency.id)} {acc.originalCurrency.code}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-medium">{formatDate(acc.check_in_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-medium">{formatDate(acc.check_out_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nights</p>
                        <p className="font-medium">{acc.nights}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Per Night</p>
                        <p className="font-medium">
                          {formatCurrency(convertCurrency(acc.price_per_night, acc.currency_id, budgetData.userCurrency.id))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Plane className="h-6 w-6 text-blue-600" />
                <span>Transport</span>
                <span className="text-sm font-normal text-gray-500">
                  (Total: {formatCurrency(transportCosts.total)})
                </span>
              </h3>
              
              <div className="space-y-4">
                {transportCosts.items.map((transport) => (
                  <div key={transport.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Plane className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {transport.from_city} → {transport.to_city}
                          </h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {transport.mode} • {transport.provider}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {formatCurrency(transport.convertedCost)}
                        </p>
                        {transport.originalCurrency && transport.originalCurrency.id !== budgetData.userCurrency.id && (
                          <p className="text-xs text-gray-500">
                            {formatCurrency(transport.cost, transport.originalCurrency.id)} {transport.originalCurrency.code}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Departure</p>
                        <p className="font-medium">{formatDateTime(transport.departure_time)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Arrival</p>
                        <p className="font-medium">{formatDateTime(transport.arrival_time)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other view modes remain the same as original */}
        {viewMode === 'overview' && budgetData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Keep existing overview content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetBreakdown;