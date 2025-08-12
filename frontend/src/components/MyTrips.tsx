import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  SortAsc,
  SortDesc,
  X,
  Plane,
  DollarSign,
  Users,
  Globe,
  Lock,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Trip, 
  isTripOwner, 
  canEditTrip, 
  canDeleteTrip, 
  getTripRole,
  isAdmin 
} from '../utils/permissions';
import TripSuggestions from './TripSuggestions';
import { getUserCurrencySymbol } from '../utils/currencyUtils';

interface SortOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('startDate-desc');
  const [filterBy, setFilterBy] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [userCurrencySymbol, setUserCurrencySymbol] = useState<string>('$');

  const sortOptions: SortOption[] = [
    { value: 'startDate-desc', label: 'Start Date (Newest)' },
    { value: 'startDate-asc', label: 'Start Date (Oldest)' },
    { value: 'created-desc', label: 'Created (Newest)' },
    { value: 'created-asc', label: 'Created (Oldest)' },
    { value: 'cost-desc', label: 'Cost (Highest)' },
    { value: 'cost-asc', label: 'Cost (Lowest)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Trips' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' }
  ];

  // Fetch user's currency symbol
  const fetchUserCurrency = async () => {
    if (!user) return;
    
    try {
      const symbol = await getUserCurrencySymbol(user.id);
      setUserCurrencySymbol(symbol);
    } catch (error) {
      console.error('Error fetching user currency:', error);
      setUserCurrencySymbol('$');
    }
  };

  // Test database connection and table existence
  const testDatabaseConnection = async () => {
    if (!user) return;
    
    try {
      console.log('Testing database connection...');
      
      // Test if trips table exists and is accessible
      const { data: tripsTest, error: tripsError } = await supabase
        .from('trips')
        .select('count')
        .limit(1);
      
      console.log('Trips table test:', { data: tripsTest, error: tripsError });
      
      if (tripsError) {
        console.error('Database Error - Trips table error:', tripsError.message);
      } else {
        console.log('Database Connected - Trips table is accessible');
      }
      
      // Test if user_trips table exists and is accessible
      const { data: userTripsTest, error: userTripsError } = await supabase
        .from('user_trips')
        .select('count')
        .limit(1);
      
      console.log('User trips table test:', { data: userTripsTest, error: userTripsError });
      
      if (userTripsError) {
        console.error('Database Error - User trips table error:', userTripsError.message);
      } else {
        console.log('Database Connected - User trips table is accessible');
      }
      
    } catch (err) {
      console.error('Database connection test error:', err);
      console.error('Connection Error - Failed to test database connection');
    }
  };

  // Fetch trips from Supabase
  useEffect(() => {
    console.log('MyTrips component mounted');
    console.log('User from auth context:', user);
    console.log('User ID:', user?.id);
    
    if (user) {
      console.log('User authenticated, fetching trips...');
      testDatabaseConnection();
      fetchTrips();
      fetchUserCurrency();
    } else {
      console.log('No user found, cannot fetch trips');
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching trips for user:', user?.id);

      // Fetch trips where the user is the owner (user_id matches)
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (tripsError) {
        console.error('Error fetching trips:', tripsError);
        throw tripsError;
      }

      console.log('Trips data fetched:', tripsData);
      setTrips(tripsData || []);
      
      if (tripsData && tripsData.length > 0) {
        console.log('Trips Loaded - Successfully loaded', tripsData.length, 'trips');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trips';
      setError(errorMessage);
      console.error('Fetch Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let filtered = trips.filter(trip => 
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply filters
    if (filterBy !== 'all') {
      const now = new Date();
      switch (filterBy) {
        case 'upcoming':
          filtered = filtered.filter(trip => 
            trip.start_date && new Date(trip.start_date) > now
          );
          break;
        case 'past':
          filtered = filtered.filter(trip => 
            trip.end_date && new Date(trip.end_date) < now
          );
          break;
        case 'public':
          filtered = filtered.filter(trip => trip.is_public);
          break;
        case 'private':
          filtered = filtered.filter(trip => !trip.is_public);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate-desc':
          if (!a.start_date && !b.start_date) return 0;
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'startDate-asc':
          if (!a.start_date && !b.start_date) return 0;
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'created-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'cost-desc':
          if (!a.total_estimated_cost && !b.total_estimated_cost) return 0;
          if (!a.total_estimated_cost) return 1;
          if (!b.total_estimated_cost) return -1;
          return (b.total_estimated_cost || 0) - (a.total_estimated_cost || 0);
        case 'cost-asc':
          if (!a.total_estimated_cost && !b.total_estimated_cost) return 0;
          if (!a.total_estimated_cost) return 1;
          if (!b.total_estimated_cost) return -1;
          return (a.total_estimated_cost || 0) - (b.total_estimated_cost || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trips, searchQuery, sortBy, filterBy]);

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate && !endDate) return 'No dates set';
    if (!startDate) return `Until ${new Date(endDate!).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    if (!endDate) return `From ${new Date(startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    
    const start = new Date(startDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const end = new Date(endDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${start} – ${end}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleDeleteTrip = (tripId: string) => {
    setShowDeleteModal(tripId);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal || !user) return;

    try {
      console.log('Deleting trip:', showDeleteModal);
      
      // Soft delete the trip
      const { error: updateError } = await supabase
        .from('trips')
        .update({ deleted: true })
        .eq('id', showDeleteModal)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error deleting trip:', updateError);
        throw updateError;
      }

      // Remove from local state
      setTrips(prev => prev.filter(trip => trip.id !== showDeleteModal));
      setShowDeleteModal(null);
      
      console.log('Trip Deleted - Trip has been successfully deleted');
    } catch (err) {
      console.error('Error deleting trip:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete trip';
      console.error('Delete Error:', errorMessage);
    }
  };

  const isTripOwnerLocal = (trip: Trip) => {
    return isTripOwner(trip, user);
  };

  const canEditTripLocal = (trip: Trip) => {
    return canEditTrip(trip, user);
  };

  const canDeleteTripLocal = (trip: Trip) => {
    return canDeleteTrip(trip, user);
  };

  const getTripRoleLocal = (trip: Trip) => {
    return getTripRole(trip, user);
  };

  const getTotalStats = () => {
    const now = new Date();
    const upcomingTrips = trips.filter(trip => 
      trip.start_date && new Date(trip.start_date) > now
    );
    const pastTrips = trips.filter(trip => 
      trip.end_date && new Date(trip.end_date) < now
    );
    
    return {
      totalTrips: trips.length,
      upcomingTrips: upcomingTrips.length,
      pastTrips: pastTrips.length,
      totalCost: trips.reduce((sum, trip) => sum + (trip.total_estimated_cost || 0), 0)
    };
  };

  const stats = getTotalStats();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white/80">Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="mb-8">
              <X className="h-24 w-24 text-red-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Error Loading Trips</h2>
              <p className="text-white/80 text-lg mb-8">{error}</p>
              <button 
                onClick={fetchTrips}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No trips state
  if (trips.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="mb-8">
              <Plane className="h-24 w-24 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">No Trips Yet</h2>
              <p className="text-white/80 text-lg mb-8">
                You haven't created any trips yet. Start planning your next adventure!
              </p>
              <button 
                onClick={() => {
                  console.log('Create Your First Trip button clicked - redirecting to /create-trip');
                  navigate('/create-trip');
                }}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold tracking-wider text-white mb-4">
                MY TRIPS
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-3xl text-white/80">
                Manage and explore your travel adventures with style and sophistication
              </p>
            </div>
            <button 
              onClick={() => {
                console.log('Create New Trip button clicked - redirecting to /create-trip');
                navigate('/create-trip');
              }}
              className="mt-6 lg:mt-0 group bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-2xl"
            >
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              <span>Create New Trip</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:border-cyan-400/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-xl">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalTrips}</div>
                  <div className="text-white/70 text-sm">Total Trips</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:border-emerald-400/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.upcomingTrips}</div>
                  <div className="text-white/70 text-sm">Upcoming</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:border-purple-400/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.pastTrips}</div>
                  <div className="text-white/70 text-sm">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:border-cyan-400/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{userCurrencySymbol}{stats.totalCost.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">Total Budget</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search trips by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none" />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:border-cyan-400 focus:ring-cyan-400/50 transition-all duration-300"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Trip Cards Grid */}
        {filteredAndSortedTrips.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No trips found</h3>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedTrips.map((trip) => {
              
              return (
                <div
                  key={trip.id}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Trip Image */}
                  <div className="relative h-48 overflow-hidden">
                    {trip.cover_photo_url ? (
                      <img
                        src={`${supabase.storage.from('trip').getPublicUrl(trip.cover_photo_url).data.publicUrl}`}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                        <Plane className="h-16 w-16 text-white opacity-80" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Trip Status Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        trip.is_public 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/50' 
                          : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border border-gray-400/50'
                      }`}>
                        {trip.is_public ? <Globe className="h-3 w-3 inline mr-1" /> : <Lock className="h-3 w-3 inline mr-1" />}
                        {trip.is_public ? 'Public' : 'Private'}
                      </div>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-cyan-400 hover:text-white transition-colors border border-white/30"
                        title="Edit Itinerary"
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                      {canEditTripLocal(trip) && (
                        <button 
                          onClick={() => navigate(`/edit-trip/${trip.id}`)}
                          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-cyan-400 hover:text-white transition-colors border border-white/30"
                          title="Edit Trip"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDeleteTripLocal(trip) && (
                        <button 
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-white/30"
                          title="Delete Trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <Link
                        to={`/trip/${trip.id}/share`}
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-cyan-400 hover:text-white transition-colors border border-white/30"
                        title="Share Trip"
                      >
                        <Share2 className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {truncateText(trip.name, 40)}
                    </h3>
                    
                    {trip.description && (
                      <p className="text-white/70 text-sm mb-3">
                        {truncateText(trip.description, 60)}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-white/70 text-sm">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                      </div>
                      {trip.total_estimated_cost && (
                        <div className="flex items-center space-x-2 text-white/70 text-sm">
                          <DollarSign className="h-4 w-4 text-emerald-400" />
                          <span>{userCurrencySymbol}{trip.total_estimated_cost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/itinerary/${trip.id}`}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-400 hover:to-emerald-400 transition-colors text-sm"
                      >
                        View Itinerary
                      </Link>
                      <Link
                        to={`/calendar/${trip.id}`}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-400 hover:to-pink-400 transition-colors text-sm"
                      >
                        Calendar
                      </Link>
                      {canEditTripLocal(trip) && (
                        <button 
                          onClick={() => navigate(`/edit-trip/${trip.id}`)}
                          className="bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                          title="Edit Trip"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <Trash2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Delete Trip</h3>
                <p className="text-white/70 mb-6">
                  Are you sure you want to delete this trip? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trip Suggestions */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <TripSuggestions onTripCloned={(tripId) => {
            console.log('Trip Cloned! - Your new trip has been created successfully');
            fetchTrips(); // Refresh the trips list
          }} />
        </div>

        {/* Developer Tools */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Developer Tools</h3>
          <div className="flex space-x-3">
            <button
              onClick={testDatabaseConnection}
              className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 px-4 py-2 rounded-lg hover:from-cyan-400/30 hover:to-emerald-400/30 transition-colors text-sm border border-cyan-400/30"
            >
              Test Database Connection
            </button>
          </div>
          <p className="text-xs text-white/50 mt-2">
            Check the browser console for database test results
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;