import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Headphones,
  FileText
} from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@travelpro.com",
      action: "Send Email"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM EST",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our travel experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now"
    }
  ];

  const supportCategories = [
    {
      icon: Users,
      title: "Account & Billing",
      description: "Questions about your account, subscriptions, or payments"
    },
    {
      icon: MapPin,
      title: "Trip Planning Help",
      description: "Need assistance with creating or managing your itineraries"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Experiencing bugs or technical issues with the platform"
    },
    {
      icon: FileText,
      title: "General Inquiries",
      description: "Partnership opportunities, press inquiries, or other questions"
    }
  ];

  const officeLocations = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 400",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      isHeadquarters: true
    },
    {
      city: "New York",
      address: "456 Broadway, Floor 12",
      zipCode: "New York, NY 10013",
      phone: "+1 (555) 987-6543",
      isHeadquarters: false
    },
    {
      city: "London",
      address: "789 Oxford Street",
      zipCode: "London W1C 1JN, UK",
      phone: "+44 20 7123 4567",
      isHeadquarters: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 3000);
  };

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
            <Headphones className="h-4 w-4" />
            <span>We're Here to Help</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in Touch
            <span className="block bg-gradient-to-r from-[#8B5CF6] to-purple-400 bg-clip-text text-transparent">
              We'd Love to Hear From You
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Have questions about TravelPro? Need help planning your next adventure? 
            Our friendly support team is here to assist you every step of the way.
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Expert Team</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Choose Your Preferred Way to Connect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer multiple ways to get in touch. Pick the method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#8B5CF6]/30 transition-all group text-center">
                  <div className="bg-[#8B5CF6]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                    <Icon className="h-8 w-8 text-[#8B5CF6] group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <div className="text-[#8B5CF6] font-semibold mb-6">{method.contact}</div>
                  <button className="w-full bg-[#8B5CF6] text-white py-3 px-6 rounded-lg hover:bg-[#8B5CF6]/90 transition-colors font-semibold">
                    {method.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form & Support Categories */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h4>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Account & Billing</option>
                      <option value="planning">Trip Planning Help</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/50 transition-all duration-300 resize-none"
                      placeholder="Tell us more about how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#8B5CF6] to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-[#8B5CF6]/90 hover:to-purple-500/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Support Categories */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h3>
              <div className="space-y-4">
                {supportCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#8B5CF6]/30 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#8B5CF6]/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h4>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FAQ Link */}
              <div className="mt-8 bg-gradient-to-r from-[#8B5CF6]/10 to-purple-500/10 rounded-2xl p-6 border border-[#8B5CF6]/20">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Looking for Quick Answers?</h4>
                <p className="text-gray-600 mb-4">Check out our comprehensive FAQ section for instant solutions to common questions.</p>
                <button className="flex items-center space-x-2 text-[#8B5CF6] font-semibold hover:text-purple-400 transition-colors">
                  <span>Visit FAQ Center</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Global Offices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With offices around the world, we're always close by to provide local support and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{office.city}</h3>
                  {office.isHeadquarters && (
                    <span className="bg-[#8B5CF6] text-white px-2 py-1 rounded-full text-xs font-medium">
                      HQ
                    </span>
                  )}
                </div>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                    <div>
                      <div>{office.address}</div>
                      <div>{office.zipCode}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#8B5CF6] flex-shrink-0" />
                    <span>{office.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Promise */}
      <div className="py-20 bg-gradient-to-r from-[#8B5CF6] to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Response Time Promise
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            We're committed to providing fast, helpful support when you need it most.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-white mb-2">&lt; 1 min</div>
              <div className="text-white/90">Live Chat Response</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-white mb-2">&lt; 4 hours</div>
              <div className="text-white/90">Email Response</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;