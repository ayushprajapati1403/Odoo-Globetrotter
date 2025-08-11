import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  MapPin, 
  Star, 
  DollarSign,
  Calendar,
  ChevronDown,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

interface City {
  cityId: string;
  cityName: string;
  country: string;
  region: string;
  costIndex: number; // 1-3 (low to high)
  popularityRating: number; // 1-5
  thumbnailURL: string;
  dailyBudget?: number;
  currency?: string;
}

interface CitySearchProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: City, arrivalDate: string, departureDate: string) => void;
  existingCityIds: string[];
}

interface Filters {
  country: string;
  region: string;
  costRange: [number, number];
  popularityFilter: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ 
  isOpen, 
  onClose, 
  onAddCity, 
  existingCityIds 
}) => {
  // Sample city data - would come from API in real app
  const [cities] = useState<City[]>([
    {
      cityId: "paris-france",
      cityName: "Paris",
      country: "France",
      region: "Europe",
      costIndex: 3,
      popularityRating: 4.8,
      thumbnailURL: "https://images.pexels.com/photos/161815/pexels-photo-161815.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 120,
      currency: "EUR"
    },
    {
      cityId: "rome-italy",
      cityName: "Rome",
      country: "Italy",
      region: "Europe",
      costIndex: 2,
      popularityRating: 4.7,
      thumbnailURL: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 90,
      currency: "EUR"
    },
    {
      cityId: "tokyo-japan",
      cityName: "Tokyo",
      country: "Japan",
      region: "Asia",
      costIndex: 3,
      popularityRating: 4.9,
      thumbnailURL: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 110,
      currency: "JPY"
    },
    {
      cityId: "bali-indonesia",
      cityName: "Bali",
      country: "Indonesia",
      region: "Asia",
      costIndex: 1,
      popularityRating: 4.6,
      thumbnailURL: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 45,
      currency: "USD"
    },
    {
      cityId: "london-uk",
      cityName: "London",
      country: "United Kingdom",
      region: "Europe",
      costIndex: 3,
      popularityRating: 4.5,
      thumbnailURL: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 140,
      currency: "GBP"
    },
    {
      cityId: "barcelona-spain",
      cityName: "Barcelona",
      country: "Spain",
      region: "Europe",
      costIndex: 2,
      popularityRating: 4.6,
      thumbnailURL: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 85,
      currency: "EUR"
    },
    {
      cityId: "new-york-usa",
      cityName: "New York",
      country: "United States",
      region: "North America",
      costIndex: 3,
      popularityRating: 4.7,
      thumbnailURL: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 150,
      currency: "USD"
    },
    {
      cityId: "prague-czech",
      cityName: "Prague",
      country: "Czech Republic",
      region: "Europe",
      costIndex: 1,
      popularityRating: 4.4,
      thumbnailURL: "https://images.pexels.com/photos/1845331/pexels-photo-1845331.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      dailyBudget: 60,
      currency: "EUR"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<Filters>({
    country: '',
    region: '',
    costRange: [1, 3],
    popularityFilter: ''
  });

  // Simulate API search with debounce
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Get unique countries and regions for filters
  const countries = useMemo(() => 
    [...new Set(cities.map(city => city.country))].sort(), [cities]
  );
  
  const regions = useMemo(() => 
    [...new Set(cities.map(city => city.region))].sort(), [cities]
  );

  // Filter and search cities
  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Country filter
      const matchesCountry = filters.country === '' || city.country === filters.country;

      // Region filter
      const matchesRegion = filters.region === '' || city.region === filters.region;

      // Cost range filter
      const matchesCost = city.costIndex >= filters.costRange[0] && 
                         city.costIndex <= filters.costRange[1];

      // Popularity filter
      const matchesPopularity = filters.popularityFilter === '' ||
        (filters.popularityFilter === 'top-rated' && city.popularityRating >= 4.5) ||
        (filters.popularityFilter === 'hidden-gems' && city.popularityRating < 4.5);

      return matchesSearch && matchesCountry && matchesRegion && matchesCost && matchesPopularity;
    });
  }, [cities, searchQuery, filters]);

  const getCostDisplay = (costIndex: number) => {
    return '$'.repeat(costIndex);
  };

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleImageError = (cityId: string) => {
    setImageErrors(prev => new Set([...prev, cityId]));
  };

  const handleAddCity = (city: City) => {
    setSelectedCity(city);
    setShowDatePicker(true);
  };

  const handleConfirmAddCity = () => {
    if (selectedCity && arrivalDate && departureDate) {
      onAddCity(selectedCity, arrivalDate, departureDate);
      setShowDatePicker(false);
      setSelectedCity(null);
      setArrivalDate('');
      setDepartureDate('');
      onClose();
    }
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      region: '',
      costRange: [1, 3],
      popularityFilter: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Add Destination</h2>
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
              placeholder="Search cities by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 animate-spin" />
            )}
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
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
                  {/* Country Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={filters.country}
                      onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <select
                      value={filters.region}
                      onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                    >
                      <option value="">All Regions</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        value={filters.costRange[1]}
                        onChange={(e) => setFilters({ 
                          ...filters, 
                          costRange: [1, parseInt(e.target.value)] 
                        })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>$ Budget</span>
                        <span>$$$ Luxury</span>
                      </div>
                      <div className="text-center text-sm text-gray-700">
                        Up to {getCostDisplay(filters.costRange[1])}
                      </div>
                    </div>
                  </div>

                  {/* Popularity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Popularity
                    </label>
                    <select
                      value={filters.popularityFilter}
                      onChange={(e) => setFilters({ ...filters, popularityFilter: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                    >
                      <option value="">All Destinations</option>
                      <option value="top-rated">Top Rated (4.5+ ⭐)</option>
                      <option value="hidden-gems">Hidden Gems (&lt;4.5 ⭐)</option>
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
            {filteredCities.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities found</h3>
                <p className="text-gray-600">Try changing your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => {
                  const isAlreadyAdded = existingCityIds.includes(city.cityId);
                  
                  return (
                    <div key={city.cityId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      {/* City Image */}
                      <div className="relative h-48 bg-gray-200">
                        {!imageErrors.has(city.cityId) ? (
                          <img
                            src={city.thumbnailURL}
                            alt={city.cityName}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(city.cityId)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Cost Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {getCostDisplay(city.costIndex)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* City Info */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {city.cityName}
                          </h3>
                          <p className="text-gray-600 text-sm">{city.country}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex space-x-1">
                            {getStarRating(city.popularityRating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {city.popularityRating}
                          </span>
                        </div>

                        {/* Daily Budget */}
                        {city.dailyBudget && (
                          <div className="text-sm text-gray-600 mb-4">
                            ~{city.currency === 'JPY' ? '¥' : city.currency === 'GBP' ? '£' : city.currency === 'EUR' ? '€' : '$'}{city.dailyBudget}/day
                          </div>
                        )}

                        {/* Add Button */}
                        <button
                          onClick={() => handleAddCity(city)}
                          disabled={isAlreadyAdded}
                          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                            isAlreadyAdded
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90'
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                          <span>{isAlreadyAdded ? 'Already Added' : 'Add to Trip'}</span>
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

      {/* Date Picker Modal */}
      {showDatePicker && selectedCity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add {selectedCity.cityName} to Trip
              </h3>
              <p className="text-gray-600">Select your arrival and departure dates</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrival Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={arrivalDate}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowDatePicker(false);
                    setSelectedCity(null);
                    setArrivalDate('');
                    setDepartureDate('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAddCity}
                  disabled={!arrivalDate || !departureDate}
                  className="flex-1 bg-[#8B5CF6] text-white py-3 px-4 rounded-xl hover:bg-[#8B5CF6]/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySearch;