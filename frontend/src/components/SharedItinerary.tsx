import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2,
  Copy,
  Heart,
  Download,
  QrCode,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Users,
  Star,
  Camera,
  DollarSign,
  Plane,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { sharedTripService } from '../services/database';
import { supabase } from '../lib/supabase';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string | null;
  exchange_rate_to_usd: number | null;
}

interface City {
  id: string;
  name: string;
  country: string | null;
  iso_country_code: string | null;
  lat: number | null;
  lng: number | null;
  population: number | null;
  cost_index: number;
  avg_daily_hotel: number | null;
  popularity_score: number;
  currency: Currency | null;
}

interface Activity {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  cost: number | null;
  duration_minutes: number | null;
  start_time: string | null;
  end_time: string | null;
  currency: Currency | null;
}

interface TripActivity {
  id: string;
  name: string;
  scheduled_date: string | null;
  start_time: string | null;
  duration_minutes: number | null;
  cost: number | null;
  notes: string | null;
  activity: Activity | null;
}

interface TripStop {
  id: string;
  seq: number;
  city: City;
  start_date: string | null;
  end_date: string | null;
  local_transport_cost: number | null;
  accommodation_estimate: number | null;
  notes: string | null;
  trip_activities: TripActivity[];
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_photo_url: string | null;
  currency: string;
  total_estimated_cost: number | null;
  budget: number | null;
  fixed_cost: number | null;
  created_at: string;
  updated_at: string;
  user: User;
  trip_stops: TripStop[];
}

interface SharedLink {
  id: string;
  trip_id: string;
  token: string;
  expires_at: string | null;
  created_at: string;
  trip: Trip;
}

