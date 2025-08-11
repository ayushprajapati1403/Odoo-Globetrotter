import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  GripVertical,
  Search,
  X,
  Save,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { ItineraryService, TripStop, TripActivity, City } from '../services/itineraryService';
import { canEditTrip } from '../utils/permissions';
import TripSuggestions from './TripSuggestions';

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

const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showCityModal, setShowCityModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<TripActivity | null>(null);

  // Form states
  const [cityForm, setCityForm] = useState({
    city_id: '',
    start_date: '',
    end_date: '',
    notes: '',
    local_transport_cost: '',
    accommodation_estimate: ''
  });

  const [activityForm, setActivityForm] = useState({
    name: '',
    scheduled_date: '',
    start_time: '',
    duration_minutes: '',
    cost: '',
    notes: ''
  });

  // City search
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<City[]>([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);

  useEffect(() => {
    if (tripId && user) {
      fetchTripData();
    }
  }, [tripId, user]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const { trip: tripData, stops: stopsData } = await ItineraryService.getTripWithStops(tripId!);
      
      // Check permissions
      if (!canEditTrip(tripData, user)) {
        showError('Access Denied', 'You do not have permission to edit this trip');
        navigate('/my-trips');
        return;
      }

      setTrip(tripData);
      setStops(stopsData);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      showError('Error', 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySearchResults([]);
      return;
    }

    try {
      setCitySearchLoading(true);
      const results = await ItineraryService.searchCities(query);
      setCitySearchResults(results);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setCitySearchLoading(false);
    }
  };

  const handleAddCity = async () => {
    try {
      setSaving(true);
      
      const newStop = await ItineraryService.addCityToTrip(tripId!, {
        city_id: cityForm.city_id,
        start_date: cityForm.start_date,
        end_date: cityForm.end_date,
        notes: cityForm.notes || undefined,
        local_transport_cost: cityForm.local_transport_cost ? parseFloat(cityForm.local_transport_cost) : undefined,
        accommodation_estimate: cityForm.accommodation_estimate ? parseFloat(cityForm.accommodation_estimate) : undefined
      });

      setStops(prev => [...prev, newStop]);
      setShowCityModal(false);
      resetCityForm();
      showSuccess('City Added', 'New city has been added to your trip');
    } catch (error) {
      console.error('Error adding city:', error);
      showError('Error', 'Failed to add city to trip');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCity = async (stopId: string) => {
    try {
      setSaving(true);
      
      const updatedStop = await ItineraryService.updateTripStop(stopId, {
        start_date: cityForm.start_date,
        end_date: cityForm.end_date,
        notes: cityForm.notes || undefined,
        local_transport_cost: cityForm.local_transport_cost ? parseFloat(cityForm.local_transport_cost) : undefined,
        accommodation_estimate: cityForm.accommodation_estimate ? parseFloat(cityForm.accommodation_estimate) : undefined
      });

      setStops(prev => prev.map(stop => stop.id === stopId ? updatedStop : stop));
      setShowCityModal(false);
      resetCityForm();
      showSuccess('City Updated', 'City details have been updated');
    } catch (error) {
      console.error('Error updating city:', error);
      showError('Error', 'Failed to update city');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCity = async (stopId: string) => {
    if (!confirm('Are you sure you want to delete this city? All activities will also be removed.')) {
      return;
    }

    try {
      await ItineraryService.deleteTripStop(stopId);
      setStops(prev => prev.filter(stop => stop.id !== stopId));
      showSuccess('City Deleted', 'City has been removed from your trip');
    } catch (error) {
      console.error('Error deleting city:', error);
      showError('Error', 'Failed to delete city');
    }
  };

  const handleAddActivity = async () => {
    try {
      setSaving(true);
      
      const newActivity = await ItineraryService.addActivityToStop(selectedStopId!, {
        name: activityForm.name,
        scheduled_date: activityForm.scheduled_date,
        start_time: activityForm.start_time || undefined,
        duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : undefined,
        cost: activityForm.cost ? parseFloat(activityForm.cost) : undefined,
        notes: activityForm.notes || undefined
      });

      // Refresh the stops to get updated activity data
      await fetchTripData();
      
      setShowActivityModal(false);
      resetActivityForm();
      showSuccess('Activity Added', 'New activity has been added');
    } catch (error) {
      console.error('Error adding activity:', error);
      showError('Error', 'Failed to add activity');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateActivity = async (activityId: string) => {
    try {
      setSaving(true);
      
      const updatedActivity = await ItineraryService.updateTripActivity(activityId, {
        name: activityForm.name,
        scheduled_date: activityForm.scheduled_date,
        start_time: activityForm.start_time || undefined,
        duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : undefined,
        cost: activityForm.cost ? parseFloat(activityForm.cost) : undefined,
        notes: activityForm.notes || undefined
      });

      // Refresh the stops to get updated activity data
      await fetchTripData();
      
      setShowActivityModal(false);
      resetActivityForm();
      showSuccess('Activity Updated', 'Activity has been updated');
    } catch (error) {
      console.error('Error updating activity:', error);
      showError('Error', 'Failed to update activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async (stopId: string, activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await ItineraryService.deleteTripActivity(activityId);
      // Refresh the stops to get updated activity data
      await fetchTripData();
      showSuccess('Activity Deleted', 'Activity has been removed');
    } catch (error) {
      console.error('Error deleting activity:', error);
      showError('Error', 'Failed to delete activity');
    }
  };

  const resetCityForm = () => {
    setCityForm({
      city_id: '',
      start_date: '',
      end_date: '',
      notes: '',
      local_transport_cost: '',
      accommodation_estimate: ''
    });
    setSelectedStopId(null);
  };

  const resetActivityForm = () => {
    setActivityForm({
      name: '',
      scheduled_date: '',
      start_time: '',
      duration_minutes: '',
      cost: '',
      notes: ''
    });
    setEditingActivity(null);
    setSelectedStopId(null);
  };

  const openCityModal = (stop?: TripStop) => {
    if (stop) {
      setCityForm({
        city_id: stop.city_id,
        start_date: stop.start_date || '',
        end_date: stop.end_date || '',
        notes: stop.notes || '',
        local_transport_cost: stop.local_transport_cost?.toString() || '',
        accommodation_estimate: stop.accommodation_estimate?.toString() || ''
      });
      setSelectedStopId(stop.id);
    } else {
      resetCityForm();
    }
    setShowCityModal(true);
  };

  const openActivityModal = (stopId: string, activity?: TripActivity) => {
    setSelectedStopId(stopId);
    if (activity) {
      setActivityForm({
        name: activity.name,
        scheduled_date: activity.scheduled_date,
        start_time: activity.start_time || '',
        duration_minutes: activity.duration_minutes?.toString() || '',
        cost: activity.cost?.toString() || '',
        notes: activity.notes || ''
      });
      setEditingActivity(activity);
    } else {
      resetActivityForm();
    }
    setShowActivityModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{trip.name}</h1>
          <p className="text-gray-600 text-lg">Build your perfect itinerary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Overview */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Itinerary</h2>
                <button
                  onClick={() => openCityModal()}
                  className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add City</span>
                </button>
                      </div>

              {stops.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cities Added Yet</h3>
                  <p className="text-gray-600 mb-6">Start building your itinerary by adding your first destination</p>
                  <button
                    onClick={() => openCityModal()}
                    className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                  >
                    Add Your First City
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#8B5CF6]/20 p-2 rounded-lg">
                            <span className="text-[#8B5CF6] font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                              {stop.city?.name || 'Unknown City'}
                            </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {stop.start_date && stop.end_date 
                                    ? `${formatDate(stop.start_date)} - ${formatDate(stop.end_date)}`
                                    : 'Dates TBD'
                                  }
                                </span>
                              </span>
                              {stop.start_date && stop.end_date && (
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{calculateDays(stop.start_date, stop.end_date)} days</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                    <div className="flex items-center space-x-2">
                      <button
                            onClick={() => openCityModal(stop)}
                            className="p-2 text-gray-600 hover:text-[#8B5CF6] transition-colors"
                            title="Edit City"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                            onClick={() => handleDeleteCity(stop.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            title="Delete City"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                  </div>
                </div>

                      {stop.notes && (
                        <p className="text-sm text-gray-600 mb-3">{stop.notes}</p>
                      )}

                      {/* Activities */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Activities</h5>
                                <button 
                            onClick={() => openActivityModal(stop.id)}
                            className="text-[#8B5CF6] hover:text-[#8B5CF6]/80 text-sm font-medium flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Activity</span>
                                </button>
                              </div>
                        
                        {/* Activity list would go here - you'll need to fetch activities for each stop */}
                        <div className="text-sm text-gray-500 italic">
                          Activities will be displayed here
                        </div>
                            </div>
                          </div>
                        ))}
                      </div>
              )}
            </div>
                      </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Suggestions */}
            <TripSuggestions onTripCloned={(tripId) => navigate(`/itinerary/${tripId}`)} />
            
            {/* Trip Stats */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cities</span>
                  <span className="font-medium">{stops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {trip.start_date && trip.end_date 
                      ? calculateDays(trip.start_date, trip.end_date) + ' days'
                      : 'TBD'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{trip.trip_type}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
          </div>

        {/* City Modal */}
        {showCityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedStopId ? 'Edit City' : 'Add New City'}
              </h3>
              </div>

            <form onSubmit={(e) => { e.preventDefault(); selectedStopId ? handleUpdateCity(selectedStopId) : handleAddCity(); }} className="space-y-4">
                {/* City Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={citySearchQuery}
                    onChange={(e) => {
                      setCitySearchQuery(e.target.value);
                      searchCities(e.target.value);
                    }}
                    placeholder="Search for a city..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    required
                  />
                  {citySearchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B5CF6]"></div>
                    </div>
                  )}
                </div>

                {/* City Search Results */}
                {citySearchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {citySearchResults.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          setCityForm(prev => ({ ...prev, city_id: city.id }));
                          setCitySearchQuery(city.name);
                          setCitySearchResults([]);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-600">{city.country}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                    </label>
                    <input
                      type="date"
                    value={cityForm.start_date}
                    onChange={(e) => setCityForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                    </label>
                    <input
                      type="date"
                    value={cityForm.end_date}
                    onChange={(e) => setCityForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                </div>
                </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={cityForm.notes}
                  onChange={(e) => setCityForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                  placeholder="Add notes about this city..."
                />
              </div>

              {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                  type="submit"
                  disabled={saving || !cityForm.city_id}
                  className="flex-1 bg-[#8B5CF6] text-white py-2 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {saving ? 'Saving...' : (selectedStopId ? 'Update City' : 'Add City')}
                  </button>
              </div>
            </form>
          </div>
          </div>
        )}

        {/* Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                </h3>
              </div>

            <form onSubmit={(e) => { e.preventDefault(); editingActivity ? handleUpdateActivity(editingActivity.id) : handleAddActivity(); }} className="space-y-4">
                {/* Activity Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    value={activityForm.name}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="e.g., Visit the Louvre"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={activityForm.scheduled_date}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={activityForm.start_time}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                </div>
                </div>

              {/* Duration and Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={activityForm.duration_minutes}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="120"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={activityForm.cost}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, cost: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="25.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={activityForm.notes}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                  placeholder="Add details about this activity..."
                  />
                </div>

              {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                  type="submit"
                  disabled={saving || !activityForm.name || !activityForm.scheduled_date}
                  className="flex-1 bg-[#8B5CF6] text-white py-2 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {saving ? 'Saving...' : (editingActivity ? 'Update Activity' : 'Add Activity')}
                  </button>
              </div>
            </form>
          </div>
          </div>
        )}
    </div>
  );
};

export default ItineraryBuilder;