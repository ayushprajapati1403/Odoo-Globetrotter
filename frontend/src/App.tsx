import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PopularPlaces from './components/PopularPlaces';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CreateTrip from './components/CreateTrip';
import MyTrips from './components/MyTrips';
import ItineraryBuilder from './components/ItineraryBuilder';
import ItineraryView from './components/ItineraryView';
import BudgetBreakdown from './components/BudgetBreakdown';
import TripCalendar from './components/TripCalendar';
import SharedItinerary from './components/SharedItinerary';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';

function App() {
  return (
    <AuthProvider>
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
          
          <Route path="/budget/:tripId" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <BudgetBreakdown tripId="uuid-1234" tripName="Summer Europe Tour 2025" />
                <Footer />
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar/:tripId" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <TripCalendar tripId="uuid-1234" tripName="Summer Europe Tour 2025" />
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
            <ProtectedRoute>
              <>
                <Navbar />
                <AdminDashboard />
                <Footer />
              </>
            </ProtectedRoute>
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
          
          {/* Shared Itinerary - Public (no auth required) */}
          <Route path="/trips/:publicId" element={
            <>
              <SharedItinerary publicId="abc123" />
              <Footer />
            </>
          } />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;