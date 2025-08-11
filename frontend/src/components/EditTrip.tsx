import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  X, 
  Check, 
  MapPin, 
  Camera,
  FileText,
  Save,
  DollarSign
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { Trip, canEditTrip } from '../utils/permissions';

interface TripFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  cover_photo_url: string | null;
  cover_photo_file?: File | null; // Store the actual file for preview
  budget: number | null; // Add budget field
}

interface FormErrors {
  name?: string;
  start_date?: string;
  end_date?: string;
  dateRange?: string;
  budget?: string;
}

const EditTrip: React.FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [formData, setFormData] = useState<TripFormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_public: false,
    cover_photo_url: '',
    cover_photo_file: null,
    budget: null // Initialize budget
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalData, setOriginalData] = useState<TripFormData | null>(null);

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  // Fetch trip data on component mount
  useEffect(() => {
    if (tripId && user) {
      fetchTripData();
    }
  }, [tripId, user]);

  const fetchTripData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch trip data
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) {
        console.error('Error fetching trip:', tripError);
        showError('Error', 'Failed to load trip data');
        return;
      }

      // Check if user can edit this trip
      if (!canEditTrip(trip, user)) {
        showError('Access Denied', 'You do not have permission to edit this trip');
        navigate('/my-trips');
        return;
      }

      const tripData: TripFormData = {
        name: trip.name || '',
        description: trip.description || '',
        start_date: trip.start_date || '',
        end_date: trip.end_date || '',
        is_public: trip.is_public || false,
        cover_photo_url: trip.cover_photo_url || '',
        cover_photo_file: null, // No file for existing trips
        budget: trip.budget || null // Fetch budget
      };

      setFormData(tripData);
      setOriginalData(tripData);
      
    } catch (error) {
      console.error('Error fetching trip data:', error);
      showError('Error', 'Failed to load trip data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof TripFormData, value: string | boolean | number | null) => {
    if (field === 'name' && typeof value === 'string') {
      value = capitalizeWords(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Trip name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a trip name.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Trip name must be at least 3 characters.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Trip name must be less than 100 characters.';
    }

    // Date validation
    if (!formData.start_date) {
      newErrors.start_date = 'Please select a start date.';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'Please select an end date.';
    }

    // Date range validation
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        newErrors.dateRange = 'End date must be after start date.';
      }
    }

    // Budget validation
    if (formData.budget !== null && formData.budget <= 0) {
      newErrors.budget = 'Budget must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Invalid file type', 'Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError('File too large', 'Please select an image smaller than 5MB');
        return;
      }

      // Proceed directly to upload - any permission issues will be caught by the upload call

      // Store the file for preview (we'll upload it when saving the trip)
      setFormData(prev => ({
        ...prev,
        cover_photo_url: formData.cover_photo_url, // Keep existing URL if any
        cover_photo_file: file // Store the file for preview
      }));

      showSuccess('Photo uploaded', 'Cover photo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      showError('Upload failed', 'Failed to upload image. Please try again.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  const removeCoverPhoto = async () => {
    if (formData.cover_photo_url && formData.cover_photo_url.startsWith('trip/temp/')) {
      try {
        // Remove the temporary file from storage
        await supabase.storage
          .from('trip')
          .remove([formData.cover_photo_url]);
      } catch (error) {
        console.error('Error removing temporary photo:', error);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      cover_photo_url: '',
      cover_photo_file: null
    }));
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !tripId) {
      showError('Authentication Error', 'Please log in to edit this trip');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      showInfo('No Changes', 'No changes were made to save');
      return;
    }

    setIsSaving(true);

    try {
      showInfo('Saving Changes', 'Updating your trip...');

      // Handle photo upload if there's a new photo file
      let finalCoverPhotoUrl = formData.cover_photo_url;
      
      if (formData.cover_photo_file) {
        try {
          // Delete old photo if it exists
          if (formData.cover_photo_url && !formData.cover_photo_url.startsWith('trip/temp/')) {
            await supabase.storage
              .from('trip')
              .remove([formData.cover_photo_url]);
          }

          const fileExt = formData.cover_photo_file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const permanentPath = `trip/${tripId}/${fileName}`;

          console.log('Uploading new photo to permanent location:', permanentPath);

          // Upload the new file to the permanent location
          const { error: uploadError } = await supabase.storage
            .from('trip')
            .upload(permanentPath, formData.cover_photo_file);

          if (uploadError) {
            console.error('Error uploading new photo:', uploadError);
            showError('Photo Upload Error', 'Failed to save new cover photo');
          } else {
            finalCoverPhotoUrl = permanentPath;
            console.log('New photo saved successfully to:', permanentPath);
          }
        } catch (error) {
          console.error('Error processing new photo upload:', error);
          showError('Photo Error', 'Failed to process new cover photo');
        }
      }

      // Update trip in database
      const { error: updateError } = await supabase
        .from('trips')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          is_public: formData.is_public,
          cover_photo_url: finalCoverPhotoUrl,
          budget: formData.budget || null, // Save budget
          updated_at: new Date().toISOString()
        })
        .eq('id', tripId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Trip update error:', updateError);
        throw updateError;
      }

      showSuccess('Trip Updated!', 'Your trip has been updated successfully');
      
      // Update original data to reflect changes
      setOriginalData(formData);
      
      // Redirect back to my trips page after a short delay
      setTimeout(() => {
        navigate('/my-trips');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update trip';
      showError('Update Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateRange = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const end = new Date(formData.end_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      return `${start} – ${end}`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/my-trips`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Trip</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Trip</h1>
          <p className="text-gray-600 text-lg">Update your trip details and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel - Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Summer Europe Tour 2025"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                  }`}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.name}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.name.length}/100 characters
                </p>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Dates *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.start_date
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                        }`}
                      />
                    </div>
                    {errors.start_date && (
                      <p className="mt-1 text-xs text-red-400">{errors.start_date}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.end_date
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                        }`}
                      />
                    </div>
                    {errors.end_date && (
                      <p className="mt-1 text-xs text-red-400">{errors.end_date}</p>
                    )}
                  </div>
                </div>
                {errors.dateRange && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.dateRange}</span>
                  </p>
                )}
              </div>

              {/* Trip Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Notes <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add notes, destinations, or goals for your trip..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Budget Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (optional)
                </label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || null)}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-400">{errors.budget}</p>
                )}
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Photo
                </label>
                
                <div className="flex items-center space-x-4">
                  {formData.cover_photo_file ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.cover_photo_file)}
                        alt="Cover preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeCoverPhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : formData.cover_photo_url ? (
                    <div className="relative">
                      <img
                        src={`${supabase.storage.from('trip').getPublicUrl(formData.cover_photo_url).data.publicUrl}`}
                        alt="Cover preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeCoverPhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6] file:text-white hover:file:bg-[#7C3AED] transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => handleInputChange('is_public', e.target.checked)}
                  className="h-4 w-4 text-[#8B5CF6] focus:ring-[#8B5CF6] border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="text-sm text-gray-700">
                  Make this trip public (visible to other users)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving || !formData.name.trim() || !hasChanges()}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <span>Save Changes</span>
                    <Save className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Camera className="h-6 w-6 text-[#8B5CF6]" />
                <span>Trip Preview</span>
              </h3>

              {/* Preview Card */}
              <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                  {formData.cover_photo_file ? (
                    <img
                      src={URL.createObjectURL(formData.cover_photo_file)}
                      alt="Trip cover"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.cover_photo_url ? (
                    <img
                      src={`${supabase.storage.from('trip').getPublicUrl(formData.cover_photo_url).data.publicUrl}`}
                      alt="Trip cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Cover photo will appear here</p>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                  
                  {/* Trip Name Overlay */}
                  {formData.name && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                        {formData.name}
                      </h4>
                      {formatDateRange() && (
                        <p className="text-gray-200 text-sm drop-shadow">
                          {formatDateRange()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {!formData.name && !formatDateRange() && (
                    <div className="text-center py-4">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Fill out the form to see preview</p>
                    </div>
                  )}

                  {formData.description && (
                    <div className="mt-4">
                      <h5 className="text-gray-900 font-medium mb-2">Description</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {formData.description}
                      </p>
                    </div>
                  )}

                  {/* Trip Stats */}
                  {(formData.start_date && formData.end_date) && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="text-[#8B5CF6] font-medium">
                          {Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Budget Display */}
                  {formData.budget && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="text-green-600 font-medium flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formData.budget.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/20">
                <h4 className="text-[#8B5CF6] font-medium mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Choose a memorable trip name</li>
                  <li>• Add a beautiful cover photo</li>
                  <li>• Include your travel goals in notes</li>
                  <li>• Set a budget to track expenses</li>
                  <li>• Changes are saved automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrip;
