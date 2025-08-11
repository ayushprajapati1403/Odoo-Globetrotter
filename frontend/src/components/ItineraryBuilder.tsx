import React, { useState } from 'react';
import CitySearch from './CitySearch';
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
  ChevronRight
} from 'lucide-react';

interface Activity {
  activityId: string;
  name: string;
  time?: string;
  notes?: string;
}

interface City {
  cityId: string;
  cityName: string;
  arrivalDate: string;
  departureDate: string;
  activities: Activity[];
  isExpanded: boolean;
}

interface Trip {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
}

const ItineraryBuilder: React.FC = () => {
  // Sample trip data - would come from route params in real app
  const [trip] = useState<Trip>({
    tripId: "uuid-1234",
    tripName: "Summer Europe Tour 2025",
    startDate: "2025-05-12",
    endDate: "2025-05-25"
  });

  const [cities, setCities] = useState<City[]>([
    {
      cityId: "uuid-paris",
      cityName: "Paris",
      arrivalDate: "2025-05-12",
      departureDate: "2025-05-15",
      isExpanded: true,
      activities: [
        {
          activityId: "uuid-louvre",
          name: "Visit the Louvre",
          time: "10:00",
          notes: "Buy tickets in advance"
        },
        {
          activityId: "uuid-eiffel",
          name: "Eiffel Tower Sunset",
          time: "18:30",
          notes: ""
        }
      ]
    },
    {
      cityId: "uuid-rome",
      cityName: "Rome",
      arrivalDate: "2025-05-15",
      departureDate: "2025-05-20",
      isExpanded: false,
      activities: []
    }
  ]);

  const [showCityModal, setShowCityModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // City modal form state
  const [cityForm, setCityForm] = useState({
    cityName: '',
    arrivalDate: '',
    departureDate: ''
  });

  // Activity modal form state
  const [activityForm, setActivityForm] = useState({
    name: '',
    time: '',
    notes: ''
  });

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Sample city suggestions - would come from Places API
  const citySuggestions = [
    'Paris, France',
    'Rome, Italy',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Prague, Czech Republic',
    'Vienna, Austria',
    'Berlin, Germany',
    'London, United Kingdom'
  ].filter(city => 
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const formatDateRange = (arrival: string, departure: string) => {
    const arrivalDate = new Date(arrival).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
    const departureDate = new Date(departure).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${arrivalDate} – ${departureDate}`;
  };

  const calculateDays = (arrival: string, departure: string) => {
    const days = Math.ceil((new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24));
    return days === 1 ? '1 day' : `${days} days`;
  };

  const validateCityForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!cityForm.cityName.trim()) {
      newErrors.cityName = 'Please select a city';
    }
    if (!cityForm.arrivalDate) {
      newErrors.arrivalDate = 'Please select arrival date';
    }
    if (!cityForm.departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }
    if (cityForm.arrivalDate && cityForm.departureDate && 
        new Date(cityForm.departureDate) <= new Date(cityForm.arrivalDate)) {
      newErrors.dateRange = 'Departure date must be after arrival date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateActivityForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!activityForm.name.trim()) {
      newErrors.activityName = 'Please enter activity name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCity = () => {
    setShowCitySearch(true);
  };

  const handleAddCityFromSearch = (city: any, arrivalDate: string, departureDate: string) => {
    const newCity: City = {
      cityId: city.cityId,
      cityName: city.cityName,
      arrivalDate,
      departureDate,
      activities: [],
      isExpanded: true
    };

    setCities([...cities, newCity]);
  };

  const handleDeleteCity = (cityId: string) => {
    if (window.confirm('Are you sure you want to delete this city and all its activities?')) {
      setCities(cities.filter(city => city.cityId !== cityId));
    }
  };

  const handleAddActivity = () => {
    if (!validateActivityForm() || !selectedCityId) return;

    const newActivity: Activity = {
      activityId: `activity-${Date.now()}`,
      name: activityForm.name,
      time: activityForm.time || undefined,
      notes: activityForm.notes || undefined
    };

    setCities(cities.map(city => 
      city.cityId === selectedCityId 
        ? { ...city, activities: [...city.activities, newActivity] }
        : city
    ));

    setActivityForm({ name: '', time: '', notes: '' });
    setShowActivityModal(false);
    setSelectedCityId(null);
    setErrors({});
  };

  const handleEditActivity = (cityId: string, activity: Activity) => {
    setSelectedCityId(cityId);
    setEditingActivity(activity);
    setActivityForm({
      name: activity.name,
      time: activity.time || '',
      notes: activity.notes || ''
    });
    setShowActivityModal(true);
  };

  const handleUpdateActivity = () => {
    if (!validateActivityForm() || !selectedCityId || !editingActivity) return;

    setCities(cities.map(city => 
      city.cityId === selectedCityId 
        ? {
            ...city, 
            activities: city.activities.map(activity =>
              activity.activityId === editingActivity.activityId
                ? {
                    ...activity,
                    name: activityForm.name,
                    time: activityForm.time || undefined,
                    notes: activityForm.notes || undefined
                  }
                : activity
            )
          }
        : city
    ));

    setActivityForm({ name: '', time: '', notes: '' });
    setShowActivityModal(false);
    setSelectedCityId(null);
    setEditingActivity(null);
    setErrors({});
  };

  const handleDeleteActivity = (cityId: string, activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setCities(cities.map(city => 
        city.cityId === cityId 
          ? { ...city, activities: city.activities.filter(activity => activity.activityId !== activityId) }
          : city
      ));
    }
  };

  const toggleCityExpansion = (cityId: string) => {
    setCities(cities.map(city => 
      city.cityId === cityId 
        ? { ...city, isExpanded: !city.isExpanded }
        : city
    ));
  };

  const handleSaveProgress = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Itinerary saved successfully!');
    } catch (error) {
      alert('Error saving itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.tripName}</h1>
          <p className="text-gray-600">
            {formatDateRange(trip.startDate, trip.endDate)} • Plan your perfect itinerary
          </p>
        </div>

        {/* Add Stop Button */}
        <div className="mb-8">
          <button
            onClick={handleAddCity}
            className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Stop</span>
          </button>
        </div>

        {/* Cities Timeline */}
        <div className="space-y-6">
          {cities.map((city, index) => (
            <div key={city.cityId} className="relative">
              {/* Timeline Line */}
              {index < cities.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-20 bg-gray-300 z-0"></div>
              )}

              {/* City Card */}
              <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
                {/* City Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Drag Handle */}
                      <div className="cursor-move text-gray-500 hover:text-gray-700">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* City Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{city.cityName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{formatDateRange(city.arrivalDate, city.departureDate)}</span>
                            <span>•</span>
                            <span>{calculateDays(city.arrivalDate, city.departureDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* City Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCityExpansion(city.cityId)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {city.isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCity(city.cityId)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activities Section */}
                {city.isExpanded && (
                  <div className="p-6">
                    {/* Activities List */}
                    {city.activities.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {city.activities.map((activity) => (
                          <div key={activity.activityId} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="cursor-move text-gray-400 mt-1">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                    {activity.time && (
                                      <div className="flex items-center space-x-1 text-[#8B5CF6] text-sm">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.time}</span>
                                      </div>
                                    )}
                                  </div>
                                  {activity.notes && (
                                    <p className="text-gray-600 text-sm">{activity.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleEditActivity(city.cityId, activity)}
                                  className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteActivity(city.cityId, activity.activityId)}
                                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>No activities planned yet</p>
                      </div>
                    )}

                    {/* Add Activity Button */}
                    <button
                      onClick={() => {
                        setSelectedCityId(city.cityId);
                        setShowActivityModal(true);
                      }}
                      className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Activity</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {cities.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stops added yet</h3>
            <p className="text-gray-600 mb-6">Start building your itinerary by adding your first destination</p>
            <button
              onClick={handleAddCity}
              className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Stop</span>
            </button>
          </div>
        )}

        {/* Save Progress Button */}
        {cities.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={handleSaveProgress}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Progress</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* City Search Modal */}
        <CitySearch
          isOpen={showCitySearch}
          onClose={() => setShowCitySearch(false)}
          onAddCity={handleAddCityFromSearch}
          existingCityIds={cities.map(city => city.cityId)}
        />

        {/* City Modal */}
        {showCityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Stop</h3>
                <button
                  onClick={() => {
                    setShowCityModal(false);
                    setCityForm({ cityName: '', arrivalDate: '', departureDate: '' });
                    setCitySearchQuery('');
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* City Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.cityName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#42eff5] focus:ring-[#42eff5]/50'
                      }`}
                    />
                  </div>
                  
                  {/* City Suggestions */}
                  {citySearchQuery && citySuggestions.length > 0 && (
                    <div className="mt-2 bg-white border border-gray-300 rounded-xl max-h-40 overflow-y-auto shadow-lg">
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCityForm({ ...cityForm, cityName: city });
                            setCitySearchQuery('');
                          }}
                          className="w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {errors.cityName && (
                    <p className="mt-2 text-sm text-red-400">{errors.cityName}</p>
                  )}
                </div>

                {/* Selected City Display */}
                {cityForm.cityName && (
                  <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8B5CF6] font-medium">{cityForm.cityName}</span>
                      <button
                        onClick={() => setCityForm({ ...cityForm, cityName: '' })}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival *
                    </label>
                    <input
                      type="date"
                      value={cityForm.arrivalDate}
                      onChange={(e) => setCityForm({ ...cityForm, arrivalDate: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.arrivalDate 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                      }`}
                    />
                    {errors.arrivalDate && (
                      <p className="mt-1 text-xs text-red-400">{errors.arrivalDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure *
                    </label>
                    <input
                      type="date"
                      value={cityForm.departureDate}
                      onChange={(e) => setCityForm({ ...cityForm, departureDate: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.departureDate 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                      }`}
                    />
                    {errors.departureDate && (
                      <p className="mt-1 text-xs text-red-400">{errors.departureDate}</p>
                    )}
                  </div>
                </div>

                {errors.dateRange && (
                  <p className="text-sm text-red-400">{errors.dateRange}</p>
                )}

                {/* Modal Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCityModal(false);
                      setCityForm({ cityName: '', arrivalDate: '', departureDate: '' });
                      setCitySearchQuery('');
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCity}
                    className="flex-1 bg-[#8B5CF6] text-white py-3 px-4 rounded-xl hover:bg-[#8B5CF6]/90 transition-colors font-semibold"
                  >
                    Add Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingActivity ? 'Edit Activity' : 'Add Activity'}
                </h3>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    setActivityForm({ name: '', time: '', notes: '' });
                    setSelectedCityId(null);
                    setEditingActivity(null);
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Activity Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    value={activityForm.name}
                    onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                    placeholder="e.g., Visit the Louvre"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.activityName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                    }`}
                  />
                  {errors.activityName && (
                    <p className="mt-2 text-sm text-red-400">{errors.activityName}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={activityForm.notes}
                    onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                    placeholder="Add any notes or reminders..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300 resize-none"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowActivityModal(false);
                      setActivityForm({ name: '', time: '', notes: '' });
                      setSelectedCityId(null);
                      setEditingActivity(null);
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingActivity ? handleUpdateActivity : handleAddActivity}
                    className="flex-1 bg-[#8B5CF6] text-white py-3 px-4 rounded-xl hover:bg-[#8B5CF6]/90 transition-colors font-semibold"
                  >
                    {editingActivity ? 'Update Activity' : 'Add Activity'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;