import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, MapPin, Edit, Save, X, Camera, Eye, EyeOff, Lock, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface City {
  id: string;
  name: string;
  country: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  home_city_id: string | null;
  preferences: any;
  photo: string | null;
  created_at: string;
  updated_at: string;
}

const UserProfile: React.FC = () => {
  const { user, debugTokens } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    homeCity: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile and related data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Verify storage bucket exists and is accessible
        try {
          const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('profile');
          if (bucketError) {
            console.warn('Storage bucket check failed:', bucketError);
          } else {
            console.log('Storage bucket accessible:', bucketData);
          }
        } catch (bucketErr) {
          console.warn('Could not check storage bucket:', bucketErr);
        }
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to load profile');
          return;
        }

        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          homeCity: profileData.home_city_id || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Fetch cities
        const { data: citiesData } = await supabase
          .from('cities')
          .select('id, name, country')
          .order('popularity_score', { ascending: false })
          .limit(50);

        if (citiesData) setCities(citiesData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const testImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error testing image URL:', error);
      return false;
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    try {
      setUploadingPhoto(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Generate unique filename with proper folder structure for RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`; // User ID as folder name

      console.log('Uploading photo:', filePath);
      console.log('User ID:', user.id);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile')
        .getPublicUrl(filePath);

      const photoUrl = urlData.publicUrl;
      console.log('Photo URL:', photoUrl);
      console.log('File path:', filePath);
      console.log('Storage bucket:', 'profile');

      // Wait a moment for the file to be accessible, then test
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test if the URL is accessible
      let urlAccessible = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(photoUrl);
          console.log(`Photo URL accessibility test (attempt ${attempt}):`, response.status, response.ok);
          if (response.ok) {
            urlAccessible = true;
            break;
          }
        } catch (fetchError) {
          console.warn(`Could not test photo URL accessibility (attempt ${attempt}):`, fetchError);
        }
        
        if (attempt < 3) {
          console.log(`Waiting before retry ${attempt + 1}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!urlAccessible) {
        console.warn('Photo URL might not be accessible yet, but proceeding with update');
      }

      // Test the image URL specifically
      const imageAccessible = await testImageUrl(photoUrl);
      console.log('Image URL accessible:', imageAccessible);

      // Delete old photo if exists
      if (profile?.photo) {
        try {
          // Extract the file path from the old photo URL
          const oldPhotoUrl = new URL(profile.photo);
          const oldPhotoPath = oldPhotoUrl.pathname.split('/profile/')[1];
          
          if (oldPhotoPath) {
            await supabase.storage
              .from('profile')
              .remove([oldPhotoPath]);
            console.log('Old photo deleted:', oldPhotoPath);
          }
        } catch (deleteError) {
          console.warn('Failed to delete old photo:', deleteError);
        }
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo: photoUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, photo: photoUrl } : null);
      setSuccess('Profile photo updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Photo upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!user || !profile?.photo) return;

    try {
      setUploadingPhoto(true);
      setError(null);

      // Delete from storage - extract the file path from the URL
      const photoUrl = new URL(profile.photo);
      const photoPath = photoUrl.pathname.split('/profile/')[1];
      
      if (photoPath) {
        const { error: deleteError } = await supabase.storage
          .from('profile')
          .remove([photoPath]);

        if (deleteError) {
          console.warn('Failed to delete photo from storage:', deleteError);
        } else {
          console.log('Photo deleted from storage:', photoPath);
        }
      }

      // Update database
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo: null })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, photo: null } : null);
      setSuccess('Profile photo removed successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error('Photo delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handlePhotoUpload(file);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      setError(null);

      // First verify the user still exists in auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.error('Auth user check failed:', authError);
        throw new Error('Authentication session expired. Please sign in again.');
      }

      console.log('Auth user verified:', authUser.id);

      const updates: any = {
        name: formData.name.trim() || null,
        home_city_id: formData.homeCity || null
      };

      // Update user profile in database
      console.log('Updating database with:', updates);
      console.log('User ID:', user.id);
      console.log('Profile data:', profile);
      
      let dbData;
      let updateError;
      
      // First try to update, if it fails, try to insert
      const updateResult = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (updateResult.error) {
        console.log('Update failed, trying to insert new profile...');
        
        // Try to insert a new profile
        const insertResult = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: updates.name,
            home_city_id: updates.home_city_id,
            active: true
          })
          .select()
          .single();
        
        dbData = insertResult.data;
        updateError = insertResult.error;
    } else {
        dbData = updateResult.data;
        updateError = null;
      }

      if (updateError) {
        console.error('Database update error:', updateError);
        console.error('Error details:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        });
        throw updateError;
      }

      console.log('Database updated successfully:', dbData);

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        ...updates
      } : null);

      setEditing(false);
      setSuccess('Profile updated successfully!');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
        return;
      }
      
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
        return;
      }
      
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
      
    try {
      setSaving(true);
      setError(null);

      console.log('Updating password for user:', user.id);

      // First verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: profile?.email || user.email || '',
        password: formData.currentPassword
      });

      if (verifyError) {
        console.error('Current password verification failed:', verifyError);
        throw new Error('Current password is incorrect');
      }

      console.log('Current password verified successfully');

      // Update password in Supabase Auth
      const { data: authData, error: passwordError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (passwordError) {
        console.error('Password update error:', passwordError);
        throw new Error(`Password update failed: ${passwordError.message}`);
      }

      console.log('Password updated successfully in auth:', authData);

      setSuccess('Password updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      // Show additional info about the update
      console.log('Password change completed successfully for user:', user.id);

    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || '',
      homeCity: profile?.home_city_id || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(null);
  };

  const selectedCity = cities.find(c => c.id === formData.homeCity);

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile information.</p>
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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">User Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-2xl">
        {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[#8B5CF6] to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.photo ? (
                    <>
                    <img
                        src={profile.photo} 
                      alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                        onLoad={() => {
                          console.log('Profile image loaded successfully:', profile.photo);
                          // Hide the fallback avatar when image loads
                          const fallback = document.querySelector('.profile-fallback') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'none';
                          }
                        }}
                        onError={(e) => {
                          console.error('Failed to load profile image:', profile.photo);
                          console.error('Image error details:', e);
                          // Fallback to default avatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                            fallback.style.display = 'flex';
                          }
                        }}
                        crossOrigin="anonymous"
                      />
                      <User className="h-10 w-10 text-white hidden profile-fallback" />
                    </>
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                
                {/* Camera button for upload */}
                  <button
                  onClick={openFileDialog}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                  title="Upload photo"
                >
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Camera className="h-4 w-4 text-gray-600" />
                  )}
                  </button>

                {/* Delete photo button (only show if photo exists) */}
                {profile.photo && (
                      <button
                    onClick={handlePhotoDelete}
                    disabled={uploadingPhoto}
                    className="absolute top-0 right-0 bg-red-500 p-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                    title="Remove photo"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                      </button>
                    )}
                  </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'No Name Set'}</h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#8B5CF6] text-white px-6 py-2 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
          </div>
        </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Photo Upload Section */}
          <div 
            className="mb-8 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-700 mb-1">Profile Photo</h3>
              <p className="text-xs text-gray-500 mb-3">
                Click here or drag and drop an image to upload
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <span>• Max size: 5MB</span>
                <span>• Supported: JPG, PNG, GIF</span>
            </div>
          </div>
        </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
            </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                    <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name || 'Not set'}</p>
                )}
                    </div>

                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                  </label>
                <p className="text-gray-900">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Preferences
            </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home City
                </label>
                {editing ? (
            <select
                    value={formData.homeCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, homeCity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
            </select>
                ) : (
                  <p className="text-gray-900">
                    {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Not set'}
                  </p>
          )}
        </div>
              </div>
                    </div>
                    
          {/* Password Change Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                      </label>
                <div className="relative">
                        <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="Current password"
                        />
                        <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                      </label>
                <div className="relative">
                        <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="New password"
                        />
                        <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                      </div>
                    </div>

            <div className="mt-4">
                <button
                onClick={handlePasswordChange}
                disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>{saving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </div>

          {/* Account Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                <span className="text-gray-500">Member since:</span>
                <p className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                </div>
                <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="text-gray-900">
                  {new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                </div>
            </div>
                </div>

          {/* Debug Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Developer Tools</h3>
                  <button
              onClick={debugTokens}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
              Debug Authentication Tokens
                  </button>
            <p className="text-xs text-gray-500 mt-2">
              Check the browser console for token information
            </p>
                </div>
              </div>
      </div>
    </div>
  );
};

export default UserProfile;