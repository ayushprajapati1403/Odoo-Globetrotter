import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <Plane className="h-8 w-8 text-[#42eff5] group-hover:text-[#42eff5]/80 transition-colors duration-300" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-[#42eff5] transition-colors duration-300">
              TravelPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#community" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
              Community
            </a>
            <a href="#enterprise" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
              Enterprise
            </a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium text-sm">
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <a href="#careers" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
              Careers
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
              Pricing
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/signin"
              className="text-gray-300 hover:text-white transition-colors font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="bg-[#42eff5] text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#42eff5]/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50">
              <a href="#community" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                Community
              </a>
              <a href="#enterprise" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                Enterprise
              </a>
              <a href="#resources" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                Resources
              </a>
              <a href="#careers" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                Careers
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium">
                Pricing
              </a>
              <div className="pt-4 space-y-2">
                <Link 
                  to="/signin"
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className="block w-full text-left px-3 py-2 bg-[#42eff5] text-black rounded-lg font-semibold hover:bg-[#42eff5]/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;