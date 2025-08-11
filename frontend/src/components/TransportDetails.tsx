import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Ship, 
  User, 
  Bike,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { TransportService, type TransportDetails, TransportMode } from '../services/transportService';
import { City } from '../services/itineraryService';

interface TransportDetailsProps {
  tripId: string;
  stops: Array<{ id: string; city_id: string; city?: City }>;
  onTransportAdded?: () => void;
  onTransportUpdated?: () => void;
  onTransportDeleted?: () => void;
}

const TransportDetails: React.FC<TransportDetailsProps> = ({
  tripId,
  stops,
  onTransportAdded,
  onTransportUpdated,
  onTransportDeleted
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [transportDetails, setTransportDetails] = useState<TransportDetails[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [transportCosts, setTransportCosts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [showCostSuggestions, setShowCostSuggestions] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    from_city_id: '',
    to_city_id: '',
    transport_mode: '',
    provider: '',
    departure_time: '',
    arrival_time: '',
    cost: '',
    currency_id: '',
    booking_reference: '',
    notes: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTransportDetails();
    fetchTransportModes();
    fetchTransportCosts();
    fetchCurrencies();
  }, [tripId]);

  const fetchTransportDetails = async () => {
    try {
      setLoading(true);
      const data = await TransportService.getTripTransportDetails(tripId);
      setTransportDetails(data || []);
    } catch (error) {
      showError('Failed to fetch transport details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransportModes = async () => {
    try {
      const modes = await TransportService.getTransportModes();
      setTransportModes(modes);
    } catch (error) {
      console.error('Error fetching transport modes:', error);
    }
  };

  const fetchTransportCosts = async () => {
    try {
      const costs = await TransportService.getAllTransportCosts();
      setTransportCosts(costs || []);
    } catch (error) {
      console.error('Error fetching transport costs:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      console.log('Fetching currencies...');
      const currencies = await TransportService.getAllCurrencies();
      console.log('Currencies fetched:', currencies);
      setCurrencies(currencies || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Set some default currencies as fallback
      setCurrencies([
        { id: 'default-usd', code: 'USD', name: 'US Dollar', symbol: '$' },
        { id: 'default-eur', code: 'EUR', name: 'Euro', symbol: '€' },
        { id: 'default-gbp', code: 'GBP', name: 'British Pound', symbol: '£' }
      ]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.from_city_id) newErrors.from_city_id = 'From city is required';
    if (!formData.to_city_id) newErrors.to_city_id = 'To city is required';
    if (!formData.transport_mode) newErrors.transport_mode = 'Transport mode is required';
    if (!formData.provider) newErrors.provider = 'Provider is required';
    if (!formData.departure_time) newErrors.departure_time = 'Departure time is required';
    if (!formData.arrival_time) newErrors.arrival_time = 'Arrival time is required';
    if (!formData.cost) newErrors.cost = 'Cost is required';
    if (!formData.currency_id) newErrors.currency_id = 'Currency is required';

    // Validate that from and to cities are different
    if (formData.from_city_id === formData.to_city_id) {
      newErrors.to_city_id = 'Destination city must be different from origin city';
    }

    // Validate that arrival time is after departure time
    if (formData.departure_time && formData.arrival_time) {
      const departure = new Date(`2000-01-01T${formData.departure_time}`);
      const arrival = new Date(`2000-01-01T${formData.arrival_time}`);
      if (arrival <= departure) {
        newErrors.arrival_time = 'Arrival time must be after departure time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Ensure we have a valid currency_id - if none selected, use a default
      if (!formData.currency_id) {
        showError('Please select a currency');
        return;
      }
      
      // Convert time inputs to proper timestamps
      // Use today's date as the base date for the time
      const today = new Date();
      const departureDate = new Date(today);
      const arrivalDate = new Date(today);
      
      // Parse time strings and set to today's date
      const [departureHour, departureMinute] = formData.departure_time.split(':').map(Number);
      const [arrivalHour, arrivalMinute] = formData.arrival_time.split(':').map(Number);
      
      departureDate.setHours(departureHour, departureMinute, 0, 0);
      arrivalDate.setHours(arrivalHour, arrivalMinute, 0, 0);
      
      // If arrival time is before departure time, assume it's the next day
      if (arrivalDate <= departureDate) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
      
      const transportData = {
        from_city_id: formData.from_city_id,
        to_city_id: formData.to_city_id,
        transport_mode: formData.transport_mode,
        provider: formData.provider,
        departure_time: departureDate.toISOString(),
        arrival_time: arrivalDate.toISOString(),
        cost: parseFloat(formData.cost) || 0,
        currency_id: formData.currency_id,
        booking_reference: formData.booking_reference || '',
        notes: formData.notes || ''
      };

      console.log('Submitting transport data:', transportData);
      console.log('Trip ID:', tripId);

      if (editingTransport) {
        await TransportService.updateTransportDetails(editingTransport.id, transportData);
        showSuccess('Transport details updated successfully');
        onTransportUpdated?.();
      } else {
        await TransportService.addTransportDetails(tripId, transportData);
        showSuccess('Transport details added successfully');
        onTransportAdded?.();
      }

      resetForm();
      setShowAddModal(false);
      fetchTransportDetails();
    } catch (error) {
      console.error('Error saving transport details:', error);
      showError('Failed to save transport details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transportId: string) => {
    if (!confirm('Are you sure you want to delete this transport detail?')) return;

    try {
      setLoading(true);
      await TransportService.deleteTransportDetails(transportId);
      showSuccess('Transport details deleted successfully');
      onTransportDeleted?.();
      fetchTransportDetails();
    } catch (error) {
      showError('Failed to delete transport details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transport: TransportDetails) => {
    setEditingTransport(transport);
    
    // Convert timestamps back to time format for the form
    const departureTime = new Date(transport.departure_time);
    const arrivalTime = new Date(transport.arrival_time);
    
    setFormData({
      from_city_id: transport.from_city_id,
      to_city_id: transport.to_city_id,
      transport_mode: transport.transport_mode,
      provider: transport.provider,
      departure_time: departureTime.toTimeString().slice(0, 5), // Extract HH:MM
      arrival_time: arrivalTime.toTimeString().slice(0, 5), // Extract HH:MM
      cost: transport.cost.toString(),
      currency_id: transport.currency_id,
      booking_reference: transport.booking_reference || '',
      notes: transport.notes || ''
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      from_city_id: '',
      to_city_id: '',
      transport_mode: '',
      provider: '',
      departure_time: '',
      arrival_time: '',
      cost: '',
      currency_id: '',
      booking_reference: '',
      notes: ''
    });
    setEditingTransport(null);
    setErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const getTransportModeIcon = (mode: string) => {
    switch (mode) {
      case 'plane': return <Plane className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'car': return <Car className="w-4 h-4" />;
      case 'ferry': return <Ship className="w-4 h-4" />;
      case 'walking': return <User className="w-4 h-4" />;
      case 'bicycle': return <Bike className="w-4 h-4" />;
      default: return <Plane className="w-4 h-4" />;
    }
  };

  const getCityName = (cityId: string) => {
    const stop = stops.find(s => s.city_id === cityId);
    return stop?.city?.name || 'Unknown City';
  };

  const formatTime = (time: string) => {
    // If it's already a time string (HH:MM), format it directly
    if (time.includes(':') && time.length === 5) {
      return time;
    }
    
    // If it's a timestamp, extract the time portion
    try {
      const date = new Date(time);
      return date.toTimeString().slice(0, 5);
    } catch (error) {
      return time; // Fallback to original value
    }
  };

  if (loading && transportDetails.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Transport Details</h3>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transport
        </button>
      </div>

      {/* Transport List */}
      {transportDetails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No transport details added yet.</p>
          <p className="text-sm">Click "Add Transport" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transportDetails.map((transport) => (
            <div
              key={transport.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTransportModeIcon(transport.transport_mode)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {getCityName(transport.from_city_id)} → {getCityName(transport.to_city_id)}
                      </h4>
                      <p className="text-sm text-gray-600">{transport.provider}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formatTime(transport.departure_time)} - {formatTime(transport.arrival_time)}</span>
                    </div>
                                         <div className="flex items-center space-x-2">
                       <DollarSign className="w-4 h-4 text-gray-400" />
                       <span>{transport.cost} {transport.currency?.code || transport.currency_id || 'USD'}</span>
                     </div>
                    {transport.booking_reference && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Ref: {transport.booking_reference}</span>
                      </div>
                    )}
                  </div>
                  
                  {transport.notes && (
                    <p className="text-sm text-gray-600 mt-2">{transport.notes}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(transport)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transport.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingTransport ? 'Edit Transport Details' : 'Add Transport Details'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* From City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      From City *
                    </label>
                    <select
                      value={formData.from_city_id}
                      onChange={(e) => setFormData({ ...formData, from_city_id: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.from_city_id ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select departure city</option>
                      {stops.map((stop) => (
                        <option key={stop.city_id} value={stop.city_id}>
                          {stop.city?.name || 'Unknown City'}
                        </option>
                      ))}
                    </select>
                    {errors.from_city_id && (
                      <p className="text-red-500 text-sm">{errors.from_city_id}</p>
                    )}
                  </div>

                  {/* To City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      To City *
                    </label>
                    <select
                      value={formData.to_city_id}
                      onChange={(e) => setFormData({ ...formData, to_city_id: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.to_city_id ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select destination city</option>
                      {stops.map((stop) => (
                        <option key={stop.city_id} value={stop.city_id}>
                          {stop.city?.name || 'Unknown City'}
                        </option>
                      ))}
                    </select>
                    {errors.to_city_id && (
                      <p className="text-red-500 text-sm">{errors.to_city_id}</p>
                    )}
                  </div>

                  {/* Transport Mode */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Transport Mode *
                    </label>
                    <select
                      value={formData.transport_mode}
                      onChange={(e) => setFormData({ ...formData, transport_mode: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.transport_mode ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select transport mode</option>
                      {transportModes.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                          {mode.icon} {mode.name}
                        </option>
                      ))}
                    </select>
                    {errors.transport_mode && (
                      <p className="text-red-500 text-sm">{errors.transport_mode}</p>
                    )}
                  </div>

                  {/* Provider */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Provider *
                    </label>
                    <input
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g., Delta Airlines, Amtrak, Greyhound"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.provider ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.provider && (
                      <p className="text-red-500 text-sm">{errors.provider}</p>
                    )}
                  </div>

                  {/* Departure Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Departure Time *
                    </label>
                    <input
                      type="time"
                      value={formData.departure_time}
                      onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.departure_time ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.departure_time && (
                      <p className="text-red-500 text-sm">{errors.departure_time}</p>
                    )}
                  </div>

                  {/* Arrival Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Arrival Time *
                    </label>
                    <input
                      type="time"
                      value={formData.arrival_time}
                      onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.arrival_time ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.arrival_time && (
                      <p className="text-red-500 text-sm">{errors.arrival_time}</p>
                    )}
                  </div>

                  {/* Cost */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Cost *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.cost ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {formData.from_city_id && formData.to_city_id && formData.transport_mode && (
                        <button
                          type="button"
                          onClick={() => setShowCostSuggestions(!showCostSuggestions)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-lg transition-colors"
                          title="Get cost suggestions"
                        >
                          💡
                        </button>
                      )}
                    </div>
                    {errors.cost && (
                      <p className="text-red-500 text-sm">{errors.cost}</p>
                    )}
                    
                    {/* Cost Suggestions */}
                    {showCostSuggestions && formData.from_city_id && formData.to_city_id && formData.transport_mode && (
                      <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3">Cost Suggestions:</h4>
                        {(() => {
                          const suggestions = transportCosts.filter(cost => 
                            cost.from_city_id === formData.from_city_id &&
                            cost.to_city_id === formData.to_city_id &&
                            cost.mode === formData.transport_mode
                          );
                          
                          if (suggestions.length === 0) {
                            return (
                              <p className="text-sm text-blue-700">
                                No cost data available for this route. You can add reference costs in the admin panel.
                              </p>
                            );
                          }
                          
                          return (
                            <div className="space-y-2">
                              {suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                                  <span className="text-blue-800 font-medium">
                                    {suggestion.provider}: {suggestion.avg_cost} {suggestion.currency?.code || 'USD'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        cost: suggestion.avg_cost.toString(),
                                        provider: suggestion.provider || prev.provider
                                      }));
                                      setShowCostSuggestions(false);
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                                  >
                                    Use
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Currency *
                    </label>
                    <select
                      value={formData.currency_id}
                      onChange={(e) => setFormData({ ...formData, currency_id: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.currency_id ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select currency</option>
                      {currencies.length > 0 ? (
                        currencies.map((currency) => (
                          <option key={currency.id} value={currency.id}>
                            {currency.code} - {currency.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No currencies available</option>
                      )}
                    </select>
                    {errors.currency_id && (
                      <p className="text-red-500 text-sm">{errors.currency_id}</p>
                    )}
                  </div>
                </div>

                {/* Full Width Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Booking Reference */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Booking Reference
                    </label>
                    <input
                      type="text"
                      value={formData.booking_reference}
                      onChange={(e) => setFormData({ ...formData, booking_reference: e.target.value })}
                      placeholder="e.g., DL1234, AMT123, etc."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes about this transport..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      editingTransport ? 'Update Transport' : 'Add Transport'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportDetails;
