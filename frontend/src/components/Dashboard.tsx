import React, { useState } from 'react';
import TripPlanner from './TripPlanner';
import BudgetTracker from './BudgetTracker';
import Timeline from './Timeline';
import { Calendar, DollarSign, Map, Share2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'budget' | 'timeline' | 'share'>('planner');

  const tabs = [
    { id: 'planner', label: 'Trip Planner', icon: Map },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'share', label: 'Share', icon: Share2 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trip Dashboard</h1>
          <p className="text-gray-600">Plan, budget, and organize your perfect journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'planner' && <TripPlanner />}
            {activeTab === 'budget' && <BudgetTracker />}
            {activeTab === 'timeline' && <Timeline />}
            {activeTab === 'share' && (
              <div className="text-center py-12">
                <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Share Your Trip</h3>
                <p className="text-gray-500 mb-6">Share your travel plans with friends and family</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Share Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;