import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Share2, 
  Copy, 
  Check, 
  Link, 
  Calendar, 
  MapPin, 
  Users, 
  Globe, 
  Lock,
  Settings,
  Trash2,
  ExternalLink,
  QrCode,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Plane
} from 'lucide-react';
import Navbar from './Navbar';
import { tripService, sharedTripService } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { supabase } from '../lib/supabase';

interface Trip {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_photo_url: string | null;
  currency: string;
  total_estimated_cost: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface SharedLink {
  id: string;
  trip_id: string;
  token: string;
  expires_at: string | null;
  created_at: string;
}

const TripSharePage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Remove all debug functions and state
  const [trip, setTrip] = useState<Trip | null>(null);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('TripSharePage: Fetching trip data for tripId:', tripId);
      
      // Fetch trip details
      const { data: tripData, error: tripError } = await tripService.getTrip(tripId!);
      if (tripError) {
        console.error('TripSharePage: Error fetching trip:', tripError);
        throw tripError;
      }
      if (!tripData) {
        console.error('TripSharePage: Trip data is null');
        throw new Error('Trip not found');
      }
      
      console.log('TripSharePage: Trip data fetched successfully:', tripData);
      setTrip(tripData);
      
      // Fetch existing shared links
      console.log('TripSharePage: Fetching shared links for tripId:', tripId);
      const { data: linksData, error: linksError } = await tripService.getSharedLink(tripId!);
      
      if (linksError) {
        console.error('TripSharePage: Error fetching shared links:', linksError);
        if (linksError.code !== 'PGRST116') {
          // Only show error if it's not a "no rows found" error
          console.error('TripSharePage: Non-PGRST116 error:', linksError);
        }
      }
      
