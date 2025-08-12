import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  UserX,
  Trash2,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  Plane,
  Hotel,
  DollarSign,
  Database,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  created_at: string;
  role_id: number;
  home_city_id: string | null;
  currency_id: string | null;
}

interface TripData {
  id: string;
  name: string;
  user_id: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_public: boolean;
  total_estimated_cost: number | null;
  budget: number | null;
  trip_type: string;
  created_at: string;
  deleted: boolean;
  user_email?: string;
}

interface CityData {
  id: string;
  name: string;
  country: string | null;
  population: number | null;
  cost_index: number | null;
  popularity_score: number | null;
  created_at: string;
}

interface ActivityData {
  id: string;
  name: string;
  category: string | null;
  cost: number | null;
  city_id: string | null;
  city_name?: string;
  created_at: string;
}

interface AccommodationData {
  id: string;
  name: string | null;
  provider: string | null;
  price_per_night: number | null;
  city_id: string | null;
  city_name?: string;
  created_at: string;
}

interface TransportData {
  id: string;
  mode: string;
  from_city_id: string | null;
  to_city_id: string | null;
  avg_cost: number | null;
  from_city_name?: string;
  to_city_name?: string;
  created_at: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTrips: number;
  publicTrips: number;
  totalCities: number;
  totalActivities: number;
  totalAccommodations: number;
  totalTransportRoutes: number;
  avgTripCost: number;
  topDestination: string;
  recentSignups: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTrips: 0,
    publicTrips: 0,
    totalCities: 0,
    totalActivities: 0,
    totalAccommodations: 0,
    totalTransportRoutes: 0,
    avgTripCost: 0,
    topDestination: '',
    recentSignups: 0
  });

  const [users, setUsers] = useState<UserData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationData[]>([]);
  const [transportRoutes, setTransportRoutes] = useState<TransportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [tripVisibilityFilter, setTripVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch all data from Supabase
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users with role information
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          active,
          created_at,
          role_id,
          home_city_id,
          currency_id
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch trips with user email
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select(`
          id,
          name,
          user_id,
          description,
          start_date,
          end_date,
          is_public,
          total_estimated_cost,
          budget,
          trip_type,
          created_at,
          deleted
        `)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (tripsError) throw tripsError;

      // Fetch cities
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select(`
          id,
          name,
          country,
          population,
          cost_index,
          popularity_score,
          created_at
        `)
        .order('popularity_score', { ascending: false });

      if (citiesError) throw citiesError;

      // Fetch activities with city names
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          id,
          name,
          category,
          cost,
          city_id,
          created_at
        `)
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Fetch accommodations with city names
      const { data: accommodationsData, error: accommodationsError } = await supabase
        .from('accommodations')
        .select(`
          id,
          name,
          provider,
          price_per_night,
          city_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (accommodationsError) throw accommodationsError;

      // Fetch transport routes
      const { data: transportData, error: transportError } = await supabase
        .from('transport_costs')
        .select(`
          id,
          mode,
          from_city_id,
          to_city_id,
          avg_cost,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (transportError) throw transportError;

      // Enrich data with city names
      const enrichedTrips = tripsData.map(trip => ({
        ...trip,
        user_email: usersData.find(u => u.id === trip.user_id)?.email || 'Unknown'
      }));

      const enrichedActivities = activitiesData.map(activity => ({
        ...activity,
        city_name: citiesData.find(c => c.id === activity.city_id)?.name || 'Unknown'
      }));

      const enrichedAccommodations = accommodationsData.map(acc => ({
        ...acc,
        city_name: citiesData.find(c => c.id === acc.city_id)?.name || 'Unknown'
      }));

      const enrichedTransport = transportData.map(route => ({
        ...route,
        from_city_name: citiesData.find(c => c.id === route.from_city_id)?.name || 'Unknown',
        to_city_name: citiesData.find(c => c.id === route.to_city_id)?.name || 'Unknown'
      }));

      // Calculate statistics
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(u => u.active).length;
      const totalTrips = enrichedTrips.length;
      const publicTrips = enrichedTrips.filter(t => t.is_public).length;
      const totalCities = citiesData.length;
      const totalActivities = enrichedActivities.length;
      const totalAccommodations = enrichedAccommodations.length;
      const totalTransportRoutes = enrichedTransport.length;
      
      const validTripCosts = enrichedTrips
        .filter(t => t.total_estimated_cost && t.total_estimated_cost > 0)
        .map(t => t.total_estimated_cost!);
      const avgTripCost = validTripCosts.length > 0 
        ? validTripCosts.reduce((sum, cost) => sum + cost, 0) / validTripCosts.length 
        : 0;

      const topDestination = citiesData.length > 0 ? citiesData[0].name : 'No data';
      const recentSignups = usersData.filter(u => {
        const userDate = new Date(u.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return userDate >= thirtyDaysAgo;
      }).length;

      setStats({
        totalUsers,
        activeUsers,
        totalTrips,
        publicTrips,
        totalCities,
        totalActivities,
        totalAccommodations,
        totalTransportRoutes,
        avgTripCost,
        topDestination,
        recentSignups
      });

      setUsers(usersData);
      setTrips(enrichedTrips);
      setCities(citiesData);
      setActivities(enrichedActivities);
      setAccommodations(enrichedAccommodations);
      setTransportRoutes(enrichedTransport);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = userSearchQuery === '' || 
        (user.name && user.name.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
      
      const matchesStatus = userStatusFilter === 'all' || 
        (userStatusFilter === 'active' && user.active) ||
        (userStatusFilter === 'inactive' && !user.active);
      
      return matchesSearch && matchesStatus;
    });
  }, [users, userSearchQuery, userStatusFilter]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = tripSearchQuery === '' || 
        trip.name.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
        (trip.user_email && trip.user_email.toLowerCase().includes(tripSearchQuery.toLowerCase()));
      
      const matchesVisibility = tripVisibilityFilter === 'all' || 
        (tripVisibilityFilter === 'public' && trip.is_public) ||
        (tripVisibilityFilter === 'private' && !trip.is_public);
      
      return matchesSearch && matchesVisibility;
    });
  }, [trips, tripSearchQuery, tripVisibilityFilter]);

  // Category distribution for activities
  const activityCategoryDistribution = useMemo(() => {
    const categories = activities.reduce((acc, activity) => {
      const category = activity.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / activities.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }, [activities]);

  // Top cities by popularity
  const topCities = useMemo(() => {
    return cities
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, 10);
  }, [cities]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ));

      // Refresh stats
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      // Refresh stats
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleExportReport = (reportType: string, format: string) => {
    console.log(`Exporting ${reportType} report as ${format}`);
    setShowExportModal(false);
    // TODO: Implement actual export functionality
  };

  const categoryColors: Record<string, string> = {
    'Sightseeing': 'bg-blue-500',
    'Culture': 'bg-purple-500',
    'Food': 'bg-orange-500',
    'Adventure': 'bg-green-500',
    'Events': 'bg-pink-500',
    'Uncategorized': 'bg-gray-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Real-time platform analytics and management</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{stats.activeUsers} active</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">New Signups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentSignups}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Last 30 days
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
                <p className="text-sm text-gray-500">{stats.publicTrips} public</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Top Destination</p>
                <p className="text-3xl font-bold text-gray-900">{stats.topDestination}</p>
                <p className="text-sm text-gray-500">Avg ${stats.avgTripCost.toFixed(0)} per trip</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cities</h3>
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalCities}</p>
            <p className="text-sm text-gray-600">Registered destinations</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Activities</h3>
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.totalActivities}</p>
            <p className="text-sm text-gray-600">Available experiences</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Transport Routes</h3>
              <Plane className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.totalTransportRoutes}</p>
            <p className="text-sm text-gray-600">Travel connections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Cities by Popularity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Top Cities</h3>
              <BarChart3 className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div className="space-y-3">
              {topCities.map((city, index) => (
                <div key={city.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                    <span className="font-medium text-gray-900">{city.name}</span>
                    {city.country && (
                      <span className="text-sm text-gray-500">({city.country})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {(city.popularity_score || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Popularity</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Activity Categories</h3>
              <PieChart className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div className="space-y-4">
              {activityCategoryDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${categoryColors[item.category] || 'bg-gray-500'}`}></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.count}</div>
                    <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Reports</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50"
              />
            </div>
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'No name'}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.role_id === 1 ? 'User' : user.role_id === 2 ? 'Editor' : 'Admin'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.active)}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title={user.active ? 'Deactivate User' : 'Activate User'}
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trip Data */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Trips</h3>

          {/* Trip Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search trips by name or creator..."
                value={tripSearchQuery}
                onChange={(e) => setTripSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50"
              />
            </div>
            <select
              value={tripVisibilityFilter}
              onChange={(e) => setTripVisibilityFilter(e.target.value as 'all' | 'public' | 'private')}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50"
            >
              <option value="all">All Trips</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>

          {/* Trips Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Trip Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Creator</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Visibility</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Budget</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.slice(0, 20).map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{trip.name}</td>
                    <td className="py-3 px-4 text-gray-600">{trip.user_email || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {trip.trip_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trip.is_public 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {trip.budget ? `$${trip.budget.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(trip.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Export Reports</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]">
                    <option value="user-stats">User Statistics</option>
                    <option value="trip-stats">Trip Statistics</option>
                    <option value="activity-stats">Activity Statistics</option>
                    <option value="city-stats">City Statistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleExportReport('user-stats', 'csv')}
                      className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => handleExportReport('user-stats', 'xlsx')}
                      className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      XLSX
                    </button>
                    <button
                      onClick={() => handleExportReport('user-stats', 'pdf')}
                      className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;