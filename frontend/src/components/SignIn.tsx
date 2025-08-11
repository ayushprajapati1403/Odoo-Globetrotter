import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Plane, CheckCircle, X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  
  const { signIn, debugTokens } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = (location.state as any)?.from?.pathname || '/my-trips';

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message || 'Failed to sign in');
        return;
      }

      // Debug tokens after successful sign in
      debugTokens();
      
      // Redirect to intended destination or default
      navigate(from, { replace: true });
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setResetSuccess('Password reset email sent! Please check your inbox.');
      setResetEmail('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setResetSuccess(null), 5000);
      
    } catch (err) {
      console.error('Password reset error:', err);
      setResetError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setResetEmail(email); // Pre-fill with current email if available
    setResetError(null);
    setResetSuccess(null);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError(null);
    setResetSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#42eff5]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-400 p-3 rounded-2xl">
              <Plane className="h-8 w-8 text-black" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TravelPro</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-2xl">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={openForgotPassword}
                className="text-[#8B5CF6] hover:text-purple-400 text-sm font-medium transition-colors duration-300"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-[#8B5CF6] hover:text-purple-400 font-medium transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              disabled={loading}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">🔍</span>
              <span className="font-medium">Google</span>
            </button>
            <button 
              type="button"
              disabled={loading}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">📘</span>
              <span className="font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#8B5CF6] hover:text-purple-400 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#8B5CF6] hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={closeForgotPassword}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Success/Error Messages */}
              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">{resetSuccess}</p>
                </div>
              )}

              {resetError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">{resetError}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                      placeholder="Enter your email"
                      required
                      disabled={resetLoading}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={resetLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading || !resetEmail.trim()}
                    className="flex-1 bg-[#8B5CF6] text-white py-3 px-4 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {resetLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Remember your password?{' '}
                <button
                  onClick={closeForgotPassword}
                  className="text-[#8B5CF6] hover:text-purple-400 font-medium"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;