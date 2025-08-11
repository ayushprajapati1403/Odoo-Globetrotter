import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  CheckCircle,
  ArrowRight,
  Plane
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Former travel blogger with 10+ years of experience exploring 50+ countries."
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Tech entrepreneur passionate about using AI to enhance travel experiences."
    },
    {
      name: "Emily Thompson",
      role: "Head of Product",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "UX designer who believes great travel starts with great planning tools."
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Full-stack developer with expertise in scalable travel technology platforms."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "We believe travel enriches lives and creates lasting memories. Every feature we build is designed to enhance your journey."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform thrives on shared experiences. We connect travelers and help them learn from each other's adventures."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage cutting-edge technology to make trip planning smarter, faster, and more enjoyable than ever before."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "From local hidden gems to world-famous landmarks, we help you discover the full spectrum of travel experiences."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a simple idea: make travel planning effortless and enjoyable."
    },
    {
      year: "2024",
      title: "10K+ Users",
      description: "Reached our first major milestone with travelers from over 50 countries."
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched intelligent recommendations powered by machine learning."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanding to support 20+ languages and local currencies worldwide."
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Smart Destination Planning",
      description: "AI-powered recommendations based on your preferences and travel style."
    },
    {
      icon: Calendar,
      title: "Interactive Timeline Builder",
      description: "Visualize your entire journey with day-by-day planning and optimization."
    },
    {
      icon: DollarSign,
      title: "Intelligent Budget Tracking",
      description: "Real-time expense tracking with smart insights to keep you on budget."
    },
    {
      icon: Share2,
      title: "Collaborative Planning",
      description: "Plan together with friends and family in real-time, anywhere in the world."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#8B5CF6]/10 text-[#8B5CF6] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Plane className="h-4 w-4" />
            <span>About TravelPro</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforming How the World
            <span className="block bg-gradient-to-r from-[#8B5CF6] to-purple-400 bg-clip-text text-transparent">
              Plans Travel
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to make travel planning effortless, collaborative, and inspiring. 
            Join millions of travelers who've discovered smarter ways to explore the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B5CF6] mb-2">2M+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B5CF6] mb-2">150+</div>
              <div className="text-gray-600">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8B5CF6] mb-2">500K+</div>
              <div className="text-gray-600">Trips Planned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TravelPro was born from a simple frustration: planning amazing trips shouldn't be overwhelming. 
                  Our founders, avid travelers themselves, spent countless hours juggling spreadsheets, bookmarks, 
                  and scattered notes while planning their adventures.
                </p>
                <p>
                  We realized there had to be a better way. A platform that could bring together all the tools 
                  travelers need - from discovering destinations to managing budgets, from building itineraries 
                  to collaborating with travel companions.
                </p>
                <p>
                  Today, TravelPro serves millions of travelers worldwide, helping them transform their travel 
                  dreams into perfectly planned adventures. We're just getting started.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Travel planning"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#8B5CF6] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-90">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and shape the experience we create for travelers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="bg-[#8B5CF6]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most comprehensive travel planning platform with features that actually make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a global platform trusted by millions of travelers.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#8B5CF6]/30 hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-16 h-16 bg-[#8B5CF6] rounded-full items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex-1">
                    <div className="md:hidden text-[#8B5CF6] font-bold text-sm mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate travelers and technologists working together to revolutionize trip planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 group-hover:border-[#8B5CF6] transition-colors"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-[#8B5CF6] font-medium text-sm mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#8B5CF6] to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of travelers who've discovered smarter, more enjoyable trip planning with TravelPro.
          </p>
          <button className="bg-white text-[#8B5CF6] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl flex items-center space-x-2 mx-auto">
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;