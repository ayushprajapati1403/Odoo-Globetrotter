import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Hotel, 
  Calendar,
  MapPin,
  DollarSign,
  X,
  Bed,
  Star
} from 'lucide-react';
import { useToast } from './Toast';
import { AccommodationService, type TripAccommodation, type AccommodationFormData } from '../services/accommodationService';
import { City } from '../services/itineraryService';

interface AccommodationDetailsProps {
  tripId: string;
  stops: Array<{ id: string; city_id: string; city?: City }>;
  onAccommodationAdded?: () => void;
  onAccommodationUpdated?: () => void;
  onAccommodationDeleted?: () => void;
}

const AccommodationDetails: React.FC<AccommodationDetailsProps> = ({
  tripId,
  stops,
  onAccommodationAdded,
  onAccommodationUpdated,
  onAccommodationDeleted
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [accommodations, setAccommodations] = useState<TripAccommodation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<TripAccommodation | null>(null);
  const [loading, setLoading] = useState(false);
  const [cityAccommodations, setCityAccommodations] = useState<Accommodation[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState<AccommodationFormData>({
    accommodation_id: '',
    check_in_date: '',
    check_out_date: '',
    notes: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAccommodations();
  }, [tripId]);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const data = await AccommodationService.getTripAccommodations(tripId);
      setAccommodations(data || []);
    } catch (error) {
      showError('Failed to fetch accommodations');
    } finally {
      setLoading(false);
    }
  };

  const fetchCityAccommodations = async (cityId: string) => {
    try {
      const data = await AccommodationService.getCityAccommodations(cityId);
      setCityAccommodations(data || []);
    } catch (error) {
      console.error('Error fetching city accommodations:', error);
      setCityAccommodations([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.accommodation_id) newErrors.accommodation_id = 'Accommodation is required';
    if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
    if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date is required';

    // Validate that check-out date is after check-in date
    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      if (checkOut <= checkIn) {
        newErrors.check_out_date = 'Check-out date must be after check-in date';
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

      if (editingAccommodation) {
        await AccommodationService.updateTripAccommodation(editingAccommodation.id, formData);
        showSuccess('Accommodation updated successfully');
        onAccommodationUpdated?.();
      } else {
        await AccommodationService.addTripAccommodation(tripId, formData);
        showSuccess('Accommodation added successfully');
        onAccommodationAdded?.();
      }

      resetForm();
      setShowAddModal(false);
      fetchAccommodations();
    } catch (error) {
      console.error('Error saving accommodation:', error);
      showError('Failed to save accommodation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accommodationId: string) => {
    if (!confirm('Are you sure you want to delete this accommodation?')) return;

    try {
      setLoading(true);
      await AccommodationService.deleteTripAccommodation(accommodationId);
      showSuccess('Accommodation deleted successfully');
      onAccommodationDeleted?.();
      fetchAccommodations();
    } catch (error) {
      showError('Failed to delete accommodation');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (accommodation: TripAccommodation) => {
    setEditingAccommodation(accommodation);
    
    setFormData({
      accommodation_id: accommodation.accommodation_id,
      check_in_date: accommodation.check_in_date,
      check_out_date: accommodation.check_out_date,
      notes: accommodation.notes || ''
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      accommodation_id: '',
      check_in_date: '',
      check_out_date: '',
      notes: ''
    });
    setEditingAccommodation(null);
    setSelectedCityId('');
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

  const getCityName = (cityId: string) => {
    const stop = stops.find(s => s.city_id === cityId);
    return stop?.city?.name || 'Unknown City';
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && accommodations.length === 0) {
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
        <h3 className="text-lg font-semibold text-gray-900">Accommodations</h3>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Accommodation
        </button>
      </div>

      {/* Accommodations List */}
      {accommodations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Hotel className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No accommodations added yet.</p>
          <p className="text-sm">Click "Add Accommodation" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {accommodation.accommodation?.name || 'Unknown Accommodation'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {accommodation.accommodation?.provider || 'Provider not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{getCityName(accommodation.accommodation?.city_id || '')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(accommodation.check_in_date)} - {formatDate(accommodation.check_out_date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span>{calculateNights(accommodation.check_in_date, accommodation.check_out_date)} nights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>
                        {accommodation.accommodation?.price_per_night || 0} {accommodation.accommodation?.currency || 'USD'}/night
                      </span>
                    </div>
                  </div>
                  
                  {accommodation.notes && (
                    <p className="text-sm text-gray-600 mt-2">{accommodation.notes}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(accommodation)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(accommodation.id)}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingAccommodation ? 'Edit Accommodation' : 'Add Accommodation'}
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
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      const cityId = e.target.value;
                      setSelectedCityId(cityId);
                      if (cityId) {
                        fetchCityAccommodations(cityId);
                      } else {
                        setCityAccommodations([]);
                      }
                      setFormData(prev => ({ ...prev, accommodation_id: '' }));
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
                  >
                    <option value="">Select a city</option>
                    {stops.map((stop) => (
                      <option key={stop.city_id} value={stop.city_id}>
                        {stop.city?.name || 'Unknown City'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Accommodation Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Accommodation *
                  </label>
                  <select
                    value={formData.accommodation_id}
                    onChange={(e) => setFormData({ ...formData, accommodation_id: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.accommodation_id ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={!selectedCityId || cityAccommodations.length === 0}
                  >
                    <option value="">Select accommodation</option>
                    {cityAccommodations.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - {acc.provider} (${acc.price_per_night}/night)
                      </option>
                    ))}
                  </select>
                  {errors.accommodation_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.accommodation_id}</p>
                  )}
                  {selectedCityId && cityAccommodations.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No accommodations available for this city. Please add accommodations to the database first.
                    </p>
                  )}
                </div>

                {/* Check-in and Check-out Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      value={formData.check_in_date}
                      onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.check_in_date ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.check_in_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.check_in_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      value={formData.check_out_date}
                      onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.check_out_date ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.check_out_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.check_out_date}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add notes about this accommodation..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all resize-none"
                  />
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
                      editingAccommodation ? 'Update Accommodation' : 'Add Accommodation'
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

export default AccommodationDetails;
