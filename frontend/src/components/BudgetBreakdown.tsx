import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';

interface BudgetData {
  totalBudget: number;
  totalEstimatedCost: number;
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

interface BudgetBreakdownProps {
  tripId: string;
  tripName: string;
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ tripId, tripName }) => {
  // Sample budget data - would come from API in real app
  const [budgetData] = useState<BudgetData>({
    totalBudget: 3000,
    totalEstimatedCost: 3250,
    currency: 'EUR',
    categories: {
      'Transport': { budgeted: 800, estimated: 750 },
      'Accommodation': { budgeted: 1200, estimated: 1300 },
      'Activities': { budgeted: 600, estimated: 750 },
      'Food & Dining': { budgeted: 400, estimated: 450 }
    },
    perDayCosts: [
      { day: 1, date: '2025-05-12', city: 'Paris', budgeted: 200, estimated: 220 },
      { day: 2, date: '2025-05-13', city: 'Paris', budgeted: 180, estimated: 195 },
      { day: 3, date: '2025-05-14', city: 'Paris', budgeted: 160, estimated: 175 },
      { day: 4, date: '2025-05-15', city: 'Rome', budgeted: 190, estimated: 210 },
      { day: 5, date: '2025-05-16', city: 'Rome', budgeted: 170, estimated: 185 },
      { day: 6, date: '2025-05-17', city: 'Rome', budgeted: 150, estimated: 160 }
    ],
    alerts: [
      'Accommodation spending is 8% over budget',
      'Day 4 exceeds daily budget by €20',
      'Activities category needs attention'
    ]
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'daily' | 'category'>('overview');
  const [showAlerts, setShowAlerts] = useState(true);

  const categoryIcons: { [key: string]: any } = {
    'Transport': Plane,
    'Accommodation': Hotel,
    'Activities': Camera,
    'Food & Dining': Utensils
  };

  const categoryColors: { [key: string]: string } = {
    'Transport': 'bg-blue-500',
    'Accommodation': 'bg-green-500',
    'Activities': 'bg-purple-500',
    'Food & Dining': 'bg-orange-500'
  };

  // Calculate budget status
  const budgetStatus = useMemo(() => {
    const difference = budgetData.totalEstimatedCost - budgetData.totalBudget;
    const percentage = (difference / budgetData.totalBudget) * 100;
    
    return {
      difference,
      percentage,
      isOverBudget: difference > 0,
      status: difference > 0 ? 'Over Budget' : 'Within Budget'
    };
  }, [budgetData]);

  // Calculate category percentages
  const categoryPercentages = useMemo(() => {
    return Object.entries(budgetData.categories).map(([category, data]) => ({
      category,
      percentage: (data.estimated / budgetData.totalEstimatedCost) * 100,
      ...data
    }));
  }, [budgetData]);

  const formatCurrency = (amount: number) => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
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
    alert('Budget export functionality would be implemented here');
  };

  const getCategoryStatus = (category: any) => {
    const difference = category.estimated - category.budgeted;
    const percentage = (difference / category.budgeted) * 100;
    
    return {
      difference,
      percentage,
      isOver: difference > 0,
      status: difference > 0 ? 'over' : 'under'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip Budget</h1>
              <p className="text-gray-600 text-lg">{tripName} • Financial Overview</p>
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
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
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
                  {formatCurrency(budgetData.totalBudget)}
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
                  {formatCurrency(budgetData.totalEstimatedCost)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Budget Status */}
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
                <p className={`text-sm ${
                  budgetStatus.isOverBudget ? 'text-red-600' : 'text-green-600'
                }`}>
                  {budgetStatus.isOverBudget ? '+' : ''}{formatCurrency(Math.abs(budgetStatus.difference))}
                </p>
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
                          <div className={`text-xs ${status.isOver ? 'text-red-500' : 'text-green-500'}`}>
                            {status.isOver ? '+' : ''}{formatCurrency(Math.abs(status.difference))}
                          </div>
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
                        <span>Budget: {formatCurrency(category.budgeted)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Spending Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Spending</h3>
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
            </div>
          </div>
        )}

        {viewMode === 'daily' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Budget Breakdown</h3>
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
                        {((data.estimated / budgetData.totalEstimatedCost) * 100).toFixed(1)}% of total budget
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Budgeted</span>
                      <span className="font-medium">{formatCurrency(data.budgeted)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated</span>
                      <span className="font-medium">{formatCurrency(data.estimated)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Difference</span>
                      <span className={`font-medium ${status.isOver ? 'text-red-600' : 'text-green-600'}`}>
                        {status.isOver ? '+' : ''}{formatCurrency(Math.abs(status.difference))}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div 
                        className={`h-3 rounded-full ${status.isOver ? 'bg-red-500' : categoryColors[category]}`}
                        style={{ width: `${Math.min((data.estimated / data.budgeted) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      {((data.estimated / data.budgeted) * 100).toFixed(1)}% of category budget used
                    </p>
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