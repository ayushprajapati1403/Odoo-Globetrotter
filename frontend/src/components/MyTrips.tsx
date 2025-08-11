import React, { useState, useMemo } from 'react';
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
  DollarSign
} from 'lucide-react';

interface Trip {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  destinationCount: number;
  budget: number;
  coverPhotoURL: string;
  description?: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const MyTrips: React.FC = () => {
  // Sample data - in real app this would come from API
  const [trips] = useState<Trip[]>([
    {
      tripId: "uuid-1234",
      tripName: "Summer Europe Tour 2025",
      startDate: "2025-05-12",
      endDate: "2025-05-25",
      destinationCount: 5,
      budget: 2500,
      coverPhotoURL: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      description: "Exploring the best of Europe with friends"
    },
    {
      tripId: "uuid-5678",
      tripName: "Weekend in Bali",
      startDate: "2025-07-10",
      endDate: "2025-07-13",
      destinationCount: 2,
      budget: 800,
      coverPhotoURL: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      description: "Relaxing tropical getaway"
    },
    {
      tripId: "uuid-9012",
      tripName: "Japan Cherry Blossom Adventure",
      startDate: "2025-04-01",
      endDate: "2025-04-15",
      destinationCount: 4,
      budget: 3200,
      coverPhotoURL: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      description: "Experiencing Japan during cherry blossom season"
    },
    {
      tripId: "uuid-3456",
      tripName: "Iceland Northern Lights",
      startDate: "2025-02-20",
      endDate: "2025-02-28",
      destinationCount: 3,
      budget: 1800,
      coverPhotoURL: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      description: "Chasing the northern lights in Iceland"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('startDate-desc');
  const [filterBy, setFilterBy] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const sortOptions: SortOption[] = [
    { value: 'startDate-desc', label: 'Start Date (Newest)' },
    { value: 'startDate-asc', label: 'Start Date (Oldest)' },
    { value: 'destinations-desc', label: 'Destinations (Most)' },
    { value: 'destinations-asc', label: 'Destinations (Least)' },
    { value: 'budget-desc', label: 'Budget (Highest)' },
    { value: 'budget-asc', label: 'Budget (Lowest)' }
  ];

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'All Trips' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' }
  ];

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let filtered = trips.filter(trip => 
      trip.tripName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (filterBy !== 'all') {
      if (filterBy === '2025' || filterBy === '2024') {
        filtered = filtered.filter(trip => 
          trip.startDate.startsWith(filterBy)
        );
      }
      // Add more filter logic as needed
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'startDate-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'destinations-desc':
          return b.destinationCount - a.destinationCount;
        case 'destinations-asc':
          return a.destinationCount - b.destinationCount;
        case 'budget-desc':
          return b.budget - a.budget;
        case 'budget-asc':
          return a.budget - b.budget;
        default:
          return 0;
      }
    });

    return filtered;
  }, [trips, searchQuery, sortBy, filterBy]);

  const formatDateRange = (startDate: string, endDate: string) => {
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

  const confirmDelete = () => {
    // In real app, this would call API to delete trip
    console.log('Deleting trip:', showDeleteModal);
    setShowDeleteModal(null);
    // Show success message
  };

  const getTotalStats = () => {
    return {
      totalTrips: trips.length,
      totalCountries: trips.reduce((sum, trip) => sum + trip.destinationCount, 0),
      totalBudget: trips.reduce((sum, trip) => sum + trip.budget, 0)
    };
  };

  const stats = getTotalStats();

  // No trips state
  if (trips.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="mb-8">
              <Plane className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Trips Yet</h2>
              <p className="text-gray-600 text-lg mb-8">
                You haven't created any trips yet. Start planning your next adventure!
              </p>
              <button className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
              <p className="text-gray-600 text-lg">Manage and explore your travel adventures</p>
            </div>
            <button className="mt-4 lg:mt-0 bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Trip</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                  <Plane className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalTrips}</div>
                  <div className="text-gray-600 text-sm">Total Trips</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCountries}</div>
                  <div className="text-gray-600 text-sm">Destinations Visited</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-[#8B5CF6]/20 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">${stats.totalBudget.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Total Budget</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search trips by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl text-gray-900 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl text-gray-900 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Trip Cards Grid */}
        {filteredAndSortedTrips.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedTrips.map((trip) => (
              <div
                key={trip.tripId}
                className="group bg-white backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#42eff5]/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Trip Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.coverPhotoURL}
                    alt={trip.tripName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-[#42eff5] hover:text-white transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-[#42eff5] hover:text-white transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTrip(trip.tripId)}
                      className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#42eff5] transition-colors">
                    {truncateText(trip.tripName, 40)}
                  </h3>
                  
                  {trip.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {truncateText(trip.description, 60)}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                      <span>{trip.destinationCount} destinations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 text-[#8B5CF6]" />
                      <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <DollarSign className="h-4 w-4 text-[#8B5CF6]" />
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-[#8B5CF6] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#8B5CF6]/90 transition-colors text-sm">
                      View Trip
                    </button>
                    <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Trip</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this trip? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
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
      </div>
    </div>
  );
};

export default MyTrips;