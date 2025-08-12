import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  DollarSign,
  Plane,
  Hotel,
  Camera,
  Utensils,
  ArrowLeft,
  Loader2,
  Info
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  parseISO
} from 'date-fns';
import { ItineraryService, TripStop, TripActivity } from '../services/itineraryService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { supabase } from '../lib/supabase';

interface TripCalendarProps {
  tripId?: string;
  tripName?: string;
}

interface Trip {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  trip_type?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasTrips: boolean;
  trips: TripStop[];
}

const TripCalendar: React.FC<TripCalendarProps> = ({ tripId: propTripId, tripName: propTripName }) => {
  const params = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useToast();
  
  const tripId = propTripId || params.tripId || '';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const fetchTripData = useCallback(async () => {
    try {
      console.log('fetchTripData called with tripId:', tripId);
      setLoading(true);
      const { trip: tripData, stops: stopsData } = await ItineraryService.getTripWithStops(tripId);
      console.log('Trip data fetched:', { trip: tripData, stops: stopsData });
      setTrip(tripData);
      setStops(stopsData);
      
      // Set selected date to trip start date if available
      if (tripData.start_date) {
        setSelectedDate(parseISO(tripData.start_date));
        setCurrentMonth(parseISO(tripData.start_date));
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      showError('Failed to load trip data');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, [tripId]);

  const fetchAvailableTrips = useCallback(async () => {
    try {
      setLoadingTrips(true);
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableTrips(trips || []);
    } catch (error) {
      console.error('Error fetching available trips:', error);
      showError('Failed to load available trips');
    } finally {
      setLoadingTrips(false);
    }
  }, [user?.id, showError]);

  // Fetch trip data
  useEffect(() => {
    console.log('TripCalendar useEffect triggered:', { tripId, user: !!user });
    if (tripId && user) {
      fetchTripData();
    } else if (!tripId) {
      console.log('No tripId provided');
      setLoading(false);
    } else if (!user) {
      console.log('No user authenticated');
      setLoading(false);
    }
  }, [tripId, user, fetchTripData]);

  // Fetch available trips when user is authenticated
  useEffect(() => {
    if (user && !tripId) {
      fetchAvailableTrips();
    }
  }, [user, tripId, fetchAvailableTrips]);

  // Early return if no tripId
  if (!tripId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Trip</h2>
            <p className="text-gray-600 mb-8">Choose a trip to view its calendar</p>
            
            {/* Trip Selection */}
            <div className="max-w-4xl mx-auto">
              {loadingTrips ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]"></div>
                  <span className="ml-3 text-gray-600">Loading trips...</span>
                </div>
              ) : availableTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {availableTrips.map((trip) => (
                                         <div
                       key={trip.id}
                       className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => handleTripSelect(trip.id)}
                     >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-[#8B5CF6]/20 p-3 rounded-lg">
                          <Calendar className="h-6 w-6 text-[#8B5CF6]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{trip.name}</h3>
                          {trip.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {trip.start_date && trip.end_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">{trip.trip_type || 'Custom'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                                                 <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleTripSelect(trip.id);
                           }}
                           className="w-full bg-[#8B5CF6] text-white py-2 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors text-sm font-medium"
                         >
                           View Calendar
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trips Found</h3>
                  <p className="text-gray-600 mb-6">You haven't created any trips yet.</p>
                  <button
                    onClick={() => navigate('/create-trip')}
                    className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                  >
                    Create Your First Trip
                  </button>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/my-trips')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to My Trips
                </button>
                <button
                  onClick={() => navigate('/create-trip')}
                  className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                >
                  Create New Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Early return if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-8">Please sign in to view trip calendars.</p>
            <button
              onClick={() => navigate('/signin')}
              className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isTodayDate = isToday(day);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
      
      // Find trips that occur on this date
      const dayTrips = stops.filter((stop: TripStop) => {
        if (!stop.start_date || !stop.end_date) return false;
        const startDate = parseISO(stop.start_date);
        const endDate = parseISO(stop.end_date);
        return day >= startDate && day <= endDate;
      });

      return {
        date: day,
        isCurrentMonth,
        isToday: isTodayDate,
        isSelected,
        hasTrips: dayTrips.length > 0,
        trips: dayTrips
      };
    });
  }, [currentMonth, selectedDate, stops]);

  // Get activities for selected date
  const selectedDateActivities = useMemo(() => {
    if (!selectedDate) return [];
    
    const selectedDateStops = stops.filter(stop => {
      if (!stop.start_date || !stop.end_date) return false;
      const startDate = parseISO(stop.start_date);
      const endDate = parseISO(stop.end_date);
      return selectedDate >= startDate && selectedDate <= endDate;
    });

    const activities: TripActivity[] = [];
    selectedDateStops.forEach(stop => {
      if (stop.activities) {
        activities.push(...stop.activities);
      }
    });

    return activities;
  }, [selectedDate, stops]);

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const handleTripSelect = (tripId: string) => {
    navigate(`/calendar/${tripId}`);
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatShortDate = (date: Date) => {
    return format(date, 'MMM d');
  };

  const getActivityIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'transport':
        return <Plane className="h-4 w-4" />;
      case 'accommodation':
        return <Hotel className="h-4 w-4" />;
      case 'sightseeing':
      case 'culture':
        return <Camera className="h-4 w-4" />;
      case 'food':
      case 'dining':
        return <Utensils className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getActivityColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'transport':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accommodation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sightseeing':
      case 'culture':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'food':
      case 'dining':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
            <div className="ml-4 text-gray-600">
              <p>Loading trip calendar...</p>
              <p className="text-sm">Trip ID: {tripId || 'None'}</p>
              <p className="text-sm">User: {user ? 'Authenticated' : 'Not authenticated'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
            <p className="text-gray-600 mb-8">The trip you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/my-trips')}
              className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
            >
              Back to My Trips
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
          <button
            onClick={() => navigate('/my-trips')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to My Trips</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.name}</h1>
          <p className="text-gray-600 text-lg">Trip Calendar & Timeline View</p>
          
          {/* View Toggle */}
          <div className="bg-gray-200 rounded-lg p-1 flex max-w-md mt-4">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-[#8B5CF6] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline' 
                  ? 'bg-white text-[#8B5CF6] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day: CalendarDay, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative p-3 rounded-lg text-center transition-all duration-200 min-h-[80px] flex flex-col items-center justify-start
                          ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                          ${day.isToday ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200' : ''}
                          ${day.isSelected ? 'bg-[#8B5CF6] text-white shadow-lg scale-105' : ''}
                          ${!day.isSelected && !day.isToday && day.isCurrentMonth ? 'hover:bg-gray-100' : ''}
                          ${day.hasTrips && !day.isSelected ? 'ring-2 ring-green-400 bg-green-50' : ''}
                        `}
                      >
                        <span className="text-sm font-medium mb-1">
                          {format(day.date, 'd')}
                        </span>
                        
                        {/* Trip Indicators */}
                        {day.hasTrips && (
                          <div className="flex flex-col items-center space-y-1">
                            {day.trips.slice(0, 2).map((trip: TripStop, tripIndex: number) => (
                              <div
                                key={tripIndex}
                                className="w-2 h-2 bg-green-500 rounded-full"
                                title={`${trip.city?.name || 'Unknown City'}`}
                              ></div>
                            ))}
                            {day.trips.length > 2 && (
                              <div className="text-xs text-gray-500">+{day.trips.length - 2}</div>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Timeline View */}
                {stops.map((stop, index) => (
                  <div key={stop.id} className="relative">
                    {/* Timeline Line */}
                    {index < stops.length - 1 && (
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
                                Day {index + 1} - {stop.start_date && stop.end_date ? 
                                  `${format(parseISO(stop.start_date), 'MMM d')} - ${format(parseISO(stop.end_date), 'MMM d')}` : 
                                  'Dates TBD'
                                }
                              </h3>
                              <p className="text-purple-100">
                                {stop.start_date && stop.end_date ? 
                                  format(parseISO(stop.start_date), 'EEEE, MMMM d, yyyy') : 
                                  'Dates to be determined'
                                }
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{stop.city?.name || 'Unknown City'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-purple-100">
                              {stop.activities?.length || 0} {stop.activities?.length === 1 ? 'activity' : 'activities'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="p-6">
                        {stop.activities && stop.activities.length > 0 ? (
                          <div className="space-y-3">
                            {stop.activities.map((activity) => (
                              <div 
                                key={activity.id}
                                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow group"
                              >
                                {/* Time */}
                                {activity.start_time && (
                                  <div className="flex items-center space-x-1 text-[#8B5CF6] font-medium min-w-[60px]">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm">{activity.start_time}</span>
                                  </div>
                                )}

                                {/* Activity Details */}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                  {activity.activity?.category && (
                                    <p className="text-sm text-gray-600">{activity.activity.category}</p>
                                  )}
                                  {activity.notes && (
                                    <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                                  )}
                                </div>

                                {/* Cost */}
                                {activity.cost && (
                                  <div className="text-right">
                                    <div className="font-medium text-gray-900">
                                      ${activity.cost}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                                                 ) : (
                           <div className="text-center py-8 text-gray-500">
                             <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                             <p>No activities planned for this day</p>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Side Card - Trip Details */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {formatShortDate(selectedDate)}
                    </h3>
                    <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
                  </div>
                </div>

                {/* Activities for Selected Date */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Activities</h4>
                  {selectedDateActivities.length > 0 ? (
                    selectedDateActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                                                 <div className={`p-2 rounded-lg ${getActivityColor(activity.activity?.category || 'other')}`}>
                           {getActivityIcon(activity.activity?.category || 'other')}
                         </div>
                         <div className="flex-1">
                           <div className="font-medium text-gray-900">{activity.name}</div>
                           <div className="text-sm text-gray-600">{activity.activity?.category || 'Activity'}</div>
                          {activity.scheduled_date && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                              <Clock className="h-3 w-3" />
                              <span>{format(parseISO(activity.scheduled_date), 'h:mm a')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No activities planned for this date</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trip Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {trip.start_date && trip.end_date 
                      ? `${Math.ceil((parseISO(trip.end_date).getTime() - parseISO(trip.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : 'TBD'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cities</span>
                  <span className="font-medium">{stops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Activities</span>
                  <span className="font-medium">
                    {stops.reduce((total, stop) => total + (stop.activities?.length || 0), 0)}
                  </span>
                </div>
                {trip.start_date && trip.end_date && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Date Range</div>
                    <div className="text-sm font-medium text-gray-900">
                      {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                  className="w-full flex items-center space-x-3 p-3 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                  <span className="font-medium">Edit Itinerary</span>
                </button>
                <button
                  onClick={() => navigate(`/budget/${trip.id}`)}
                  className="w-full flex items-center space-x-3 p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">View Budget</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCalendar;