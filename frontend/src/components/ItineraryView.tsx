import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Info, 
  Camera, 
  Download, 
  Printer, 
  List, 
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Share2
} from 'lucide-react';

interface Activity {
  activityId: string;
  time?: string;
  name: string;
  cost?: number;
  currency?: string;
  description?: string;
  isPhotoSpot?: boolean;
}

interface Day {
  dayLabel: string;
  date: string;
  weekday: string;
  activities: Activity[];
}

interface City {
  cityId: string;
  cityName: string;
  arrivalDate: string;
  departureDate: string;
  days: Day[];
}

interface Trip {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  coverPhotoURL?: string;
  itinerary: City[];
}

type ViewMode = 'list' | 'calendar';

const ItineraryView: React.FC = () => {
  // Sample data - would come from API in real app
  const [trip] = useState<Trip>({
    tripId: "uuid-1234",
    tripName: "Europe Summer Tour 2025",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    coverPhotoURL: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    itinerary: [
      {
        cityId: "paris",
        cityName: "Paris",
        arrivalDate: "2025-05-12",
        departureDate: "2025-05-15",
        days: [
          {
            dayLabel: "Day 1",
            date: "2025-05-12",
            weekday: "Monday",
            activities: [
              {
                activityId: "louvre",
                time: "10:00",
                name: "Visit the Louvre",
                cost: 17,
                currency: "EUR",
                description: "Buy tickets online to skip the queue. World's largest art museum.",
                isPhotoSpot: true
              },
              {
                activityId: "lunch-cafe",
                time: "13:00",
                name: "Lunch at Café de Flore",
                cost: 35,
                currency: "EUR",
                description: "Historic café in Saint-Germain-des-Prés"
              },
              {
                activityId: "eiffel",
                time: "18:30",
                name: "Eiffel Tower Sunset",
                cost: 25,
                currency: "EUR",
                description: "Best views from Trocadéro Gardens",
                isPhotoSpot: true
              }
            ]
          },
          {
            dayLabel: "Day 2",
            date: "2025-05-13",
            weekday: "Tuesday",
            activities: [
              {
                activityId: "versailles",
                time: "09:00",
                name: "Palace of Versailles",
                cost: 20,
                currency: "EUR",
                description: "Take RER C train from central Paris. Allow full day.",
                isPhotoSpot: true
              }
            ]
          },
          {
            dayLabel: "Day 3",
            date: "2025-05-14",
            weekday: "Wednesday",
            activities: [
              {
                activityId: "montmartre",
                time: "10:00",
                name: "Montmartre & Sacré-Cœur",
                cost: 0,
                currency: "EUR",
                description: "Free to visit. Take funicular or walk up the steps.",
                isPhotoSpot: true
              },
              {
                activityId: "seine-cruise",
                time: "16:00",
                name: "Seine River Cruise",
                cost: 15,
                currency: "EUR",
                description: "1-hour cruise with audio guide"
              }
            ]
          }
        ]
      },
      {
        cityId: "rome",
        cityName: "Rome",
        arrivalDate: "2025-05-15",
        departureDate: "2025-05-20",
        days: [
          {
            dayLabel: "Day 1",
            date: "2025-05-15",
            weekday: "Thursday",
            activities: [
              {
                activityId: "colosseum",
                time: "14:00",
                name: "Colosseum & Roman Forum",
                cost: 16,
                currency: "EUR",
                description: "Skip-the-line tickets included. Allow 3-4 hours.",
                isPhotoSpot: true
              }
            ]
          },
          {
            dayLabel: "Day 2",
            date: "2025-05-16",
            weekday: "Friday",
            activities: [
              {
                activityId: "vatican",
                time: "09:00",
                name: "Vatican Museums & Sistine Chapel",
                cost: 20,
                currency: "EUR",
                description: "Early morning entry to avoid crowds",
                isPhotoSpot: true
              },
              {
                activityId: "trevi",
                time: "15:00",
                name: "Trevi Fountain & Spanish Steps",
                cost: 0,
                currency: "EUR",
                description: "Free attractions. Best photos in late afternoon.",
                isPhotoSpot: true
              }
            ]
          }
        ]
      }
    ]
  });

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(trip.startDate));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
    const endDate = new Date(end).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${startDate} – ${endDate}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
    };
    return `${symbols[currency] || currency}${amount}`;
  };

  const getTotalCost = () => {
    let total = 0;
    let currency = 'EUR';
    
    trip.itinerary.forEach(city => {
      city.days.forEach(day => {
        day.activities.forEach(activity => {
          if (activity.cost) {
            total += activity.cost;
            currency = activity.currency || currency;
          }
        });
      });
    });
    
    return { total, currency };
  };

  const handleExportPDF = () => {
    // In real app, this would generate a PDF
    alert('PDF export functionality would be implemented here');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.tripName,
        text: `Check out my ${trip.tripName} itinerary!`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const filteredItinerary = trip.itinerary.map(city => ({
    ...city,
    days: city.days.map(day => ({
      ...day,
      activities: day.activities.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })).filter(day => day.activities.length > 0)
  })).filter(city => city.days.length > 0);

  const renderListView = () => (
    <div className="space-y-8">
      {filteredItinerary.map((city, cityIndex) => (
        <div key={city.cityId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* City Header */}
          <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{city.cityName}</h2>
                <p className="text-purple-100">
                  {formatDateRange(city.arrivalDate, city.departureDate)}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <MapPin className="h-6 w-6 mb-1" />
                  <div className="text-sm font-medium">
                    {city.days.length} {city.days.length === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="p-6">
            {city.days.map((day, dayIndex) => (
              <div key={`${city.cityId}-${day.date}`} className={`${dayIndex > 0 ? 'mt-8' : ''}`}>
                {/* Day Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-[#8B5CF6]/20 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {day.dayLabel} – {formatDate(day.date)}
                    </h3>
                    <p className="text-gray-600 text-sm">{day.weekday}</p>
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-3 ml-10">
                  {day.activities.map((activity, activityIndex) => (
                    <div 
                      key={activity.activityId}
                      className={`bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow ${
                        activityIndex % 2 === 1 ? 'bg-gray-100/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {activity.time && (
                              <div className="flex items-center space-x-1 text-[#8B5CF6] text-sm font-medium">
                                <Clock className="h-4 w-4" />
                                <span>{activity.time}</span>
                              </div>
                            )}
                            <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                            {activity.isPhotoSpot && (
                              <Camera className="h-4 w-4 text-orange-500" title="Photo spot" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {activity.cost !== undefined && (
                              <span className="text-green-600 font-medium">
                                {activity.cost === 0 ? 'Free' : formatCurrency(activity.cost, activity.currency || 'EUR')}
                              </span>
                            )}
                            
                            {activity.description && (
                              <div className="relative">
                                <button
                                  onClick={() => setSelectedTooltip(
                                    selectedTooltip === activity.activityId ? null : activity.activityId
                                  )}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
                                >
                                  <Info className="h-4 w-4" />
                                  <span>Info</span>
                                </button>
                                
                                {selectedTooltip === activity.activityId && (
                                  <div className="absolute top-full left-0 mt-2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10 max-w-xs">
                                    <p className="text-sm">{activity.description}</p>
                                    <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
        <p className="text-gray-600">Calendar view implementation would go here</p>
        <p className="text-sm text-gray-500 mt-2">
          This would show activities in a calendar grid format, color-coded by city
        </p>
      </div>
    </div>
  );

  const { total: totalCost, currency } = getTotalCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.tripName}</h1>
              <p className="text-gray-600 text-lg">
                {formatDateRange(trip.startDate, trip.endDate)} • {trip.itinerary.length} cities
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {/* View Toggle */}
              <div className="bg-gray-200 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#8B5CF6] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-white text-[#8B5CF6] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>Calendar</span>
                </button>
              </div>

              {/* Export Buttons */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">{trip.itinerary.length}</div>
              <div className="text-gray-600 text-sm">Cities</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">
                {trip.itinerary.reduce((total, city) => total + city.days.length, 0)}
              </div>
              <div className="text-gray-600 text-sm">Days</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-[#8B5CF6]">
                {trip.itinerary.reduce((total, city) => 
                  total + city.days.reduce((dayTotal, day) => dayTotal + day.activities.length, 0), 0
                )}
              </div>
              <div className="text-gray-600 text-sm">Activities</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalCost, currency)}
              </div>
              <div className="text-gray-600 text-sm">Total Cost</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? renderListView() : renderCalendarView()}

        {/* Empty State for Search */}
        {searchQuery && filteredItinerary.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Click outside to close tooltips */}
      {selectedTooltip && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setSelectedTooltip(null)}
        />
      )}
    </div>
  );
};

export default ItineraryView;