import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Edit,
  DollarSign,
  GripVertical,
  Filter,
  Search
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  time?: string;
  cost?: number;
  currency?: string;
  category: string;
}

interface Day {
  date: string;
  city: string;
  activities: Activity[];
}

interface TripCalendarProps {
  tripId: string;
  tripName: string;
}

const TripCalendar: React.FC<TripCalendarProps> = ({ tripId, tripName }) => {
  // Sample data - would come from API in real app
  const [days] = useState<Day[]>([
    {
      date: "2025-05-12",
      city: "Paris",
      activities: [
        { id: "act1", name: "Eiffel Tower Tour", time: "09:00", cost: 35, currency: "EUR", category: "Sightseeing" },
        { id: "act2", name: "Louvre Museum", time: "13:00", cost: 25, currency: "EUR", category: "Culture" },
        { id: "act3", name: "Seine River Cruise", time: "18:30", cost: 45, currency: "EUR", category: "Sightseeing" }
      ]
    },
    {
      date: "2025-05-13",
      city: "Paris",
      activities: [
        { id: "act4", name: "Montmartre Walking Tour", time: "10:00", cost: 15, currency: "EUR", category: "Culture" },
        { id: "act5", name: "French Cooking Class", time: "15:00", cost: 85, currency: "EUR", category: "Food" }
      ]
    },
    {
      date: "2025-05-14",
      city: "Paris → Rome",
      activities: [
        { id: "act6", name: "Train to Rome", time: "08:00", cost: 90, currency: "EUR", category: "Transport" },
        { id: "act7", name: "Hotel Check-in", time: "15:00", cost: 0, currency: "EUR", category: "Accommodation" }
      ]
    },
    {
      date: "2025-05-15",
      city: "Rome",
      activities: [
        { id: "act8", name: "Colosseum Tour", time: "10:00", cost: 40, currency: "EUR", category: "Sightseeing" },
        { id: "act9", name: "Roman Forum Visit", time: "14:00", cost: 20, currency: "EUR", category: "Culture" }
      ]
    },
    {
      date: "2025-05-16",
      city: "Rome",
      activities: [
        { id: "act10", name: "Vatican Museums", time: "09:00", cost: 30, currency: "EUR", category: "Culture" },
        { id: "act11", name: "Trevi Fountain", time: "16:00", cost: 0, currency: "EUR", category: "Sightseeing" }
      ]
    }
  ]);

  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('timeline');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Sightseeing', 'Culture', 'Food', 'Transport', 'Accommodation'];

  const categoryColors: { [key: string]: string } = {
    'Sightseeing': 'bg-blue-500',
    'Culture': 'bg-purple-500',
    'Food': 'bg-orange-500',
    'Transport': 'bg-green-500',
    'Accommodation': 'bg-gray-500'
  };

  // Filter activities based on search and category
  const filteredDays = useMemo(() => {
    return days.map(day => ({
      ...day,
      activities: day.activities.filter(activity => {
        const matchesSearch = searchQuery === '' || 
          activity.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
    })).filter(day => day.activities.length > 0 || searchQuery === '');
  }, [days, searchQuery, filterCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
    };
    return amount === 0 ? 'Free' : `${symbols[currency] || currency}${amount}`;
  };

  const getDayNumber = (dateString: string) => {
    const startDate = new Date(days[0]?.date || dateString);
    const currentDate = new Date(dateString);
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const getTotalStats = () => {
    const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0);
    const totalCost = days.reduce((sum, day) => 
      sum + day.activities.reduce((daySum, activity) => daySum + (activity.cost || 0), 0), 0
    );
    const uniqueCities = [...new Set(days.map(day => day.city.split(' →')[0]))];
    
    return {
      totalDays: days.length,
      totalActivities,
      totalCost,
      totalCities: uniqueCities.length
    };
  };

  const stats = getTotalStats();

  const renderTimelineView = () => (
    <div className="space-y-6">
      {filteredDays.map((day, index) => (
        <div key={day.date} className="relative">
          {/* Timeline Line */}
          {index < filteredDays.length - 1 && (
            <div className="absolute left-8 top-20 w-0.5 h-16 bg-gray-300 z-0"></div>
          )}

          {/* Day Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Day {getDayNumber(day.date)} - {formatShortDate(day.date)}
                    </h3>
                    <p className="text-purple-100">{formatDate(day.date)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{day.city}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-100">
                    {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                  </div>
                  <div className="text-lg font-semibold">
                    €{day.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-6">
              {day.activities.length > 0 ? (
                <div className="space-y-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div 
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                      {/* Drag Handle */}
                      <div className="cursor-move text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4" />
                      </div>

                      {/* Time */}
                      {activity.time && (
                        <div className="flex items-center space-x-1 text-[#8B5CF6] font-medium min-w-[60px]">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{activity.time}</span>
                        </div>
                      )}

                      {/* Category Color */}
                      <div className={`w-3 h-3 rounded-full ${categoryColors[activity.category] || 'bg-gray-400'}`}></div>

                      {/* Activity Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-600">{activity.category}</p>
                      </div>

                      {/* Cost */}
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(activity.cost || 0, activity.currency || 'EUR')}
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No activities planned for this day</p>
                  <button className="mt-2 text-[#8B5CF6] hover:text-purple-400 font-medium">
                    Add Activity
                  </button>
                </div>
              )}

              {/* Add Activity Button */}
              <button className="w-full mt-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="text-center py-12">
        <Grid3X3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar Grid View</h3>
        <p className="text-gray-600 mb-4">
          Interactive calendar grid with drag-and-drop functionality
        </p>
        <p className="text-sm text-gray-500">
          This view would show a monthly/weekly calendar with activities displayed in date cells
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{tripName}</h1>
              <p className="text-gray-600 text-lg">
                {formatShortDate(days[0]?.date)} - {formatShortDate(days[days.length - 1]?.date)} • 
                Visual Timeline & Calendar
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="bg-gray-200 rounded-lg p-1 flex mt-4 lg:mt-0">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white text-[#8B5CF6] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Timeline</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-[#8B5CF6] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">{stats.totalDays}</div>
              <div className="text-gray-600 text-sm">Days</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">{stats.totalCities}</div>
              <div className="text-gray-600 text-sm">Cities</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">{stats.totalActivities}</div>
              <div className="text-gray-600 text-sm">Activities</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">€{stats.totalCost}</div>
              <div className="text-gray-600 text-sm">Total Cost</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl text-gray-900 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'timeline' ? renderTimelineView() : renderCalendarView()}

        {/* Empty State for Search */}
        {searchQuery && filteredDays.every(day => day.activities.length === 0) && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCalendar;