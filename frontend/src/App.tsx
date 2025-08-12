import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ToastContainer, { useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PopularPlaces from './components/PopularPlaces';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import CreateTrip from './components/CreateTrip';
import EditTrip from './components/EditTrip';
import MyTrips from './components/MyTrips';
import ItineraryBuilder from './components/ItineraryBuilder';
import ItineraryView from './components/ItineraryView';
import BudgetBreakdown from './components/BudgetBreakdown';
import BudgetTracker from './components/BudgetTracker';
import TripCalendar from './components/TripCalendar';
import SharedItinerary from './components/SharedItinerary';
import TripSharePage from './components/TripSharePage';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';

// Toast Provider Component
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Home Page - Public */}
            <Route path="/" element={
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <Navbar />
                <Hero />
                <PopularPlaces />
                <Features />
                <Testimonials />
                <CTA />
                <Footer />
              </div>
            } />
            
            {/* Authentication Routes - Public */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/my-trips" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MyTrips />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/create-trip" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CreateTrip />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/edit-trip/:tripId" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <EditTrip />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/itinerary/:tripId" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ItineraryBuilder />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/itinerary/:tripId/view" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ItineraryView />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/trip/:tripId/share" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <TripSharePage />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/budget" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <BudgetTracker />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/budget/:tripId" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <BudgetBreakdown />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/calendar" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <TripCalendar />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/calendar/:tripId" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <TripCalendar />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <UserProfile />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <>
                  <Navbar />
                  <AdminDashboard />
                  <Footer />
                </>
              </AdminProtectedRoute>
            } />
            
            {/* About and Contact - Public */}
            <Route path="/about" element={
              <>
                <Navbar />
                <AboutUs />
                <Footer />
              </>
            } />
            
            <Route path="/contact" element={
              <>
                <Navbar />
                <ContactUs />
                <Footer />
              </>
            } />
            
            {/* Shared Itinerary - Public (no auth required) - Must come before catch-all */}
            <Route path="/shared/:token" element={
              <>
                <SharedItinerary />
                <Footer />
              </>
            } />
            
            {/* Test route to verify routing works */}
            <Route path="/test-shared" element={
              <div className="min-h-screen bg-gray-100 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold mb-4">Test Shared Route</h1>
                  <p>This is a test route to verify routing is working.</p>
                  <p>Current URL: {window.location.href}</p>
                </div>
              </div>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;