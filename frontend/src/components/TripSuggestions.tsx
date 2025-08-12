import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Eye,
  Star,
  TrendingUp,
  Users,
  Globe,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { ItineraryService, AdminTrip } from '../services/itineraryService';
import { supabase } from '../lib/supabase';

interface TripSuggestionsProps {
  onTripCloned?: (tripId: string) => void;
}

const TripSuggestions: React.FC<TripSuggestionsProps> = ({ onTripCloned }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [suggestions, setSuggestions] = useState<AdminTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloningTripId, setCloningTripId] = useState<string | null>(null);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<AdminTrip | null>(null);
  const [cloneForm, setCloneForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const adminTrips = await ItineraryService.getAdminTripSuggestions();
      setSuggestions(adminTrips);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      showError('Error', 'Failed to load trip suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleCloneTrip = (trip: AdminTrip) => {
    setSelectedTrip(trip);
    setCloneForm({
      name: `${trip.name} (Copy)`,
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      description: trip.description || ''
    });
    setShowCloneModal(true);
  };

  const handleCloneSubmit = async () => {
    if (!selectedTrip || !user) return;

    try {
      setCloningTripId(selectedTrip.id);
      showInfo('Cloning Trip', 'Creating your personalized copy...');

      const newTrip = await ItineraryService.cloneAdminTrip(
        selectedTrip.id,
        user.id,
        cloneForm
      );

      showSuccess('Trip Cloned!', 'Your personalized trip has been created successfully');
      setShowCloneModal(false);
      setSelectedTrip(null);
      
      // Navigate to the new trip's itinerary builder
      if (onTripCloned) {
        onTripCloned(newTrip.id);
      } else {
        navigate(`/itinerary/${newTrip.id}`);
      }
    } catch (error) {
      console.error('Error cloning trip:', error);
      showError('Clone Error', 'Failed to clone the trip. Please try again.');
    } finally {
      setCloningTripId(null);
    }
  };

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return 'Flexible dates';
    if (!startDate) return `Until ${new Date(endDate!).toLocaleDateString()}`;
    if (!endDate) return `From ${new Date(startDate).toLocaleDateString()}`;
    
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const end = new Date(endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
            <Lightbulb className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trip Suggestions</h3>
            <p className="text-gray-600 text-sm">Curated trips by our travel experts</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
            <Lightbulb className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trip Suggestions</h3>
            <p className="text-gray-600 text-sm">Curated trips by our travel experts</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No suggestions available at the moment</p>
          <p className="text-gray-500 text-sm">Check back later for new curated trips</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
            <Lightbulb className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trip Suggestions</h3>
            <p className="text-gray-600 text-sm">Curated trips by our travel experts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((trip) => {
            const duration = calculateDuration(trip.start_date, trip.end_date);
            
            return (
              <div
                key={trip.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Trip Cover Image */}
                {trip.cover_photo_url && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={`${supabase.storage.from('trip').getPublicUrl(trip.cover_photo_url).data.publicUrl}`}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                
                {/* Trip Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                      {trip.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>Expert Curated</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {trip.fixed_cost && (
                      <div className="bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-xs text-green-700 font-medium">
                          ${trip.fixed_cost.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="bg-[#8B5CF6]/10 px-2 py-1 rounded-full">
                      <span className="text-xs text-[#8B5CF6] font-medium">Admin</span>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  </div>
                  
                  {duration && (
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{duration} days</span>
                    </div>
                  )}

                  {trip.fixed_cost && (
                    <div className="flex items-center space-x-2 text-xs text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      <span>${trip.fixed_cost.toFixed(2)}</span>
                    </div>
                  )}

                  {trip.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {trip.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCloneTrip(trip)}
                    disabled={cloningTripId === trip.id}
                    className="flex-1 bg-[#8B5CF6] text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    {cloningTripId === trip.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>Cloning...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Clone Trip</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    title="Edit Itinerary"
                  >
                    <MapPin className="h-3 w-3" />
                  </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clone Trip Modal */}
      {showCloneModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clone Trip</h3>
              <p className="text-gray-600">
                Customize this trip template for your own adventure
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCloneSubmit(); }} className="space-y-4">
              {/* Trip Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name *
                </label>
                <input
                  type="text"
                  value={cloneForm.name}
                  onChange={(e) => setCloneForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  placeholder="My Custom Trip"
                  required
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={cloneForm.start_date}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={cloneForm.end_date}
                    onChange={(e) => setCloneForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={cloneForm.description}
                  onChange={(e) => setCloneForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                  placeholder="Add your personal notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={cloningTripId === selectedTrip.id}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cloningTripId === selectedTrip.id || !cloneForm.name.trim()}
                  className="flex-1 bg-[#8B5CF6] text-white py-2 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cloningTripId === selectedTrip.id ? 'Cloning...' : 'Clone Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TripSuggestions;
