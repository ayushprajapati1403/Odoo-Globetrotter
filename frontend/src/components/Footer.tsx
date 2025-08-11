import React from 'react';
import { Plane, Twitter, Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'How it Works', 'API', 'Mobile App'],
    Company: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'],
    Support: ['Help Center', 'Community', 'Contact Us', 'Status', 'Privacy Policy'],
    Resources: ['Travel Guides', 'Destination Tips', 'Budget Calculator', 'Travel Checklist', 'Currency Converter']
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Plane className="h-8 w-8 text-[#8B5CF6]" />
                <div>
                  <div className="text-xl font-bold">TravelPro</div>
                  <div className="text-sm text-gray-400">Dream • Plan • Explore</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transform your travel dreams into perfect adventures with intelligent planning, 
                budget tracking, and collaborative tools that make every journey unforgettable.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-[#8B5CF6] transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get travel tips, destination guides, and platform updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#8B5CF6] transition-colors text-white placeholder-gray-400"
              />
              <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center space-x-3 text-gray-400">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <span>San Francisco, CA 94105</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <span>hello@globetrotter.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              © 2025 GlobeTrotter. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;