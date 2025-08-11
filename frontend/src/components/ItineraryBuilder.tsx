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
  Activity as ActivityIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { ItineraryService, TripStop, TripActivity, City, Activity } from '../services/itineraryService';
import { canEditTrip } from '../utils/permissions';
import TripSuggestions from './TripSuggestions';
import TransportDetails from './TransportDetails';

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
    notes: ''
  });

  const [activityForm, setActivityForm] = useState({
    activity_id: '',
    scheduled_date: '',
    start_time: '',
    notes: ''
  });

  // City search
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<City[]>([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Popular cities for quick selection - these are just for display
  // Users will need to search for actual cities in the database
  const [popularCityLoading, setPopularCityLoading] = useState<string | null>(null);
  const popularCities = [
    { id: 'paris-france', name: 'Paris', country: 'France' },
    { id: 'rome-italy', name: 'Rome', country: 'Italy' },
    { id: 'tokyo-japan', name: 'Tokyo', country: 'Japan' },
    { id: 'new-york-usa', name: 'New York', country: 'United States' },
    { id: 'london-uk', name: 'London', country: 'United Kingdom' },
    { id: 'barcelona-spain', name: 'Barcelona', country: 'Spain' },
    { id: 'bali-indonesia', name: 'Bali', country: 'Indonesia' },
    { id: 'prague-czech', name: 'Prague', country: 'Czech Republic' },
    { id: 'sydney-australia', name: 'Sydney', country: 'Australia' },
    { id: 'cape-town-south-africa', name: 'Cape Town', country: 'South Africa' },
    { id: 'amsterdam-netherlands', name: 'Amsterdam', country: 'Netherlands' },
    { id: 'berlin-germany', name: 'Berlin', country: 'Germany' },
    { id: 'vienna-austria', name: 'Vienna', country: 'Austria' },
    { id: 'budapest-hungary', name: 'Budapest', country: 'Hungary' },
    { id: 'dubai-uae', name: 'Dubai', country: 'UAE' },
    { id: 'singapore-singapore', name: 'Singapore', country: 'Singapore' },
    { id: 'bangkok-thailand', name: 'Bangkok', country: 'Thailand' },
    { id: 'seoul-south-korea', name: 'Seoul', country: 'South Korea' },
    { id: 'vancouver-canada', name: 'Vancouver', country: 'Canada' },
    { id: 'rio-de-janeiro-brazil', name: 'Rio de Janeiro', country: 'Brazil' }
  ];

  // Filter popular cities based on search
  const filteredPopularCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Activity search
  const [cityActivities, setCityActivities] = useState<Activity[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  // Form validation errors
  const [cityFormErrors, setCityFormErrors] = useState<{
    city_id?: string;
    start_date?: string;
    end_date?: string;
    dateRange?: string;
  }>({});

  const [activityFormErrors, setActivityFormErrors] = useState<{
    activity_id?: string;
    scheduled_date?: string;
    start_time?: string;
  }>({});

  // Validation functions
  const validateCityForm = (): boolean => {
    const errors: typeof cityFormErrors = {};

    // City selection validation
    if (!cityForm.city_id.trim()) {
      errors.city_id = 'Please select a city';
    }

    // Date validation
    if (!cityForm.start_date) {
      errors.start_date = 'Start date is required';
    }
    if (!cityForm.end_date) {
      errors.end_date = 'End date is required';
    }

    // Date range validation
    if (cityForm.start_date && cityForm.end_date) {
      const startDate = new Date(cityForm.start_date);
      const endDate = new Date(cityForm.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        errors.start_date = 'Start date cannot be in the past';
      }
      if (endDate < startDate) {
        errors.dateRange = 'End date must be after start date';
      }
      if (endDate < today) {
        errors.end_date = 'End date cannot be in the past';
      }
    }



    setCityFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateActivityForm = (): boolean => {
    const errors: typeof activityFormErrors = {};

    // Activity selection validation
    if (!activityForm.activity_id.trim()) {
      errors.activity_id = 'Please select an activity';
    }

    // Date validation
    if (!activityForm.scheduled_date) {
      errors.scheduled_date = 'Scheduled date is required';
    } else {
      const scheduledDate = new Date(activityForm.scheduled_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        errors.scheduled_date = 'Scheduled date cannot be in the past';
      }
    }

    // Time validation
    if (activityForm.start_time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(activityForm.start_time)) {
        errors.start_time = 'Please enter a valid time (HH:MM)';
      }
    }



    setActivityFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearCityFormErrors = () => {
    setCityFormErrors({});
  };

  const clearActivityFormErrors = () => {
    setActivityFormErrors({});
  };

  // Fetch activities for a city
  const fetchCityActivities = async (cityId: string) => {
    try {
      const activities = await ItineraryService.getCityActivities(cityId);
      setCityActivities(activities);
      setSelectedCityId(cityId);
    } catch (error) {
      console.error('Error fetching city activities:', error);
      showError('Error', 'Failed to fetch city activities');
    }
  };

  useEffect(() => {
    if (tripId && user) {
      fetchTripData();
    }
  }, [tripId, user]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const { trip: tripData, stops: stopsData } = await ItineraryService.getTripWithStops(tripId!);
      
      console.log('Fetched trip data:', { trip: tripData, stops: stopsData });
      
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

  const handleCitySelect = (city: City) => {
    setCityForm(prev => ({ ...prev, city_id: city.id }));
    setCitySearchQuery(city.name);
    setCitySearchResults([]);
    setShowCityDropdown(false);
  };

  const handlePopularCitySelect = async (city: any) => {
    // Popular cities are suggestions - try to find the actual city in the database
    setCitySearchQuery(city.name);
    setShowCityDropdown(false);
    setPopularCityLoading(city.id);
    
    try {
      // Search for the actual city in the database
      const searchResults = await ItineraryService.searchCities(city.name);
      
      if (searchResults.length > 0) {
        // Find the best match (exact name match first, then country match)
        const exactMatch = searchResults.find(result => 
          result.name.toLowerCase() === city.name.toLowerCase() && 
          result.country.toLowerCase() === city.country.toLowerCase()
        );
        
        const countryMatch = searchResults.find(result => 
          result.country.toLowerCase() === city.country.toLowerCase()
        );
        
        const bestMatch = exactMatch || countryMatch || searchResults[0];
        
        // Auto-select the best match
        handleCitySelect(bestMatch);
        showSuccess('City Found!', `"${bestMatch.name}, ${bestMatch.country}" has been selected. You can now set dates and add it to your trip.`);
      } else {
        // No exact match found, clear city selection and prompt user to search manually
        setCityForm(prev => ({ ...prev, city_id: '' }));
        showInfo('City Not Found', `"${city.name}" wasn't found in our database. Please search for a similar city or try a different name.`);
      }
    } catch (error) {
      console.error('Error searching for popular city:', error);
      // Fallback to manual search
      setCityForm(prev => ({ ...prev, city_id: '' }));
      showInfo('Search Error', `Please search manually for "${city.name}" to add it to your trip.`);
    } finally {
      setPopularCityLoading(null);
    }
    
    // Focus on the search input
    const searchInput = document.querySelector('input[placeholder="Search for a city..."]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleAddCity = async () => {
    // Clear previous errors
    clearCityFormErrors();
    
    // Validate form before submission
    if (!validateCityForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const newStop = await ItineraryService.addCityToTrip(tripId!, {
        city_id: cityForm.city_id,
        start_date: cityForm.start_date,
        end_date: cityForm.end_date,
        notes: cityForm.notes || undefined
      });

      // Fetch the complete stop data with city information and activities
      let completeStop;
      try {
        completeStop = await ItineraryService.getTripStopWithActivities(newStop.id);
      } catch (fetchError) {
        console.error('Error fetching complete stop data:', fetchError);
        // If we can't fetch the complete data, still add the basic stop to avoid losing the user's work
        // The city name will show as "Unknown City" until page reload, but the stop will be saved
        setStops(prev => [...prev, newStop]);
        showInfo('City Added', 'City added successfully, but some details may not display correctly until page reload');
        setShowCityModal(false);
        resetCityForm();
        return;
      }
      
      // Add the complete stop data to the state (including city info and empty activities array)
      const stopWithCity = {
        ...completeStop.stop,
        activities: completeStop.activities || []
      };
      setStops(prev => [...prev, stopWithCity]);
      setShowCityModal(false);
      resetCityForm();
      showSuccess('City Added', 'New city has been added to your trip');
    } catch (error: any) {
      console.error('Error adding city:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to add city to trip';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      showError('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCity = async (stopId: string) => {
    // Clear previous errors
    clearCityFormErrors();
    
    // Validate form before submission
    if (!validateCityForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const updatedStop = await ItineraryService.updateTripStop(stopId, {
        start_date: cityForm.start_date,
        end_date: cityForm.end_date,
        notes: cityForm.notes || undefined
      });

      // Fetch the complete updated stop data with city information and activities
      let completeStop;
      try {
        completeStop = await ItineraryService.getTripStopWithActivities(stopId);
      } catch (fetchError) {
        console.error('Error fetching complete updated stop data:', fetchError);
        // If we can't fetch the complete data, still update the basic stop data
        // The city name will show as "Unknown City" until page reload, but the stop will be updated
        setStops(prev => prev.map(stop => stop.id === stopId ? updatedStop : stop));
        showInfo('City Updated', 'City updated successfully, but some details may not display correctly until page reload');
        setShowCityModal(false);
        resetCityForm();
        return;
      }
      
      // Update the stop with complete data (including city info and activities)
      const updatedStopWithCity = {
        ...completeStop.stop,
        activities: completeStop.activities || []
      };
      setStops(prev => prev.map(stop => stop.id === stopId ? updatedStopWithCity : stop));
      setShowCityModal(false);
      resetCityForm();
      showSuccess('City Updated', 'City details have been updated');
    } catch (error: any) {
      console.error('Error updating city:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to update city';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      showError('Error', errorMessage);
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
    // Clear previous errors
    clearActivityFormErrors();
    
    // Validate that we have a selected stop
    if (!selectedStopId) {
      showError('Validation Error', 'No trip stop selected. Please try again.');
      return;
    }
    
    console.log('Adding activity with selectedStopId:', selectedStopId);
    
    // Validate form before submission
    if (!validateActivityForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const newActivity = await ItineraryService.addActivityToStop(selectedStopId, {
        activity_id: activityForm.activity_id,
        scheduled_date: activityForm.scheduled_date,
        start_time: activityForm.start_time || undefined,
        notes: activityForm.notes || undefined
      });

      // Refresh the stops to get updated activity data
      await fetchTripData();
      
      setShowActivityModal(false);
      resetActivityForm();
      setSelectedStopId(null); // Clear the selected stop after successful addition
      showSuccess('Activity Added', 'New activity has been added');
    } catch (error: any) {
      console.error('Error adding activity:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to add activity';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      showError('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateActivity = async (activityId: string) => {
    // Clear previous errors
    clearActivityFormErrors();
    
    // Validate form before submission
    if (!validateActivityForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const updatedActivity = await ItineraryService.updateTripActivity(activityId, {
        activity_id: activityForm.activity_id,
        scheduled_date: activityForm.scheduled_date,
        start_time: activityForm.start_time || undefined,
        notes: activityForm.notes || undefined
      });

      // Refresh the stops to get updated activity data
      await fetchTripData();
      
      setShowActivityModal(false);
      resetActivityForm();
      setSelectedStopId(null); // Clear the selected stop after successful update
      showSuccess('Activity Updated', 'Activity has been updated');
    } catch (error: any) {
      console.error('Error updating activity:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to update activity';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      showError('Error', errorMessage);
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
      notes: ''
    });
    setSelectedStopId(null);
    clearCityFormErrors();
  };

  const resetActivityForm = () => {
    setActivityForm({
      activity_id: '',
      scheduled_date: '',
      start_time: '',
      notes: ''
    });
    setEditingActivity(null);
    // Don't clear selectedStopId here as it's needed for adding activities
    clearActivityFormErrors();
  };

  const openCityModal = (stop?: TripStop) => {
    clearCityFormErrors();
    if (stop) {
      setCityForm({
        city_id: stop.city_id,
        start_date: stop.start_date || '',
        end_date: stop.end_date || '',
        notes: stop.notes || ''
      });
      setSelectedStopId(stop.id);
    } else {
      resetCityForm();
    }
    setShowCityModal(true);
  };

  const openActivityModal = (stopId: string, activity?: TripActivity) => {
    clearActivityFormErrors();
    console.log('Opening activity modal for stopId:', stopId);
    setSelectedStopId(stopId);
    
    // Find the stop to get the city_id
    const stop = stops.find(s => s.id === stopId);
    if (stop) {
      fetchCityActivities(stop.city_id);
    }
    
    if (activity) {
      setActivityForm({
        activity_id: activity.activity_id,
        scheduled_date: activity.scheduled_date,
        start_time: activity.start_time || '',
        notes: activity.notes || ''
      });
      setEditingActivity(activity);
    } else {
      // Reset form but keep the selectedStopId
      setActivityForm({
        activity_id: '',
        scheduled_date: '',
        start_time: '',
        notes: ''
      });
      setEditingActivity(null);
      clearActivityFormErrors();
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
                        
                        {/* Activity list */}
                        {stop.activities && stop.activities.length > 0 ? (
                          <div className="space-y-2">
                            {stop.activities.map((activity) => (
                              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{activity.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {activity.scheduled_date && formatDate(activity.scheduled_date)}
                                    {activity.start_time && ` at ${activity.start_time}`}
                                    {activity.duration_minutes && ` (${activity.duration_minutes} min)`}
                                  </div>
                                  {activity.notes && (
                                    <div className="text-sm text-gray-500 mt-1">{activity.notes}</div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm font-medium text-green-600">
                                    ${activity.cost}
                                  </div>
                                  <button
                                    onClick={() => openActivityModal(stop.id, activity)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteActivity(stop.id, activity.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            No activities planned yet
                          </div>
                        )}
                            </div>
                          </div>
                        ))}
                      </div>
              )}
            </div>

            {/* Transport Details */}
            {stops.length > 1 && (
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
                <TransportDetails
                  tripId={tripId!}
                  stops={stops}
                  onTransportAdded={() => {
                    // Refresh trip data if needed
                    fetchTripData();
                  }}
                  onTransportUpdated={() => {
                    // Refresh trip data if needed
                    fetchTripData();
                  }}
                  onTransportDeleted={() => {
                    // Refresh trip data if needed
                    fetchTripData();
                  }}
                />
              </div>
            )}
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
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  
                  {/* Popular Cities Dropdown */}
                  <div className="mb-3 city-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg text-left text-sm text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                        <span className="font-medium">Quick Add Popular Cities</span>
                        <span className="text-xs text-gray-500">({popularCities.length} cities)</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCityDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCityDropdown && (
                      <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                        {/* Search within popular city suggestions */}
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search suggestions..."
                              className="w-full pl-7 pr-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                setCitySearchQuery(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Popular cities list */}
                        <div className="max-h-40 overflow-y-auto">
                          {filteredPopularCities.length > 0 && (
                            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
                              {filteredPopularCities.length} of {popularCities.length} suggestions
                            </div>
                          )}
                          {filteredPopularCities.map((city) => (
                            <button
                              key={city.id}
                              type="button"
                              onClick={() => handlePopularCitySelect(city)}
                              disabled={popularCityLoading === city.id}
                              className="w-full text-left px-3 py-2 hover:bg-[#8B5CF6]/5 hover:border-l-2 hover:border-l-[#8B5CF6] border-b border-gray-100 last:border-b-0 text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-3 w-3 text-[#8B5CF6] flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-gray-900">{city.name}</div>
                                    <div className="text-gray-600 text-xs">{city.country}</div>
                                  </div>
                                </div>
                                {popularCityLoading === city.id && (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#8B5CF6]"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {filteredPopularCities.length === 0 && (
                          <div className="p-4 text-center">
                            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-500">
                              No suggestions match your search
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Try a different search term
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* City Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={citySearchQuery}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        searchCities(e.target.value);
                        setShowCityDropdown(false);
                        clearCityFormErrors();
                      }}
                      placeholder="Search for a city..."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                        cityFormErrors.city_id
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                      }`}
                      required
                    />
                    {citySearchLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8B5CF6]"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* City Selection Error */}
                  {cityFormErrors.city_id && (
                    <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{cityFormErrors.city_id}</span>
                    </p>
                  )}

                  {/* City Search Results */}
                  {citySearchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                      {citySearchResults.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-gray-600">{city.country}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected City Display */}
                  {cityForm.city_id && (
                    <div className="mt-3 p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-[#8B5CF6]">{citySearchQuery}</div>
                          <div className="text-sm text-[#8B5CF6]/70">City selected</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCityForm(prev => ({ ...prev, city_id: '' }));
                            setCitySearchQuery('');
                          }}
                          className="text-[#8B5CF6] hover:text-[#8B5CF6]/70"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                    </label>
                    <input
                      type="date"
                      value={cityForm.start_date}
                      onChange={(e) => {
                        setCityForm(prev => ({ ...prev, start_date: e.target.value }));
                        clearCityFormErrors();
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                        cityFormErrors.start_date
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                      }`}
                      required
                    />
                    {cityFormErrors.start_date && (
                      <p className="mt-1 text-xs text-red-500">{cityFormErrors.start_date}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                    </label>
                    <input
                      type="date"
                      value={cityForm.end_date}
                      onChange={(e) => {
                        setCityForm(prev => ({ ...prev, end_date: e.target.value }));
                        clearCityFormErrors();
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                        cityFormErrors.end_date
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                      }`}
                      required
                    />
                    {cityFormErrors.end_date && (
                      <p className="mt-1 text-xs text-red-500">{cityFormErrors.end_date}</p>
                    )}
                  </div>
                </div>
                
                {/* Date Range Error */}
                {cityFormErrors.dateRange && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{cityFormErrors.dateRange}</span>
                  </p>
                )}

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
                {/* Activity Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Activity *
                  </label>
                  <select
                    value={activityForm.activity_id}
                    onChange={(e) => {
                      setActivityForm(prev => ({ ...prev, activity_id: e.target.value }));
                      clearActivityFormErrors();
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                      activityFormErrors.activity_id
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                    }`}
                    required
                  >
                    <option value="">Choose an activity...</option>
                    {cityActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name} - ${activity.cost} ({activity.duration_minutes} min)
                      </option>
                    ))}
                  </select>
                  {activityFormErrors.activity_id && (
                    <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{activityFormErrors.activity_id}</span>
                    </p>
                  )}
                  {cityActivities.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No activities available for this city. Please add a city first.
                    </p>
                  )}
                </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={activityForm.scheduled_date}
                    onChange={(e) => {
                      setActivityForm(prev => ({ ...prev, scheduled_date: e.target.value }));
                      clearActivityFormErrors();
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                      activityFormErrors.scheduled_date
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                    }`}
                    required
                  />
                  {activityFormErrors.scheduled_date && (
                    <p className="mt-1 text-xs text-red-500">{activityFormErrors.scheduled_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={activityForm.start_time}
                    onChange={(e) => {
                      setActivityForm(prev => ({ ...prev, start_time: e.target.value }));
                      clearActivityFormErrors();
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 ${
                      activityFormErrors.start_time
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                    }`}
                  />
                  {activityFormErrors.start_time && (
                    <p className="mt-1 text-xs text-red-500">{activityFormErrors.start_time}</p>
                  )}
                </div>
                </div>

              {/* Duration and Cost Display */}
              {activityForm.activity_id && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {(() => {
                        const selectedActivity = cityActivities.find(a => a.id === activityForm.activity_id);
                        return selectedActivity ? `${selectedActivity.duration_minutes} minutes` : 'Duration not available';
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {(() => {
                        const selectedActivity = cityActivities.find(a => a.id === activityForm.activity_id);
                        return selectedActivity ? `$${selectedActivity.cost}` : 'Cost not available';
                      })()}
                    </div>
                  </div>
                </div>
              )}

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
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedStopId(null); // Clear selected stop when closing modal
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                  type="submit"
                  disabled={saving || !activityForm.activity_id || !activityForm.scheduled_date}
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