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
  FileText,
  Star,
  Heart,
  Camera
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
      action: "Send Email",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM EST",
      action: "Start Chat",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our travel experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      color: "from-purple-500 to-pink-500"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section with Full-Height Maldives Background */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Maldives crystal clear turquoise waters"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-cyan-400 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Headphones className="h-4 w-4" />
              <span>We're Here to Help</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Get in Touch
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                We'd Love to Hear From You
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Have questions about TravelPro? Need help planning your next adventure? 
              Our friendly support team is here to assist you every step of the way.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/60">
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
      </div>

      {/* Contact Methods Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Choose Your Preferred Way to Connect</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We offer multiple ways to get in touch. Pick the method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${method.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                  <p className="text-white/70 mb-4">{method.description}</p>
                  <div className="text-cyan-400 font-semibold mb-6">{method.contact}</div>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 font-semibold group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                    {method.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h4>
                  <p className="text-white/70">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                    >
                      <option value="general" className="bg-slate-800">General Inquiry</option>
                      <option value="support" className="bg-slate-800">Technical Support</option>
                      <option value="billing" className="bg-slate-800">Account & Billing</option>
                      <option value="planning" className="bg-slate-800">Trip Planning Help</option>
                      <option value="partnership" className="bg-slate-800">Partnership</option>
                      <option value="press" className="bg-slate-800">Press Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 resize-none"
                      placeholder="Tell us more about how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h3 className="text-2xl font-bold text-white mb-6">How Can We Help?</h3>
              <div className="space-y-4">
                {supportCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 group">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-2">{category.title}</h4>
                          <p className="text-white/70 text-sm">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FAQ Link */}
              <div className="mt-8 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30">
                <h4 className="text-lg font-bold text-white mb-2">Looking for Quick Answers?</h4>
                <p className="text-white/70 mb-4">Check out our comprehensive FAQ section for instant solutions to common questions.</p>
                <button className="flex items-center space-x-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  <span>Visit FAQ Center</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Global Offices</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              With offices around the world, we're always close by to provide local support and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{office.city}</h3>
                  {office.isHeadquarters && (
                    <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      HQ
                    </span>
                  )}
                </div>
                <div className="space-y-3 text-white/70">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div>{office.address}</div>
                      <div>{office.zipCode}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    <span>{office.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Promise Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Our Response Time Promise
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            We're committed to providing fast, helpful support when you need it most.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-4xl font-bold text-cyan-400 mb-2">&lt; 1 min</div>
              <div className="text-white/80">Live Chat Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-4xl font-bold text-emerald-400 mb-2">&lt; 4 hours</div>
              <div className="text-white/80">Email Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-white/80">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;