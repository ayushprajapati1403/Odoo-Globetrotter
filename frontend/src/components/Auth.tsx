import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Plane } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#42eff5]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#42eff5]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#42eff5]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-[#42eff5] to-cyan-400 p-3 rounded-2xl">
              <Plane className="h-8 w-8 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">TravelPro</span>
          </div>
          <p className="text-gray-400">
            {isLogin ? 'Welcome back! Sign in to continue your journey.' : 'Join thousands of travelers planning smarter trips.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex bg-gray-700/50 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'bg-[#42eff5] text-black shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-[#42eff5] text-black shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                {/* Error Message Example */}
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1 opacity-0">
                  <span>⚠️</span>
                  <span>Name is required</span>
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
              {/* Error Message Example */}
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1 opacity-0">
                <span>⚠️</span>
                <span>Please enter a valid email address</span>
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Error Message Example */}
              <p className="mt-2 text-sm text-red-400 flex items-center space-x-1 opacity-0">
                <span>⚠️</span>
                <span>Password must be at least 6 characters</span>
              </p>
            </div>

            {/* Confirm Password Field (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-[#42eff5] focus:ring-[#42eff5]/50 transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Error Message Example */}
                <p className="mt-2 text-sm text-red-400 flex items-center space-x-1 opacity-0">
                  <span>⚠️</span>
                  <span>Passwords do not match</span>
                </p>
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-[#42eff5] hover:text-cyan-400 text-sm font-medium transition-colors duration-300"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-[#42eff5] to-cyan-500 text-black py-4 rounded-xl font-bold text-lg hover:from-[#42eff5]/90 hover:to-cyan-500/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Alternative Action */}
            <div className="text-center">
              <p className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#42eff5] hover:text-cyan-400 font-medium transition-colors duration-300"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-300">
              <span className="text-xl">🔍</span>
              <span className="font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-600/50 hover:text-white transition-all duration-300">
              <span className="text-xl">📘</span>
              <span className="font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#42eff5] hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#42eff5] hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;