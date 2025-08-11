import React from 'react';
import { Calendar, Clock, MapPin, Plane, Camera, Utensils } from 'lucide-react';

const Timeline: React.FC = () => {
  const timelineEvents = [
    {
      id: 1,
      date: 'Mar 15, 2025',
      time: '6:00 AM',
      title: 'Flight Departure',
      description: 'Flight AA123 to Paris',
      location: 'JFK Airport, New York',
      icon: Plane,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      date: 'Mar 15, 2025',
      time: '8:00 PM',
      title: 'Hotel Check-in',
      description: 'Le Marais Hotel',
      location: 'Paris, France',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      id: 3,
      date: 'Mar 16, 2025',
      time: '9:00 AM',
      title: 'Eiffel Tower Visit',
      description: 'Skip-the-line tickets booked',
      location: 'Champ de Mars, Paris',
      icon: Camera,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      date: 'Mar 16, 2025',
      time: '7:30 PM',
      title: 'Dinner Reservation',
      description: 'Le Comptoir du Relais',
      location: '9 Carrefour de l\'Odéon, Paris',
      icon: Utensils,
      color: 'bg-orange-500'
    },
    {
      id: 5,
      date: 'Mar 20, 2025',
      time: '10:00 AM',
      title: 'Train to Rome',
      description: 'High-speed train TGV 9573',
      location: 'Gare de Lyon, Paris',
      icon: Plane,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trip Timeline</h3>
          <p className="text-gray-600">Your complete travel itinerary</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Mar 15 - Mar 28, 2025</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            
            return (
              <div key={event.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 ${event.color} rounded-full shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Event content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">{event.date}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {event.title}
                      </h4>
                      
                      <p className="text-gray-600 mb-2">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="text-center pt-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Add New Event
        </button>
      </div>
    </div>
  );
};

export default Timeline;