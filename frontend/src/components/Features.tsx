import React from 'react';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Sparkles, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Smart Destination Planning',
      description: 'Get AI-powered recommendations for cities, attractions, and hidden gems based on your preferences and travel style.',
      highlights: ['Personalized suggestions', 'Local insights', 'Optimal routing'],
      color: 'blue'
    },
    {
      icon: DollarSign,
      title: 'Intelligent Budget Tracking',
      description: 'Automatically estimate costs for flights, hotels, food, and activities. Track expenses in real-time and stay on budget.',
      highlights: ['Real-time estimates', 'Expense tracking', 'Budget alerts'],
      color: 'green'
    },
    {
      icon: Calendar,
      title: 'Interactive Timeline Builder',
      description: 'Visualize your entire journey with day-by-day planning, activity scheduling, and timeline optimization.',
      highlights: ['Visual timeline', 'Drag & drop planning', 'Schedule optimization'],
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Collaborative Trip Planning',
      description: 'Share plans with friends and family. Vote on destinations, split costs, and plan together in real-time.',
      highlights: ['Real-time collaboration', 'Voting system', 'Cost splitting'],
      color: 'orange'
    },
    {
      icon: Sparkles,
      title: 'Personalized Experiences',
      description: 'Machine learning algorithms that understand your preferences and suggest experiences tailored just for you.',
      highlights: ['Learning algorithms', 'Custom experiences', 'Smart recommendations'],
      color: 'pink'
    },
    {
      icon: BarChart3,
      title: 'Trip Analytics & Insights',
      description: 'Get detailed insights about your trips, spending patterns, and discover optimization opportunities.',
      highlights: ['Spending analytics', 'Trip insights', 'Optimization tips'],
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-100', icon: 'text-blue-600', hover: 'group-hover:bg-blue-200' },
      green: { bg: 'bg-green-100', icon: 'text-green-600', hover: 'group-hover:bg-green-200' },
      purple: { bg: 'bg-purple-100', icon: 'text-purple-600', hover: 'group-hover:bg-purple-200' },
      orange: { bg: 'bg-orange-100', icon: 'text-orange-600', hover: 'group-hover:bg-orange-200' },
      pink: { bg: 'bg-pink-100', icon: 'text-pink-600', hover: 'group-hover:bg-pink-200' },
      teal: { bg: 'bg-teal-100', icon: 'text-teal-600', hover: 'group-hover:bg-teal-200' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#8B5CF6]/10 text-[#8B5CF6] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need for
            <span className="block text-[#8B5CF6]">Perfect Trip Planning</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intelligent recommendations to collaborative planning, GlobeTrotter provides 
            all the tools you need to create unforgettable travel experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = getColorClasses(feature.color);
            
            return (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#8B5CF6]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`${colorClasses.bg} ${colorClasses.hover} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300`}>
                  <Icon className={`h-8 w-8 ${colorClasses.icon}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#8B5CF6] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-[#8B5CF6] flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-purple-500 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Travel Planning?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered smarter, more enjoyable trip planning.
            </p>
            <button className="group bg-white text-[#8B5CF6] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto">
              <span>Start Your Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;