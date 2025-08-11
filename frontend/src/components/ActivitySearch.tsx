import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  Minus,
  Star, 
  Clock,
  DollarSign,
  MapPin,
  Camera,
  Utensils,
  Mountain,
  ShoppingBag,
  Calendar,
  Palette,
  ChevronDown,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface Activity {
  activityId: string;
  name: string;
  cityId: string;
  category: string;
  description: string;
  cost: number;
  currency: string;
  duration: string;
  rating: number;
  imageURL: string;
  isPopular?: boolean;
}

interface ActivitySearchProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCityId: string;
  selectedCityName: string;
  onAddActivity: (activity: Activity) => void;
  existingActivityIds: string[];
}

interface Filters {
  category: string;
  costRange: [number, number];
  minRating: number;
  duration: string;
}

const ActivitySearch: React.FC<ActivitySearchProps> = ({ 
  isOpen, 
  onClose, 
  selectedCityId,
  selectedCityName,
  onAddActivity, 
  existingActivityIds 
}) => {
  // Sample activity data - would come from API in real app
  const [activities] = useState<Activity[]>([
    {
      activityId: "louvre-tour",
      name: "Louvre Museum Tour",
      cityId: "paris-france",
      category: "Culture",
      description: "Guided tour of the world's largest art museum with skip-the-line access.",
      cost: 25,
      currency: "EUR",
      duration: "3h",
      rating: 4.7,
      imageURL: "https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      isPopular: true
    },
    {
      activityId: "eiffel-tower",
      name: "Eiffel Tower Experience",
      cityId: "paris-france",
      category: "Sightseeing",
      description: "Visit the iconic Eiffel Tower with elevator access to the top floors.",
      cost: 29,
      currency: "EUR",
      duration: "2h",
      rating: 4.8,
      imageURL: "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      activityId: "seine-cruise",
      name: "Seine River Cruise",
      cityId: "paris-france",
      category: "Sightseeing",
      description: "Romantic evening cruise along the Seine with dinner and city views.",
      cost: 65,
      currency: "EUR",
      duration: "2.5h",
      rating: 4.5,
      imageURL: "https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      activityId: "cooking-class",
      name: "French Cooking Class",
      cityId: "paris-france",
      category: "Food",
      description: "Learn to cook authentic French cuisine with a professional chef.",
      cost: 85,
      currency: "EUR",
      duration: "4h",
      rating: 4.9,
      imageURL: "https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      isPopular: true
    },
    {
      activityId: "montmartre-walk",
      name: "Montmartre Walking Tour",
      cityId: "paris-france",
      category: "Culture",
      description: "Explore the artistic heart of Paris with local guide stories.",
      cost: 15,
      currency: "EUR",
      duration: "2h",
      rating: 4.4,
      imageURL: "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      activityId: "shopping-champs",
      name: "Champs-Élysées Shopping",
      cityId: "paris-france",
      category: "Shopping",
      description: "Luxury shopping experience on the world's most famous avenue.",
      cost: 0,
      currency: "EUR",
      duration: "3h",
      rating: 4.2,
      imageURL: "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      activityId: "bike-tour",
      name: "Paris Bike Adventure",
      cityId: "paris-france",
      category: "Adventure",
      description: "Cycle through Paris parks and hidden neighborhoods with expert guide.",
      cost: 35,
      currency: "EUR",
      duration: "3.5h",
      rating: 4.6,
      imageURL: "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    },
    {
      activityId: "cabaret-show",
      name: "Moulin Rouge Show",
      cityId: "paris-france",
      category: "Events",
      description: "World-famous cabaret show with dinner and champagne included.",
      cost: 120,
      currency: "EUR",
      duration: "3h",
      rating: 4.3,
      imageURL: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<Filters>({
    category: '',
    costRange: [0, 150],
    minRating: 0,
    duration: ''
  });

  const categories = [
    { id: 'All', label: 'All', icon: MapPin },
    { id: 'Sightseeing', label: 'Sightseeing', icon: Camera },
    { id: 'Culture', label: 'Culture', icon: Palette },
    { id: 'Food', label: 'Food', icon: Utensils },
    { id: 'Adventure', label: 'Adventure', icon: Mountain },
    { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'Events', label: 'Events', icon: Calendar }
  ];

  const durationOptions = [
    { value: '', label: 'Any Duration' },
    { value: 'short', label: '< 2 hours' },
    { value: 'medium', label: '2-4 hours' },
    { value: 'long', label: '> 4 hours' }
  ];

  // Filter activities based on search, category, and filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // City filter
      if (activity.cityId !== selectedCityId) return false;

      // Search query filter
      const matchesSearch = searchQuery === '' || 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = activeCategory === 'All' || activity.category === activeCategory;

      // Cost range filter
      const matchesCost = activity.cost >= filters.costRange[0] && 
                         activity.cost <= filters.costRange[1];

      // Rating filter
      const matchesRating = activity.rating >= filters.minRating;

      // Duration filter
      const matchesDuration = filters.duration === '' ||
        (filters.duration === 'short' && parseFloat(activity.duration) < 2) ||
        (filters.duration === 'medium' && parseFloat(activity.duration) >= 2 && parseFloat(activity.duration) <= 4) ||
        (filters.duration === 'long' && parseFloat(activity.duration) > 4);

      return matchesSearch && matchesCategory && matchesCost && matchesRating && matchesDuration;
    });
  }, [activities, selectedCityId, searchQuery, activeCategory, filters]);

  const handleImageError = (activityId: string) => {
    setImageErrors(prev => new Set([...prev, activityId]));
  };

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
    };
    return amount === 0 ? 'Free' : `${symbols[currency] || currency}${amount}`;
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      costRange: [0, 150],
      minRating: 0,
      duration: ''
    });
    setActiveCategory('All');
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Activities in {selectedCityName}</h2>
              <p className="text-purple-100">Discover amazing experiences and attractions</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 animate-spin" />
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.id 
                      ? 'bg-[#8B5CF6] text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex h-[calc(90vh-280px)]">
          {/* Filter Panel */}
          <div className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
            showFilters ? 'w-80' : 'w-16'
          }`}>
            <div className="p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Filter className="h-5 w-5" />
                {showFilters && <span className="font-medium">Filters</span>}
              </button>

              {showFilters && (
                <div className="mt-6 space-y-6">
                  {/* Cost Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="150"
                        value={filters.costRange[1]}
                        onChange={(e) => setFilters({ 
                          ...filters, 
                          costRange: [0, parseInt(e.target.value)] 
                        })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Free</span>
                        <span>€150+</span>
                      </div>
                      <div className="text-center text-sm text-gray-700">
                        Up to €{filters.costRange[1]}
                      </div>
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilters({ ...filters, minRating: rating })}
                          className={`p-1 ${filters.minRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'Any rating'}
                    </p>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={filters.duration}
                      onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                    >
                      {durationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">Try changing your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => {
                  const isAlreadyAdded = existingActivityIds.includes(activity.activityId);
                  
                  return (
                    <div key={activity.activityId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {/* Activity Image */}
                      <div className="relative h-48 bg-gray-200">
                        {!imageErrors.has(activity.activityId) ? (
                          <img
                            src={activity.imageURL}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(activity.activityId)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Popular Badge */}
                        {activity.isPopular && (
                          <div className="absolute top-3 left-3 bg-[#8B5CF6] text-white px-2 py-1 rounded-full text-xs font-medium">
                            Popular
                          </div>
                        )}

                        {/* Cost Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(activity.cost, activity.currency)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Activity Info */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {activity.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {activity.description}
                          </p>
                        </div>

                        {/* Rating and Duration */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {getStarRating(activity.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {activity.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{activity.duration}</span>
                          </div>
                        </div>

                        {/* Add/Remove Button */}
                        <button
                          onClick={() => !isAlreadyAdded && onAddActivity(activity)}
                          disabled={isAlreadyAdded}
                          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                            isAlreadyAdded
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90'
                          }`}
                        >
                          {isAlreadyAdded ? (
                            <>
                              <Minus className="h-4 w-4" />
                              <span>Added to Plan</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              <span>Add to Day Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySearch;