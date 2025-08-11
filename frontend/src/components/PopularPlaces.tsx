import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, Users, Camera } from 'lucide-react';

const PopularPlaces: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const popularPlaces = [
    {
      id: 1,
      name: "Santorini",
      country: "Greece",
      image: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.9,
      visitors: "2.1M",
      description: "Stunning sunsets and white-washed buildings",
      highlights: ["Sunset Views", "Blue Domes", "Wine Tasting"]
    },
    {
      id: 2,
      name: "Kyoto",
      country: "Japan",
      image: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.8,
      visitors: "1.8M",
      description: "Ancient temples and cherry blossoms",
      highlights: ["Bamboo Forest", "Golden Temple", "Geisha District"]
    },
    {
      id: 3,
      name: "Bali",
      country: "Indonesia",
      image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.7,
      visitors: "3.2M",
      description: "Tropical paradise with rich culture",
      highlights: ["Rice Terraces", "Beach Clubs", "Hindu Temples"]
    },
    {
      id: 4,
      name: "Iceland",
      country: "Nordic",
      image: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.9,
      visitors: "900K",
      description: "Northern lights and dramatic landscapes",
      highlights: ["Northern Lights", "Blue Lagoon", "Waterfalls"]
    },
    {
      id: 5,
      name: "Machu Picchu",
      country: "Peru",
      image: "https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.8,
      visitors: "1.5M",
      description: "Ancient Incan citadel in the clouds",
      highlights: ["Inca Trail", "Sacred Valley", "Llama Spotting"]
    },
    {
      id: 6,
      name: "Dubai",
      country: "UAE",
      image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      rating: 4.6,
      visitors: "4.1M",
      description: "Futuristic city with luxury experiences",
      highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk"]
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularPlaces.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, popularPlaces.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % popularPlaces.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + popularPlaces.length) % popularPlaces.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Get visible slides (current + 2 next)
  const getVisibleSlides = () => {
    const slides = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % popularPlaces.length;
      slides.push({ ...popularPlaces[index], slideIndex: i });
    }
    return slides;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#42eff5]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#8B5CF6]/10 text-[#8B5CF6] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Camera className="h-4 w-4" />
            <span>Trending Destinations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Popular Places to
            <span className="block bg-gradient-to-r from-[#8B5CF6] to-purple-400 bg-clip-text text-transparent">
              Explore This Year
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world's most beloved destinations, handpicked by millions of travelers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative h-[500px] mb-8">
            <div className="flex items-center justify-center h-full space-x-6">
              {getVisibleSlides().map((place, index) => {
                const isCenter = index === 0;
                const scale = isCenter ? 'scale-100' : 'scale-90';
                const opacity = isCenter ? 'opacity-100' : 'opacity-60';
                const zIndex = isCenter ? 'z-20' : 'z-10';
                
                return (
                  <div
                    key={`${place.id}-${place.slideIndex}`}
                    className={`relative transition-all duration-700 ease-in-out transform ${scale} ${opacity} ${zIndex} cursor-pointer`}
                    onClick={() => !isCenter && goToSlide((currentSlide + index) % popularPlaces.length)}
                  >
                    <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl group">
                      {/* Image */}
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                            <span className="text-[#8B5CF6] text-sm font-medium">{place.country}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-medium">{place.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">{place.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{place.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-gray-400 text-xs">
                            <Users className="h-3 w-3" />
                            <span>{place.visitors} visitors</span>
                          </div>
                          
                          {isCenter && (
                            <button className="bg-[#8B5CF6] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#8B5CF6]/90 transition-colors">
                              Explore
                            </button>
                          )}
                        </div>
                        
                        {/* Highlights */}
                        {isCenter && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {place.highlights.map((highlight, idx) => (
                              <span
                                key={idx}
                                className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white transition-colors z-30 group shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 group-hover:text-[#8B5CF6] transition-colors" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full hover:bg-white transition-colors z-30 group shadow-lg"
          >
            <ChevronRight className="h-6 w-6 group-hover:text-[#8B5CF6] transition-colors" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3">
            {popularPlaces.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-[#8B5CF6] scale-125' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#8B5CF6] mb-2">150+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#8B5CF6] mb-2">2.5M+</div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#8B5CF6] mb-2">50K+</div>
            <div className="text-gray-600">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#8B5CF6] mb-2">4.9★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularPlaces;