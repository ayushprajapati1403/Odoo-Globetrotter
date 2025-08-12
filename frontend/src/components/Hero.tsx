import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, MapPin, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const mainDestinations = [
    {
      id: 1,
      country: "MALDIVES",
      description: "Discover pristine white sand beaches, crystal-clear turquoise waters, and luxurious overwater bungalows in this tropical paradise. Experience world-class diving, spa treatments, and unforgettable sunsets.",
      image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      destinations: [
        {
          id: 1,
          name: "Malé",
          image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.8,
          size: "large"
        },
        {
          id: 2,
          name: "Hulhumalé",
          image: "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.7,
          size: "medium"
        },
        {
          id: 3,
          name: "Maafushi",
          image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.9,
          size: "tall"
        },
        {
          id: 4,
          name: "Thulusdhoo",
          image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.6,
          size: "small"
        }
      ]
    },
    {
      id: 2,
      country: "BALI",
      description: "Immerse yourself in the cultural heart of Indonesia with ancient temples, lush rice terraces, and vibrant local traditions. From volcanic mountains to pristine beaches, Bali offers diverse landscapes and spiritual experiences.",
      image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      destinations: [
        {
          id: 5,
          name: "Ubud",
          image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.9,
          size: "large"
        },
        {
          id: 6,
          name: "Seminyak",
          image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.7,
          size: "medium"
        },
        {
          id: 7,
          name: "Canggu",
          image: "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.8,
          size: "tall"
        },
        {
          id: 8,
          name: "Nusa Penida",
          image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.9,
          size: "small"
        }
      ]
    },
    {
      id: 3,
      country: "SANTORINI",
      description: "Experience the magic of Greece's most romantic island with iconic blue-domed churches, dramatic cliff-top villages, and breathtaking sunsets. Explore ancient ruins, volcanic beaches, and world-renowned wineries.",
      image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      destinations: [
        {
          id: 9,
          name: "Oia",
          image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.9,
          size: "large"
        },
        {
          id: 10,
          name: "Fira",
          image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.8,
          size: "medium"
        },
        {
          id: 11,
          name: "Imerovigli",
          image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.7,
          size: "tall"
        },
        {
          id: 12,
          name: "Kamari",
          image: "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
          rating: 4.6,
          size: "small"
        }
      ]
    }
  ];

  const getCardSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-72 h-80';
      case 'medium':
        return 'w-56 h-64';
      case 'tall':
        return 'w-48 h-96';
      case 'small':
        return 'w-40 h-48';
      default:
        return 'w-56 h-64';
    }
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + mainDestinations.length) % mainDestinations.length);
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % mainDestinations.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainDestinations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, mainDestinations.length]);

  const currentDestination = mainDestinations[currentSlide];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0">
        {mainDestinations.map((destination, index) => (
          <div
            key={destination.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center animate-ken-burns"
              style={{
                backgroundImage: `url(${destination.image})`,
                animationDuration: '6000ms'
              }}
            />
          </div>
        ))}
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Left Side Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            <div className="text-white space-y-8">
              <h1 className="text-6xl lg:text-8xl font-bold tracking-wider">
                {currentDestination.country}
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl text-white/90">
                {currentDestination.description}
              </p>
              <button className="group bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-2xl">
                <span>Explore</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right Side Floating Cards */}
            <div className="relative h-full hidden lg:block">
              <div className="absolute inset-0">
                {currentDestination.destinations.map((dest, index) => (
                  <div
                    key={dest.id}
                    className={`absolute rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 group animate-float ${getCardSizeClasses(dest.size)}`}
                    style={{
                      top: index === 0 ? '10%' : index === 1 ? '5%' : index === 2 ? '25%' : '65%',
                      right: index === 0 ? '20%' : index === 1 ? '60%' : index === 2 ? '5%' : '45%',
                      animationDelay: `${index * 0.5}s`
                    }}
                  >
                    <div className="relative h-full">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{dest.name}</h3>
                          <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors cursor-pointer" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(dest.rating) ? 'text-yellow-400 fill-current' : 'text-white/30'
                                }`}
                              />
                            ))}
                            <span className="text-sm ml-1">{dest.rating}</span>
                          </div>
                          <MapPin className="w-4 h-4 text-white/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Vertical Navigation Dots */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
        {mainDestinations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`block w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Prev/Next Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Page Counter */}
            <div className="flex items-center space-x-2 text-white text-lg font-medium">
              <span>0{currentSlide + 1}</span>
              <span className="text-white/50">/</span>
              <span className="text-white/50">0{mainDestinations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-ken-burns {
          animation: ken-burns 6s ease-in-out infinite alternate;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
