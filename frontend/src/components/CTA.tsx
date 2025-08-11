import React from 'react';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#8B5CF6] via-purple-500 to-purple-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white font-medium">Limited Time Offer</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Start Your Adventure Today
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of travelers who've discovered smarter, more enjoyable trip planning. 
            Get started free and transform the way you explore the world.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
              <span className="font-medium">Free forever plan</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
              <span className="font-medium">Setup in 2 minutes</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group bg-white text-[#8B5CF6] px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3">
              <span>Get Started Free</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="text-white hover:text-gray-200 transition-colors duration-300 text-lg font-medium underline underline-offset-4">
              Talk to our team →
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">Trusted by travelers from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-white font-semibold">🇺🇸 United States</div>
              <div className="text-white font-semibold">🇬🇧 United Kingdom</div>
              <div className="text-white font-semibold">🇨🇦 Canada</div>
              <div className="text-white font-semibold">🇦🇺 Australia</div>
              <div className="text-white font-semibold">🇩🇪 Germany</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;