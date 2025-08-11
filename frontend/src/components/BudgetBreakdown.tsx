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

interface BudgetBreakdownProps {
  tripId?: string;
  tripName?: string;
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ tripId: propTripId, tripName: propTripName }) => {
  const params = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
  const tripId = propTripId || params.tripId;
  const [tripName, setTripName] = useState(propTripName || '');
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'daily' | 'category'>('overview');
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
      const data = await BudgetService.getTripBudget(tripId);
      setBudgetData(data);
      
      // If we don't have a trip name, try to get it from the URL or set a default
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBudgetData();
    setRefreshing(false);
    showSuccess('Budget data refreshed');
  };

  // Calculate budget status
  const budgetStatus = useMemo(() => {
    if (!budgetData) return null;
    
    const difference = (budgetData.totalEstimatedCost || 0) - (budgetData.totalBudget || 0);
    const percentage = budgetData.totalBudget ? (difference / budgetData.totalBudget) * 100 : 0;
    
    return {
      difference,
      percentage,
      isOverBudget: difference > 0,
      status: difference > 0 ? 'Over Budget' : 'Within Budget'
    };
  }, [budgetData]);

  // Calculate category percentages
  const categoryPercentages = useMemo(() => {
    if (!budgetData) return [];
    
    return Object.entries(budgetData.categories).map(([category, data]) => ({
      category,
      percentage: budgetData.totalEstimatedCost ? (data.estimated / budgetData.totalEstimatedCost) * 100 : 0,
      ...data
    }));
  }, [budgetData]);

  const formatCurrency = (amount: number) => {
    if (!budgetData) return `$${amount.toLocaleString()}`;
    
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
    return `${symbols[budgetData.currency] || budgetData.currency}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleExportBudget = () => {
    // In real app, this would generate a PDF or CSV
    showInfo('Export functionality would be implemented here');
  };

  const getCategoryStatus = (category: any) => {
    const difference = category.estimated - category.budgeted;
    const percentage = category.budgeted ? (difference / category.budgeted) * 100 : 0;
    
    return {
      difference,
      percentage,
      isOver: difference > 0,
      status: difference > 0 ? 'over' : 'under'
    };
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
                <p className="text-gray-600 text-lg">{tripName} • Financial Overview</p>
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
            <button
              onClick={() => setViewMode('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'overview' 
                  ? 'bg-white text-[#8B5CF6] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'daily' 
                  ? 'bg-white text-[#8B5CF6] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'category' 
                  ? 'bg-white text-[#8B5CF6] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Budget Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">
                  {budgetData.totalBudget ? formatCurrency(budgetData.totalBudget) : 'Not Set'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Estimated Cost */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Estimated Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(budgetData.totalEstimatedCost || 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <PieChart className="h-8 w-8 text-purple-600" />
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
                  <p className={`text-3xl font-bold ${
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
                    <TrendingUp className={`h-8 w-8 ${budgetStatus.isOverBudget ? 'text-red-600' : 'text-green-600'}`} />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Alerts */}
        {showAlerts && budgetData.alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Budget Alerts</h3>
                  <ul className="space-y-1">
                    {budgetData.alerts.map((alert, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowAlerts(false)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryPercentages.map((category) => {
                  const Icon = categoryIcons[category.category];
                  const status = getCategoryStatus(category);
                  
                  return (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${categoryColors[category.category]} p-2 rounded-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(category.estimated)}
                          </div>
                          {category.budgeted > 0 && (
                            <div className={`text-xs ${status.isOver ? 'text-red-500' : 'text-green-500'}`}>
                              {status.isOver ? '+' : ''}{formatCurrency(Math.abs(status.difference))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${categoryColors[category.category]} ${status.isOver ? 'bg-red-500' : ''}`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{category.percentage.toFixed(1)}% of total</span>
                        {category.budgeted > 0 ? (
                          <span>Budget: {formatCurrency(category.budgeted)}</span>
                        ) : (
                          <span>No budget set</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Spending Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Spending</h3>
              {budgetData.perDayCosts.length > 0 ? (
                <div className="space-y-4">
                  {budgetData.perDayCosts.map((day) => {
                    const isOverBudget = day.estimated > day.budgeted;
                    const percentage = (day.estimated / Math.max(...budgetData.perDayCosts.map(d => d.estimated))) * 100;
                    
                    return (
                      <div key={day.day} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-[#8B5CF6]/20 p-2 rounded-lg">
                              <Calendar className="h-4 w-4 text-[#8B5CF6]" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Day {day.day} - {formatDate(day.date)}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{day.city}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                              {formatCurrency(day.estimated)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Budget: {formatCurrency(day.budgeted)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-[#8B5CF6]'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No daily cost data available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'daily' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Budget Breakdown</h3>
            {budgetData.perDayCosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Day</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">City</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Budgeted</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Estimated</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetData.perDayCosts.map((day) => {
                      const difference = day.estimated - day.budgeted;
                      const isOver = difference > 0;
                      
                      return (
                        <tr key={day.day} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">Day {day.day}</td>
                          <td className="py-3 px-4 text-gray-600">{formatDate(day.date)}</td>
                          <td className="py-3 px-4 text-gray-600">{day.city}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(day.budgeted)}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(day.estimated)}</td>
                          <td className={`py-3 px-4 text-right font-medium ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                            {isOver ? '+' : ''}{formatCurrency(Math.abs(difference))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No daily cost data available</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(budgetData.categories).map(([category, data]) => {
              const Icon = categoryIcons[category];
              const status = getCategoryStatus({ ...data, category });
              
              return (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`${categoryColors[category]} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {((data.estimated / (budgetData.totalEstimatedCost || 1)) * 100).toFixed(1)}% of total budget
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Budgeted</span>
                      <span className="font-medium">
                        {data.budgeted > 0 ? formatCurrency(data.budgeted) : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated</span>
                      <span className="font-medium">{formatCurrency(data.estimated)}</span>
                    </div>
                    {data.budgeted > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Difference</span>
                        <span className={`font-medium ${status.isOver ? 'text-red-600' : 'text-green-600'}`}>
                          {status.isOver ? '+' : ''}{formatCurrency(Math.abs(status.difference))}
                        </span>
                      </div>
                    )}
                    
                    {data.budgeted > 0 && (
                      <>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                          <div 
                            className={`h-3 rounded-full ${status.isOver ? 'bg-red-500' : categoryColors[category]}`}
                            style={{ width: `${Math.min((data.estimated / data.budgeted) * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        <p className="text-xs text-gray-500 text-center">
                          {((data.estimated / data.budgeted) * 100).toFixed(1)}% of category budget used
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetBreakdown;