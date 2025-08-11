import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, ChevronDown, User, Settings, BarChart3, LogOut, Bug } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTripsOpen, setIsTripsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, debugTokens } = useAuth();

  const navItems = [
    { 
      name: 'My Trips', 
      href: '/my-trips',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Trips', href: '/my-trips' },
        { name: 'Create New Trip', href: '/create-trip' }
      ]
    },
    {
      name: 'Tools',
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Trip Calendar', href: '/calendar/uuid-1234' },
        { name: 'Budget Tracker', href: '/budget/uuid-1234' }
      ]
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleDebugTokens = () => {
    debugTokens();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Plane className="h-8 w-8 text-[#8B5CF6] group-hover:text-[#8B5CF6]/80 transition-colors duration-300" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#42eff5] transition-colors duration-300">
              TravelPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => {
                        if (item.name === 'My Trips') {
                          setIsTripsOpen(!isTripsOpen);
                          setIsToolsOpen(false);
                        } else if (item.name === 'Tools') {
                          setIsToolsOpen(!isToolsOpen);
                          setIsTripsOpen(false);
                        }
                      }}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(item.href) || 
                        (item.name === 'My Trips' && isTripsOpen) ||
                        (item.name === 'Tools' && isToolsOpen)
                          ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                        ((item.name === 'My Trips' && isTripsOpen) || 
                         (item.name === 'Tools' && isToolsOpen)) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {((item.name === 'My Trips' && isTripsOpen) || 
                      (item.name === 'Tools' && isToolsOpen)) && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => {
                              setIsTripsOpen(false);
                              setIsToolsOpen(false);
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/about')
                  ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/contact')
                  ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              // User is authenticated
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleDebugTokens}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Bug className="h-4 w-4" />
                      <span>Debug Tokens</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not authenticated
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-lg hover:bg-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-[#8B5CF6] text-white rounded-lg font-semibold text-sm hover:bg-[#8B5CF6]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => {
                          if (item.name === 'My Trips') {
                            setIsTripsOpen(!isTripsOpen);
                            setIsToolsOpen(false);
                          } else if (item.name === 'Tools') {
                            setIsToolsOpen(!isToolsOpen);
                            setIsTripsOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActive(item.href) || 
                          (item.name === 'My Trips' && isTripsOpen) ||
                          (item.name === 'Tools' && isToolsOpen)
                            ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                          ((item.name === 'My Trips' && isTripsOpen) || 
                           (item.name === 'Tools' && isToolsOpen)) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {((item.name === 'My Trips' && isTripsOpen) || 
                        (item.name === 'Tools' && isToolsOpen)) && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsTripsOpen(false);
                                setIsToolsOpen(false);
                              }}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* About and Contact Links */}
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <Link
                to="/contact"
                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-[#8B5CF6] bg-[#8B5CF6]/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
                {user ? (
                  // User is authenticated
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      <span className="font-medium">Signed in as:</span>
                      <div className="text-gray-800 truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleDebugTokens();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                      <Bug className="h-4 w-4" />
                      <span>Debug Tokens</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  // User is not authenticated
                  <>
                    <Link
                      to="/signin"
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-left px-3 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-black rounded-lg font-semibold hover:from-emerald-300 hover:to-teal-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdowns */}
      {(isTripsOpen || isToolsOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsTripsOpen(false);
            setIsToolsOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;