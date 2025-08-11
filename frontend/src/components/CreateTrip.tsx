import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  X, 
  Check, 
  MapPin, 
  Camera,
  FileText,
  Plane
} from 'lucide-react';

interface TripFormData {
  tripName: string;
  startDate: string;
  endDate: string;
  description: string;
  coverPhoto: File | null;
  coverPhotoURL: string;
}

interface FormErrors {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
}

const CreateTrip: React.FC = () => {
  const [formData, setFormData] = useState<TripFormData>({
    tripName: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: null,
    coverPhotoURL: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInputChange = (field: keyof TripFormData, value: string) => {
    if (field === 'tripName') {
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
    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Please enter a trip name.';
    } else if (formData.tripName.trim().length < 3) {
      newErrors.tripName = 'Trip name must be at least 3 characters.';
    } else if (formData.tripName.trim().length > 100) {
      newErrors.tripName = 'Trip name must be less than 100 characters.';
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date.';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date.';
    }

    // Date range validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.dateRange = 'End date must be after start date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    // Create preview URL
    const previewURL = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      coverPhoto: file,
      coverPhotoURL: previewURL
    }));
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeCoverPhoto = () => {
    if (formData.coverPhotoURL) {
      URL.revokeObjectURL(formData.coverPhotoURL);
    }
    setFormData(prev => ({
      ...prev,
      coverPhoto: null,
      coverPhotoURL: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Upload cover photo to cloud storage
      // 2. Create trip entry in database
      // 3. Redirect to itinerary builder
      
      console.log('Trip created:', formData);
      alert('Trip created successfully!');
      
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Error creating trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateRange = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const end = new Date(formData.endDate).toLocaleDateString('en-US', {
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
                  value={formData.tripName}
                  onChange={(e) => handleInputChange('tripName', e.target.value)}
                  placeholder="Summer Europe Tour 2025"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.tripName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                  }`}
                  maxLength={100}
                />
                {errors.tripName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.tripName}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.tripName.length}/100 characters
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
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.startDate
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-xs text-red-400">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.endDate
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-300 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50'
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-xs text-red-400">{errors.endDate}</p>
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300 resize-none"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Photo <span className="text-gray-500">(optional)</span>
                </label>
                
                {!formData.coverPhotoURL ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-[#42eff5] bg-[#42eff5]/10' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-700 mb-2">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-gray-500">JPG, PNG, WEBP up to 5MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={formData.coverPhotoURL}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeCoverPhoto}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
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
                  {formData.coverPhotoURL ? (
                    <img
                      src={formData.coverPhotoURL}
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
                  {formData.tripName && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                        {formData.tripName}
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
                  {!formData.tripName && !formatDateRange() && (
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
                  {(formData.startDate && formData.endDate) && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="text-[#8B5CF6] font-medium">
                          {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
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