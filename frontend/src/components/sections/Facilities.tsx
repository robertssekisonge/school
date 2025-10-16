import React from 'react';
import { Users, Wifi, Shield, Zap } from 'lucide-react';

const Facilities: React.FC = () => {
  const facilities = [
    {
      id: 1,
      name: 'Science Laboratory Complex',
      description: 'State-of-the-art laboratories equipped with modern instruments for physics, chemistry, and biology experiments.',
      image: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Academic',
      capacity: 120,
      features: ['Modern Equipment', 'Safety Systems', 'Digital Microscopes', 'Fume Hoods']
    },
    {
      id: 2,
      name: 'Sports Complex',
      description: 'Comprehensive sports facility including gymnasium, swimming pool, and outdoor courts for various athletic activities.',
      image: 'https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sports',
      capacity: 500,
      features: ['Olympic Pool', 'Basketball Courts', 'Tennis Courts', 'Fitness Center']
    },
    {
      id: 3,
      name: 'Digital Library',
      description: 'Modern library with extensive collection of books, digital resources, and collaborative study spaces.',
      image: 'https://images.pexels.com/photos/8199564/pexels-photo-8199564.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Academic',
      capacity: 200,
      features: ['Digital Catalog', 'Study Rooms', 'Computer Lab', 'Quiet Zones']
    },
    {
      id: 4,
      name: 'Main Auditorium',
      description: 'Large auditorium for school events, performances, assemblies, and guest lectures with professional sound and lighting.',
      image: 'https://images.pexels.com/photos/8199565/pexels-photo-8199565.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Events',
      capacity: 800,
      features: ['Sound System', 'Stage Lighting', 'Air Conditioning', 'Projection System']
    },
    {
      id: 5,
      name: 'Computer Laboratory',
      description: 'Advanced computer laboratory with latest technology for digital learning and programming courses.',
      image: 'https://images.pexels.com/photos/8199566/pexels-photo-8199566.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Technology',
      capacity: 60,
      features: ['High-Speed Internet', 'Latest Software', 'Interactive Whiteboards', '3D Printers']
    },
    {
      id: 6,
      name: 'Art Studio',
      description: 'Creative space for visual arts, crafts, and design projects with professional-grade equipment and materials.',
      image: 'https://images.pexels.com/photos/8199567/pexels-photo-8199567.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Arts',
      capacity: 40,
      features: ['Art Supplies', 'Pottery Wheels', 'Digital Design Tools', 'Exhibition Space']
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: 'bg-blue-100 text-blue-800',
      Sports: 'bg-green-100 text-green-800',
      Events: 'bg-purple-100 text-purple-800',
      Technology: 'bg-red-100 text-red-800',
      Arts: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="facilities" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            World-Class Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our modern facilities provide students with the best environment for learning, 
            creativity, and personal development across all areas of study.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility) => (
            <div 
              key={facility.id} 
              className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(facility.category)} transition-all duration-300 group-hover:scale-110`}>
                    {facility.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{facility.name}</h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{facility.description}</p>
                
                <div className="flex items-center text-sm text-gray-600 mb-4 transition-colors duration-300">
                  <Users className="h-4 w-4 mr-2 text-sky-500" />
                  Capacity: {facility.capacity} people
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:scale-105"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110 group-hover:shadow-lg">
              <Wifi className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">High-Speed WiFi</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Campus-wide internet connectivity for seamless digital learning.</p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110 group-hover:shadow-lg">
              <Shield className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">24/7 Security</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Round-the-clock security ensuring a safe learning environment.</p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-purple-200 group-hover:scale-110 group-hover:shadow-lg">
              <Zap className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Smart Classrooms</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Interactive whiteboards and modern teaching technology.</p>
          </div>
          
          <div className="text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group">
            <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-yellow-200 group-hover:scale-110 group-hover:shadow-lg">
              <Users className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">Accessibility</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Fully accessible facilities for students with diverse needs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;