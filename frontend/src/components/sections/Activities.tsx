import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import ContinuousImageSlider from '../ui/ContinuousImageSlider';

const Activities: React.FC = () => {
  const { activities } = useContent();

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: 'bg-blue-100 text-blue-800',
      Sports: 'bg-green-100 text-green-800',
      Cultural: 'bg-purple-100 text-purple-800',
      Arts: 'bg-pink-100 text-pink-800',
      Community: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="activities" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            School Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the vibrant life at Excellence Academy through our diverse range of 
            activities that promote learning, creativity, and personal growth.
          </p>
        </div>

        {/* Continuous Sliding Image Gallery */}
        {activities.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Activity Gallery</h3>
            <div className="h-64 rounded-xl overflow-hidden shadow-lg">
              <ContinuousImageSlider
                images={activities.map(activity => activity.image_url).filter(Boolean)}
                direction="left"
                speed={20}
                className="h-full"
                imageClassName="h-64"
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-all duration-300 group-hover:scale-110">
                    Activity
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{activity.title}</h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{activity.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 transition-colors duration-300">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 transition-colors duration-300">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    {activity.time || 'TBD'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 transition-colors duration-300">
                    <MapPin className="h-4 w-4 mr-2 text-rose-500" />
                    {activity.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;