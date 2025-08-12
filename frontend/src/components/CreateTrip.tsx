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
  Plane,
  Plus,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { getUserCurrencySymbol } from '../utils/currencyUtils';

interface TripFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  cover_photo_url: string | null;
  cover_photo_file?: File | null; // Store the actual file for preview
  budget: number | ''; // Add budget field
}

interface FormErrors {
  name?: string;
  start_date?: string;
  end_date?: string;
  dateRange?: string;
  budget?: string;
}

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [formData, setFormData] = useState<TripFormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_public: false,
    cover_photo_url: null,
    cover_photo_file: null,
    budget: '' // Initialize budget
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [userCurrencySymbol, setUserCurrencySymbol] = useState<string>('$');

  // Fetch user's currency symbol
  useEffect(() => {
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

    fetchUserCurrency();
  }, [user]);

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInputChange = (field: keyof TripFormData, value: string | boolean | number) => {
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
    if (formData.budget !== '' && formData.budget <= 0) {
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
        cover_photo_url: null, // No storage path yet
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
    // Clean up temporary storage file if it exists
    if (formData.cover_photo_url && formData.cover_photo_url.startsWith('trip/temp/')) {
      try {
        await supabase.storage
          .from('trip')
          .remove([formData.cover_photo_url]);
      } catch (error) {
        console.error('Error removing temporary photo:', error);
      }
    }
    
    // Clear both the file and URL
    setFormData(prev => ({
      ...prev,
      cover_photo_url: null,
      cover_photo_file: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showError('Authentication required', 'Please sign in to create a trip');
      return;
    }

    setIsLoading(true);

    try {
      // Create the trip first
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          name: formData.name,
          description: formData.description,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_public: formData.is_public,
          user_id: user.id,
          cover_photo_url: null, // We'll update this after moving the photo
          budget: formData.budget || null // Add budget to the trip, convert empty string to null
        })
        .select()
        .single();

      if (tripError) {
        console.error('Trip creation error:', tripError);
        throw tripError;
      }

      // If we have a photo file, upload it directly to the permanent location
      if (formData.cover_photo_file) {
        try {
          const fileExt = formData.cover_photo_file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const permanentPath = `trip/${trip.id}/${fileName}`;

          console.log('Uploading photo to permanent location:', permanentPath);

          // Upload the file directly to the permanent location
          const { error: uploadError } = await supabase.storage
            .from('trip')
            .upload(permanentPath, formData.cover_photo_file);

          if (uploadError) {
            console.error('Error uploading photo to permanent location:', uploadError);
            showError('Photo Upload Error', 'Failed to save cover photo');
          } else {
            // Update the trip with the new photo path
            const { error: updateError } = await supabase
              .from('trips')
              .update({ cover_photo_url: permanentPath })
              .eq('id', trip.id);

            if (updateError) {
              console.error('Error updating trip with photo path:', updateError);
            } else {
              console.log('Photo saved successfully to:', permanentPath);
            }
          }
        } catch (error) {
          console.error('Error processing photo upload:', error);
          showError('Photo Error', 'Failed to process cover photo');
        }
      }

      showSuccess('Trip created!', 'Your new trip has been created successfully');
      navigate('/my-trips');
    } catch (error) {
      console.error('Error creating trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create trip';
      showError('Failed to create trip', errorMessage);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-trips')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to My Trips</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Trip</h1>
          <p className="text-gray-600 text-lg">Plan your next adventure with our comprehensive trip builder</p>
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
                  Budget <span className="text-gray-500">(optional)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {userCurrencySymbol}
                  </div>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || '')}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your estimated total trip budget (e.g., 5000 for $5000)
                </p>
                {errors.budget && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.budget}</span>
                  </p>
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
                disabled={isLoading || !formData.name.trim()}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Trip...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Continue</span>
                    <Check className="h-5 w-5" />
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;