      if (linksData) {
        console.log('TripSharePage: Found shared links:', linksData);
        setSharedLinks([linksData]);
      } else {
        console.log('TripSharePage: No shared links found');
        setSharedLinks([]);
      }
      
    } catch (err: any) {
      console.error('TripSharePage: Error fetching trip data:', err);
      setError(err.message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSharedLink = async () => {
    if (!trip) return;
    
    try {
      console.log('TripSharePage: Creating shared link for trip:', trip.id);
      const { data, error } = await tripService.createSharedLink(trip.id);
      
      if (error) {
        console.error('TripSharePage: Error from createSharedLink:', error);
        throw error;
      }
      
      console.log('TripSharePage: Shared link created successfully:', data);
      
      // Refresh shared links
      await fetchTripData();
      
      showSuccess('Share link created successfully!', 'Success');
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('TripSharePage: Error creating shared link:', err);
      showError(`Failed to create share link: ${err.message}`, 'Error');
    }
  };

  const handleDeleteSharedLink = async (linkId: string) => {
    try {
      const { error } = await sharedTripService.deleteSharedLink(linkId);
      
      if (error) throw error;
      
      // Refresh shared links
      await fetchTripData();
      
      showSuccess('Share link deleted successfully!', 'Success');
    } catch (err: any) {
      console.error('Error deleting shared link:', err);
      showError('Failed to delete share link', 'Error');
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
      showSuccess('Link copied to clipboard!', 'Success');
    } catch (err) {
      console.error('Failed to copy link:', err);
      showError('Failed to copy link', 'Error');
    }
  };

  const handleShare = (platform: string, url: string) => {
    const text = encodeURIComponent(`Check out this amazing ${trip?.name} itinerary!`);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(trip?.name || 'Trip')}&body=${text}%20${encodeURIComponent(url)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
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

  const getCoverPhotoUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    console.log('TripSharePage: Getting cover photo URL for:', url);
    
    try {
      // Use Supabase storage getPublicUrl method like MyTrips does
      const publicUrl = supabase.storage.from('trip').getPublicUrl(url).data.publicUrl;
      console.log('TripSharePage: Generated public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('TripSharePage: Error generating public URL:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
              <p className="text-gray-600 text-lg mb-8">{error || 'This trip is no longer available.'}</p>
              <button 
                onClick={() => navigate('/my-trips')}
                className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
              >
                Back to My Trips
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasSharedLinks = sharedLinks.length > 0;
  const primarySharedLink = hasSharedLinks ? sharedLinks[0] : null;
  const shareUrl = primarySharedLink ? `${window.location.origin}/shared/${primarySharedLink.token}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Trip</h1>
              <p className="text-gray-600">Share your trip with friends and family</p>
            </div>
            <button
              onClick={() => navigate(`/itinerary/${trip.id}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Trip</span>
            </button>
          </div>
        </div>

        {/* Debug Info Panel - REMOVED */}
        
        {/* Trip Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-6">
            {/* Trip Cover Photo - Side by side */}
            <div className="relative w-48 h-48 overflow-hidden rounded-2xl flex-shrink-0">
              {trip.cover_photo_url ? (
                <img
                  src={getCoverPhotoUrl(trip.cover_photo_url) || undefined}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('TripSharePage: Image failed to load:', {
                      original: trip.cover_photo_url,
                      cleaned: getCoverPhotoUrl(trip.cover_photo_url)
                    });
                    // Hide the image on error
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-purple-500 flex items-center justify-center">
                  <Plane className="h-16 w-16 text-white opacity-80" />
                </div>
              )}
              
              {/* Fallback if image fails to load */}
              {!trip.cover_photo_url && (
                <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-purple-500 flex items-center justify-center">
                  <Plane className="h-16 w-16 text-white opacity-80" />
                </div>
              )}
            </div>
            
            {/* Trip Details - Side by side with photo */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{trip.name}</h2>
              {trip.description && (
                <p className="text-gray-600 mb-4">{trip.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                </div>
                {trip.total_estimated_cost && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>${trip.total_estimated_cost.toLocaleString()} {trip.currency}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {trip.is_public ? (
                    <>
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600">Private</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Information */}
        <div className={`mb-8 rounded-lg p-4 ${
          trip.is_public 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            {trip.is_public ? (
              <>
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Public Trip</h3>
                  <p className="text-sm text-green-700">
                    This trip is public and can be discovered by anyone. Share links provide easy access for friends and family.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Private Trip</h3>
                  <p className="text-sm text-blue-700">
                    This trip is private and won't appear in public searches. Share links allow you to give specific people access to view it.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Share Link */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Link</h3>
              
              {!hasSharedLinks ? (
                <div className="text-center py-8">
                  <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No share link created yet</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors font-medium"
                  >
                    Create Share Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareUrl || ''}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => shareUrl && handleCopyLink(shareUrl)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedLink === shareUrl ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Created: {formatDate(primarySharedLink?.created_at || null)}
                    </div>
                    <button
                      onClick={() => handleDeleteSharedLink(primarySharedLink!.id)}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Sharing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share on Social Media</h3>
              
              {!hasSharedLinks ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Create a share link first to enable social sharing</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareUrl && handleShare('facebook', shareUrl)}
                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => shareUrl && handleShare('twitter', shareUrl)}
                    className="flex items-center space-x-2 py-3 px-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareUrl && handleShare('whatsapp', shareUrl)}
                    className="flex items-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => shareUrl && handleShare('email', shareUrl)}
                    className="flex items-center space-x-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        {/* Test Shared Link */}
        {hasSharedLinks && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Your Shared Link</h3>
            <p className="text-gray-600 mb-4">
              Click the button below to test how your shared trip looks to others:
            </p>
            <button
              onClick={() => shareUrl && window.open(shareUrl, '_blank')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Open Shared Trip
            </button>
          </div>
        )}
      </div>

      {/* Create Share Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <Share2 className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Share Link</h3>
              <p className="text-gray-600 mb-6">
                This will create a share link that anyone with the link can use to view your trip, regardless of whether it's public or private.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSharedLink}
                  className="flex-1 bg-[#8B5CF6] text-white py-3 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                >
                  Create Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSharePage;
