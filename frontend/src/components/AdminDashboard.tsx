import React, { useState, useMemo } from 'react';
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
  Clock
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  joinDate: string;
  totalTrips: number;
  lastActive: string;
}

interface TripData {
  id: string;
  name: string;
  creator: string;
  cities: string[];
  createdAt: string;
  isPublic: boolean;
  views: number;
}

interface ActivityData {
  name: string;
  count: number;
  category: string;
}

interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  signupsThisMonth: number;
  totalTrips: number;
  publicTrips: number;
  topDestination: string;
  avgTripLength: number;
}

const AdminDashboard: React.FC = () => {
  // Sample data - would come from API in real app
  const [stats] = useState<DashboardStats>({
    activeUsers: 1250,
    totalUsers: 2840,
    signupsThisMonth: 180,
    totalTrips: 860,
    publicTrips: 340,
    topDestination: "Paris",
    avgTripLength: 8.5
  });

  const [users] = useState<UserData[]>([
    {
      id: "u1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      status: "active",
      joinDate: "2024-01-15",
      totalTrips: 12,
      lastActive: "2025-01-15"
    },
    {
      id: "u2",
      name: "Marcus Rodriguez",
      email: "marcus.r@example.com",
      status: "active",
      joinDate: "2024-03-22",
      totalTrips: 8,
      lastActive: "2025-01-14"
    },
    {
      id: "u3",
      name: "Emily Thompson",
      email: "emily.t@example.com",
      status: "suspended",
      joinDate: "2024-02-10",
      totalTrips: 3,
      lastActive: "2025-01-10"
    },
    {
      id: "u4",
      name: "David Kim",
      email: "david.kim@example.com",
      status: "active",
      joinDate: "2024-05-18",
      totalTrips: 15,
      lastActive: "2025-01-15"
    },
    {
      id: "u5",
      name: "Lisa Wang",
      email: "lisa.wang@example.com",
      status: "active",
      joinDate: "2024-04-05",
      totalTrips: 6,
      lastActive: "2025-01-13"
    }
  ]);

  const [trips] = useState<TripData[]>([
    {
      id: "t1",
      name: "Summer Europe Tour 2025",
      creator: "Sarah Chen",
      cities: ["Paris", "Rome", "Barcelona"],
      createdAt: "2025-01-10",
      isPublic: true,
      views: 247
    },
    {
      id: "t2",
      name: "Japan Cherry Blossom Adventure",
      creator: "Marcus Rodriguez",
      cities: ["Tokyo", "Kyoto", "Osaka"],
      createdAt: "2025-01-08",
      isPublic: true,
      views: 189
    },
    {
      id: "t3",
      name: "Weekend in Bali",
      creator: "Emily Thompson",
      cities: ["Bali"],
      createdAt: "2025-01-05",
      isPublic: false,
      views: 0
    },
    {
      id: "t4",
      name: "Iceland Northern Lights",
      creator: "David Kim",
      cities: ["Reykjavik", "Akureyri"],
      createdAt: "2025-01-03",
      isPublic: true,
      views: 156
    }
  ]);

  const [activities] = useState<ActivityData[]>([
    { name: "Eiffel Tower Tour", count: 450, category: "Sightseeing" },
    { name: "Louvre Museum", count: 380, category: "Culture" },
    { name: "Seine River Cruise", count: 320, category: "Sightseeing" },
    { name: "French Cooking Class", count: 280, category: "Food" },
    { name: "Colosseum Tour", count: 260, category: "Sightseeing" },
    { name: "Vatican Museums", count: 240, category: "Culture" },
    { name: "Tokyo Food Tour", count: 220, category: "Food" },
    { name: "Sagrada Familia", count: 200, category: "Culture" },
    { name: "Bike Tour Amsterdam", count: 180, category: "Adventure" },
    { name: "Broadway Show", count: 160, category: "Events" }
  ]);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [tripVisibilityFilter, setTripVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = userSearchQuery === '' || 
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
      
      const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [users, userSearchQuery, userStatusFilter]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = tripSearchQuery === '' || 
        trip.name.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
        trip.creator.toLowerCase().includes(tripSearchQuery.toLowerCase());
      
      const matchesVisibility = tripVisibilityFilter === 'all' || 
        (tripVisibilityFilter === 'public' && trip.isPublic) ||
        (tripVisibilityFilter === 'private' && !trip.isPublic);
      
      return matchesSearch && matchesVisibility;
    });
  }, [trips, tripSearchQuery, tripVisibilityFilter]);

  // Category distribution for pie chart
  const categoryDistribution = useMemo(() => {
    const categories = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + activity.count;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: (count / activities.reduce((sum, a) => sum + a.count, 0)) * 100
    }));
  }, [activities]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId);
    // In real app, this would call API
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Deleting user:', userId);
      // In real app, this would call API
    }
  };

  const handleExportReport = (reportType: string, format: string) => {
    console.log(`Exporting ${reportType} report as ${format}`);
    setShowExportModal(false);
    // In real app, this would generate and download the report
  };

  const categoryColors: Record<string, string> = {
    'Sightseeing': 'bg-blue-500',
    'Culture': 'bg-purple-500',
    'Food': 'bg-orange-500',
    'Adventure': 'bg-green-500',
    'Events': 'bg-pink-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Platform analytics and user management</p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">of {stats.totalUsers.toLocaleString()} total</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.signupsThisMonth}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
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
                <p className="text-sm text-gray-500">Avg {stats.avgTripLength} days</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Popularity Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Top Activities</h3>
              <BarChart3 className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div className="space-y-3">
              {activities.slice(0, 6).map((activity, index) => {
                const maxCount = Math.max(...activities.map(a => a.count));
                const percentage = (activity.count / maxCount) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 text-sm">{activity.name}</span>
                      <span className="text-sm text-gray-600">{activity.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${categoryColors[activity.category] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Category Distribution</h3>
              <PieChart className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div className="space-y-4">
              {categoryDistribution.map((item, index) => (
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
              onChange={(e) => setUserStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Trips</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Active</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(user.joinDate)}</td>
                    <td className="py-3 px-4 text-gray-600">{user.totalTrips}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(user.lastActive)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Cities</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Visibility</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{trip.name}</td>
                    <td className="py-3 px-4 text-gray-600">{trip.creator}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {trip.cities.map((city, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {city}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trip.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {trip.views > 0 ? trip.views.toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(trip.createdAt)}</td>
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