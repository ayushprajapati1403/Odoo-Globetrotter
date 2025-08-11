import React, { useState, useEffect } from 'react';
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
  Plane
} from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  time?: string;
  cost?: number;
  currency?: string;
  notes?: string;
  category: string;
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

interface SharedTrip {
  publicId: string;
  tripName: string;
  coverPhotoURL?: string;
  startDate: string;
  endDate: string;
  cities: string[];
  totalDays: number;
  createdBy: string;
  createdAt: string;
  likes: number;
  views: number;
  itinerary: City[];
  shareUrl: string;
  description?: string;
}

interface SharedItineraryProps {
  publicId: string;
}

const SharedItinerary: React.FC<SharedItineraryProps> = ({ publicId }) => {
  // Sample shared trip data - would come from API in real app
  const [trip] = useState<SharedTrip>({
    publicId: "abc123",
    tripName: "Epic Europe Summer Adventure 2025",
    coverPhotoURL: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    startDate: "2025-05-12",
    endDate: "2025-05-25",
    cities: ["Paris", "Rome", "Barcelona"],
    totalDays: 14,
    createdBy: "Sarah Chen",
    createdAt: "2025-01-15",
    likes: 247,
    views: 1832,
    description: "A carefully planned 2-week journey through Europe's most iconic cities, featuring must-see attractions, hidden gems, and authentic local experiences.",
    shareUrl: "https://travelapp.com/trips/abc123",
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
                id: "louvre",
                name: "Visit the Louvre",
                time: "10:00",
                cost: 17,
                currency: "EUR",
                notes: "Buy tickets online to skip the queue. World's largest art museum.",
                category: "Culture"
              },
              {
                id: "lunch-cafe",
                name: "Lunch at Café de Flore",
                time: "13:00",
                cost: 35,
                currency: "EUR",
                notes: "Historic café in Saint-Germain-des-Prés",
                category: "Food"
              },
              {
                id: "eiffel",
                name: "Eiffel Tower Sunset",
                time: "18:30",
                cost: 25,
                currency: "EUR",
                notes: "Best views from Trocadéro Gardens",
                category: "Sightseeing"
              }
            ]
          },
          {
            dayLabel: "Day 2",
            date: "2025-05-13",
            weekday: "Tuesday",
            activities: [
              {
                id: "versailles",
                name: "Palace of Versailles",
                time: "09:00",
                cost: 20,
                currency: "EUR",
                notes: "Take RER C train from central Paris. Allow full day.",
                category: "Culture"
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
                id: "colosseum",
                name: "Colosseum & Roman Forum",
                time: "14:00",
                cost: 16,
                currency: "EUR",
                notes: "Skip-the-line tickets included. Allow 3-4 hours.",
                category: "Sightseeing"
              }
            ]
          }
        ]
      }
    ]
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

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
    return amount === 0 ? 'Free' : `${symbols[currency] || currency}${amount}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(trip.shareUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyTrip = () => {
    // In real app, this would duplicate the trip to user's account
    alert('Trip copied to your account! You can now edit your own version.');
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(trip.shareUrl);
    const text = encodeURIComponent(`Check out this amazing ${trip.tripName} itinerary!`);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${encodeURIComponent(trip.tripName)}&body=${text}%20${url}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const getTotalCost = () => {
    return trip.itinerary.reduce((total, city) => 
      total + city.days.reduce((cityTotal, day) => 
        cityTotal + day.activities.reduce((dayTotal, activity) => 
          dayTotal + (activity.cost || 0), 0
        ), 0
      ), 0
    );
  };

  const categoryIcons: { [key: string]: any } = {
    'Sightseeing': Camera,
    'Culture': Star,
    'Food': MapPin,
    'Transport': Plane,
    'Accommodation': MapPin
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden mt-16">
        {trip.coverPhotoURL ? (
          <img
            src={trip.coverPhotoURL}
            alt={trip.tripName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#8B5CF6] to-purple-500"></div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.tripName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{trip.cities.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{trip.totalDays} days</span>
                  </div>
                </div>
                {trip.description && (
                  <p className="mt-4 text-lg text-gray-200 max-w-2xl">{trip.description}</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-6 lg:mt-0">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{trip.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={handleCopyTrip}
                  className="flex items-center space-x-2 px-6 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors font-semibold"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Trip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">{trip.cities.length}</div>
            <div className="text-gray-600 text-sm">Cities</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">{trip.totalDays}</div>
            <div className="text-gray-600 text-sm">Days</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-[#8B5CF6]">
              {trip.itinerary.reduce((total, city) => 
                total + city.days.reduce((cityTotal, day) => cityTotal + day.activities.length, 0), 0
              )}
            </div>
            <div className="text-gray-600 text-sm">Activities</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-green-600">€{getTotalCost()}</div>
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
                <h3 className="font-semibold text-gray-900">Created by {trip.createdBy}</h3>
                <p className="text-gray-600 text-sm">
                  Published on {formatDate(trip.createdAt)} • {trip.views.toLocaleString()} views
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Share URL</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  travelapp.com/trips/{trip.publicId}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {showCopySuccess && (
                <p className="text-green-600 text-xs mt-1">Link copied!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {trip.itinerary.map((city, cityIndex) => (
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
                      {day.activities.map((activity, activityIndex) => {
                        const Icon = categoryIcons[activity.category] || MapPin;
                        
                        return (
                          <div 
                            key={activity.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="bg-[#8B5CF6]/20 p-2 rounded-lg">
                                  <Icon className="h-4 w-4 text-[#8B5CF6]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                                    {activity.time && (
                                      <div className="flex items-center space-x-1 text-[#8B5CF6] text-sm font-medium">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.time}</span>
                                      </div>
                                    )}
                                    {activity.cost !== undefined && (
                                      <span className="text-green-600 font-medium text-sm">
                                        {formatCurrency(activity.cost, activity.currency || 'EUR')}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {activity.notes && (
                                    <p className="text-gray-600 text-sm">{activity.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share This Trip</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* Share URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={trip.shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('email')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedItinerary;