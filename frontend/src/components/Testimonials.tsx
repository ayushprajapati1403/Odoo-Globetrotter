import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Digital Nomad',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'GlobeTrotter transformed my travel planning completely. I saved 15 hours planning my European adventure and discovered hidden gems I never would have found otherwise.',
      rating: 5,
      location: '6-city European tour'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Adventure Photographer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The budget tracking feature is incredible. I stayed within budget for the first time ever and the AI recommendations led me to the most photogenic locations.',
      rating: 5,
      location: 'Southeast Asia expedition'
    },
    {
      name: 'Emily Thompson',
      role: 'Family Travel Blogger',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Planning family trips with kids used to be a nightmare. Now my husband and I collaborate seamlessly, and the kids love seeing our travel timeline come to life.',
      rating: 5,
      location: 'Multi-generational Japan trip'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#42eff5]/10 text-[#42eff5] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-current" />
            <span>Loved by Travelers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied travelers who've transformed their trip planning experience with GlobeTrotter.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 hover:bg-gray-50 hover:shadow-xl border border-gray-200 hover:border-[#42eff5]/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-10 w-10 text-[#8B5CF6] mb-6 opacity-60" />
              
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-[#8B5CF6] fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-[#8B5CF6] font-medium">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-8 md:p-12 text-gray-900 border border-gray-300">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Travelers Worldwide
            </h3>
            <p className="text-xl text-gray-600">
              Our platform continues to grow as more people discover smarter travel planning
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-[#8B5CF6] font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-[#8B5CF6] font-medium">Trips Planned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-[#8B5CF6] font-medium">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
              <div className="text-[#8B5CF6] font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;