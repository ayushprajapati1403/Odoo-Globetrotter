import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Share2,
  ArrowLeft,
  Edit,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { ItineraryService, TripStop, TripActivity } from '../services/itineraryService';
import { canEditTrip } from '../utils/permissions';

interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_public: boolean;
  cover_photo_url: string | null;
  currency: string;
  total_estimated_cost: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  trip_type: string;
  created_by: string | null;
}

interface Day {
  date: string;
  weekday: string;
  activities: TripActivity[];
}

type ViewMode = 'list' | 'calendar';

const ItineraryView: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (tripId && user) {
      fetchTripData();
    }
  }, [tripId, user]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const { trip: tripData, stops: stopsData } = await ItineraryService.getTripWithStops(tripId!);
      
      // Check if user can view this trip
      if (!canEditTrip(tripData, user) && !tripData.is_public) {
        showError('Access Denied', 'You do not have permission to view this trip');
        navigate('/my-trips');
        return;
      }

      setTrip(tripData);
      setStops(stopsData);
      
      // Set selected date to first day of trip
      if (tripData.start_date) {
        setSelectedDate(tripData.start_date);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      showError('Error', 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getTotalCost = () => {
    let total = 0;
    stops.forEach(stop => {
      // Add local transport and accommodation costs
      if (stop.local_transport_cost) total += stop.local_transport_cost;
      if (stop.accommodation_estimate) total += stop.accommodation_estimate;
      
      // Add activity costs (this would need to be fetched separately)
      // For now, we'll just show the basic costs
    });
    return total;
  };

  const getActivitiesForDate = (date: string): TripActivity[] => {
    const activities: TripActivity[] = [];
    stops.forEach(stop => {
      // This is a simplified approach - in a real app you'd fetch activities for each stop
      // For now, we'll return empty array
    });
    return activities;
  };

  const handleExportPDF = () => {
    showError('Not Implemented', 'PDF export will be available soon');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip?.name || 'My Trip',
        text: `Check out my trip: ${trip?.name}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link Copied', 'Trip link has been copied to clipboard');
    }
  };

  const renderListView = () => (
    <div className="space-y-6">
      {stops.map((stop, index) => (
        <div key={stop.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#8B5CF6]/20 p-3 rounded-lg">
                <span className="text-[#8B5CF6] font-semibold text-lg">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {stop.city?.name || 'Unknown City'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {stop.start_date && stop.end_date 
                        ? `${formatDateShort(stop.start_date)} - ${formatDateShort(stop.end_date)}`
                        : 'Dates TBD'
                      }
                    </span>
                  </span>
                  {stop.start_date && stop.end_date && (
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.ceil((new Date(stop.end_date).getTime() - new Date(stop.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {canEditTrip(trip!, user) && (
              <button
                onClick={() => navigate(`/itinerary/${tripId}`)}
                className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {stop.notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{stop.notes}</p>
            </div>
          )}

          {/* Cost Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {stop.local_transport_cost && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Local Transport</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatCurrency(stop.local_transport_cost, trip?.currency || 'USD')}
                </div>
              </div>
            )}
            {stop.accommodation_estimate && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Accommodation</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(stop.accommodation_estimate, trip?.currency || 'USD')}
                </div>
              </div>
            )}
          </div>

          {/* Activities placeholder */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Activities</h4>
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Activities will be displayed here</p>
              <p className="text-sm">Use the itinerary builder to add activities</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
        <p className="text-gray-600">Calendar view will be available soon</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading itinerary...</p>
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
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.name}</h1>
              {trip.description && (
                <p className="text-gray-600 text-lg mb-2">{trip.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {trip.start_date && trip.end_date 
                      ? `${formatDateShort(trip.start_date)} - ${formatDateShort(trip.end_date)}`
                      : 'Dates TBD'
                    }
                  </span>
                </span>
                {trip.start_date && trip.end_date && (
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {canEditTrip(trip, user) && (
                <button
                  onClick={() => navigate(`/itinerary/${tripId}`)}
                  className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Itinerary</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stops.length}</div>
                <div className="text-gray-600 text-sm">Cities</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {trip.start_date && trip.end_date 
                    ? Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24))
                    : 'TBD'
                  }
                </div>
                <div className="text-gray-600 text-sm">Days</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-gray-600 text-sm">Activities</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                <span className="text-2xl font-bold text-[#8B5CF6]">$</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getTotalCost(), trip.currency || 'USD').replace('$', '')}
                </div>
                <div className="text-gray-600 text-sm">Total Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <List className="h-4 w-4 inline mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Grid3X3 className="h-4 w-4 inline mr-2" />
              Calendar View
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? renderListView() : renderCalendarView()}
      </div>
    </div>
  );
};

export default ItineraryView;