const SharedItinerary: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  console.log('SharedItinerary: Component mounted with token:', token);
  
  // Remove all debug functions and state
  const [sharedTrip, setSharedTrip] = useState<SharedLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      console.log('SharedItinerary: Token received:', token);
      fetchSharedTrip();
    } else {
      console.error('SharedItinerary: No token provided');
      setError('No share token provided');
      setLoading(false);
    }
  }, [token]);

  const getCoverPhotoUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    console.log('SharedItinerary: Getting cover photo URL for:', url);
    
    try {
      // Use Supabase storage getPublicUrl method like MyTrips does
      const publicUrl = supabase.storage.from('trip').getPublicUrl(url).data.publicUrl;
      console.log('SharedItinerary: Generated public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('SharedItinerary: Error generating public URL:', error);
      return null;
    }
  };

  const fetchSharedTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('SharedItinerary: Fetching shared trip with token:', token);
      
      const { data, error: fetchError } = await sharedTripService.getSharedTripByToken(token!);
      
      console.log('SharedItinerary: Fetch result:', { data, error: fetchError });
      
      if (fetchError) {
        console.error('SharedItinerary: Error fetching shared trip:', fetchError);
        if (fetchError.code === 'PGRST116') {
          setError('Trip not found or no longer available');
        } else if (fetchError.message?.includes('Shared link not found')) {
          setError('This share link is invalid or has expired');
        } else if (fetchError.message?.includes('Trip not found')) {
          setError('This trip has been deleted or is no longer available');
        } else {
          setError(`Failed to load trip: ${fetchError.message || 'Unknown error'}`);
        }
        return;
      }
      
      if (!data) {
        console.error('SharedItinerary: No data returned from API');
        setError('Trip not found or no longer available');
        return;
      }
      
      console.log('SharedItinerary: Setting shared trip data:', data);
      setSharedTrip(data);
    } catch (err: any) {
      console.error('SharedItinerary: Error fetching shared trip:', err);
      setError(err.message || 'Failed to load trip. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return 'Dates TBD';
    
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

  const formatCurrency = (amount: number | null, currencyCode: string, currencySymbol?: string | null) => {
    if (amount === null || amount === 0) return 'Free';
    
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
    };
    
    const symbol = currencySymbol || symbols[currencyCode] || currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM from time string
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/shared/${sharedTrip?.token}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(shareUrl); // Set state to show success message
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getTotalCost = () => {
    if (!sharedTrip) return 0;
    
    let total = 0;
    
    // Add trip activities costs
    sharedTrip.trip.trip_stops.forEach(stop => {
      stop.trip_activities.forEach(activity => {
        if (activity.cost) {
          total += activity.cost;
        }
      });
      
      // Add accommodation estimates
      if (stop.accommodation_estimate) {
        total += stop.accommodation_estimate;
      }
      
      // Add local transport costs
      if (stop.local_transport_cost) {
        total += stop.local_transport_cost;
      }
    });
    
    return total;
  };

  const getTotalDays = () => {
    if (!sharedTrip?.trip.start_date || !sharedTrip?.trip.end_date) return 0;
    
    const start = new Date(sharedTrip.trip.start_date);
    const end = new Date(sharedTrip.trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  const getTotalActivities = () => {
    if (!sharedTrip) return 0;
    
    return sharedTrip.trip.trip_stops.reduce((total, stop) => 
      total + stop.trip_activities.length, 0
    );
  };

  const categoryIcons: { [key: string]: any } = {
    'Sightseeing': Camera,
    'Culture': Star,
    'Food': MapPin,
    'Transport': Plane,
    'Accommodation': MapPin,
    'Entertainment': Star,
    'Shopping': DollarSign,
    'Nature': MapPin
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#8B5CF6] mx-auto mb-4" />
            <p className="text-gray-600">Loading trip...</p>
            <p className="text-sm text-gray-500 mt-2">Token: {token}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sharedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'This trip is no longer available or the link has expired.'}
            </p>
            {error && (
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-gray-700 mb-2">Error Details:</p>
                <p className="text-xs text-gray-600">{error}</p>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trip = sharedTrip.trip;

  // Debug logging for cover photo
  console.log('SharedItinerary: Rendering trip with cover photo:', {
    tripName: trip.name,
    coverPhotoUrl: trip.cover_photo_url,
    hasCoverPhoto: !!trip.cover_photo_url
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden mt-16">
        {trip.cover_photo_url ? (
          <img
            src={getCoverPhotoUrl(trip.cover_photo_url) || undefined}
            alt={trip.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('SharedItinerary: Image failed to load:', trip.cover_photo_url);
              // Hide the image and show fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        
        {/* Fallback gradient background */}
        <div 
          className={`w-full h-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 ${
            trip.cover_photo_url ? 'hidden' : 'block'
          }`}
        >
          {/* Default placeholder image */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="h-24 w-24 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-semibold opacity-75">Trip Cover Photo</p>
            </div>
          </div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{trip.trip_stops.map(stop => stop.city.name).join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{getTotalDays()} days</span>
                  </div>
                </div>
                {trip.description && (
                  <p className="mt-4 text-lg text-gray-200 max-w-2xl">{trip.description}</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-6 lg:mt-0">
                {/* Like and Share Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      // Like functionality removed for now
                      console.log('Like functionality not implemented');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Like</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Share functionality removed for now
                      console.log('Share functionality not implemented');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Copy Link Button */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                  {copiedLink && (
                    <p className="text-green-600 text-xs">Link copied!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="mt-16 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">{trip.trip_stops.length}</div>
            <div className="text-gray-600 text-sm">Cities</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">{getTotalDays()}</div>
            <div className="text-gray-600 text-sm">Days</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">{getTotalActivities()}</div>
            <div className="text-gray-600 text-sm">Activities</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalCost(), trip.currency)}
            </div>
            <div className="text-gray-600 text-sm">Est. Cost</div>
          </div>
        </div>
      </div>

      {/* Trip Creator Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Created by {trip.user.name || trip.user.email}
                </h3>
                <p className="text-gray-600 text-sm">
                  Published on {formatDate(trip.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Share URL</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {window.location.host}/shared/{sharedTrip.token}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copiedLink && (
                <p className="text-green-600 text-xs mt-1">Link copied!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {trip.trip_stops.map((stop, stopIndex) => (
            <div key={stop.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* City Header */}
              <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{stop.city.name}</h2>
                    <p className="text-purple-100">
                      {formatDateRange(stop.start_date, stop.end_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <MapPin className="h-6 w-6 mb-1" />
                      <div className="text-sm font-medium">
                        {stop.seq === 1 ? 'First Stop' : `Stop ${stop.seq}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="p-6">
                {stop.trip_activities.length > 0 ? (
                  <div className="space-y-3">
                    {stop.trip_activities.map((tripActivity, activityIndex) => {
                      const activity = tripActivity.activity;
                      const Icon = activity?.category ? categoryIcons[activity.category] || MapPin : MapPin;
                        
                        return (
                          <div 
                          key={tripActivity.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="bg-[#8B5CF6]/20 p-2 rounded-lg">
                                  <Icon className="h-4 w-4 text-[#8B5CF6]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {tripActivity.name || activity?.name}
                                  </h4>
                                  {tripActivity.start_time && (
                                      <div className="flex items-center space-x-1 text-[#8B5CF6] text-sm font-medium">
                                        <Clock className="h-3 w-3" />
                                      <span>{formatTime(tripActivity.start_time)}</span>
                                      </div>
                                    )}
                                  {tripActivity.cost !== null && (
                                      <span className="text-green-600 font-medium text-sm">
                                      {formatCurrency(tripActivity.cost, trip.currency)}
                                      </span>
                                    )}
                                  </div>
                                  
                                {tripActivity.notes && (
                                  <p className="text-gray-600 text-sm">{tripActivity.notes}</p>
                                )}
                                
                                {activity?.description && (
                                  <p className="text-gray-600 text-sm mt-2">{activity.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No activities planned for this stop</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {/* This section is no longer needed as like/share functionality is removed */}
    </div>
  );
};

export default SharedItinerary;