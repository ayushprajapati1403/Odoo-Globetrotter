import React from 'react';
import { DollarSign, TrendingUp, PieChart, AlertCircle } from 'lucide-react';

const BudgetTracker: React.FC = () => {
  const budgetData = {
    totalBudget: 5000,
    spent: 2350,
    remaining: 2650,
    categories: [
      { name: 'Flights', budgeted: 1500, spent: 1200, color: 'bg-blue-500' },
      { name: 'Hotels', budgeted: 2000, spent: 800, color: 'bg-green-500' },
      { name: 'Food', budgeted: 800, spent: 350, color: 'bg-yellow-500' },
      { name: 'Activities', budgeted: 700, spent: 0, color: 'bg-purple-500' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Budget</p>
              <p className="text-2xl font-bold">${budgetData.totalBudget}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Spent</p>
              <p className="text-2xl font-bold">${budgetData.spent}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Remaining</p>
              <p className="text-2xl font-bold">${budgetData.remaining}</p>
            </div>
            <PieChart className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
        <div className="space-y-4">
          {budgetData.categories.map((category, index) => {
            const percentage = (category.spent / category.budgeted) * 100;
            const isOverBudget = category.spent > category.budgeted;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      ${category.spent} / ${category.budgeted}
                    </span>
                    {isOverBudget && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color} ${isOverBudget ? 'bg-red-500' : ''}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% used
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;