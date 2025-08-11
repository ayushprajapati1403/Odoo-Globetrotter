import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const destinations = [
    {
      id: 1,
      name: "Buddha temple, Thailand",
      image: "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.8,
      position: { top: '10%', right: '25%' },
      size: 'large'
    },
    {
      id: 2,
      name: "Broken Beach, Bali",
      image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=350&h=250&fit=crop",
      rating: 4.9,
      position: { top: '15%', right: '5%' },
      size: 'medium'
    },
    {
      id: 3,
      name: "Kerala",
      image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
      rating: 4.7,
      position: { top: '35%', right: '2%' },
      size: 'tall'
    },
    {
      id: 4,
      name: "Santorini, Greece",
      image: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=280&h=200&fit=crop",
      rating: 4.9,
      position: { bottom: '25%', right: '15%' },
      size: 'small'
    }
  ];

  const mainDestinations = [
    {
      name: "INDONESIA",
      description: "As the largest archipelagic country in the world, Indonesia is blessed with so many different people, cultures, customs, traditions, artworks, food, animals, plants, landscapes, and everything that made it almost like 100 (or even 200) countries melted beautifully into one.",
      image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
    },
    {
      name: "THAILAND",
      description: "Land of smiles with ancient temples, pristine beaches, vibrant street markets, and rich cultural heritage that captivates every traveler's heart with its unique blend of tradition and modernity.",
      image: "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
    },
    {
      name: "GREECE",
      description: "Cradle of civilization with stunning islands, crystal-clear waters, ancient ruins, and Mediterranean charm that creates unforgettable memories with every sunset and every ancient stone.",
      image: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainDestinations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getCardSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-80 h-60';
      case 'medium':
        return 'w-64 h-48';
      case 'tall':
        return 'w-48 h-72';
      case 'small':
        return 'w-56 h-40';
      default:
        return 'w-64 h-48';
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mainDestinations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mainDestinations.length) % mainDestinations.length);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {mainDestinations.map((destination, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 pt-20">
              {/* Country Name */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-wider">
                  {mainDestinations[currentSlide].name}
                </h1>
                
                {/* Description */}
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                  {mainDestinations[currentSlide].description}
                </p>

                {/* CTA Button */}
                <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-2xl">
                  <span>Explore</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Side - Floating Destination Cards */}
            <div className="relative h-96 lg:h-screen">
              {destinations.map((destination, index) => (
                <div
                  key={destination.id}
                  className={`absolute ${getCardSize(destination.size)} animate-float`}
                  style={{
                    ...destination.position,
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  <div className="relative w-full h-full group cursor-pointer">
                    {/* Card Image */}
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Card Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl"></div>
                    
                    {/* Card Content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-sm">
                          {destination.name}
                        </h3>
                        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                          <Heart className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">
                          {destination.rating}
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <MapPin className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>

                    {/* Rating Dots */}
                    <div className="absolute top-4 left-4 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(destination.rating) ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Left Side Navigation */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-6 z-20">
        <div className="w-px h-16 bg-white/30"></div>
        <div className="flex flex-col space-y-4">
          {mainDestinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <div className="w-px h-16 bg-white/30"></div>
        <div className="text-white text-sm font-medium transform -rotate-90 origin-center whitespace-nowrap">
          01/04
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-20">
        <button
          onClick={prevSlide}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-white text-sm font-medium">
          0{currentSlide + 1} / 0{mainDestinations.length}
        </div>
        
        <button
          onClick={nextSlide}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom Right Page Counter */}
      <div className="absolute bottom-8 right-8 text-white text-sm font-medium z-20">
        <div className="flex space-x-4">
          <span>01</span>
          <span className="text-white/50">03</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;