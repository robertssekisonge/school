import React from 'react';
import { Award, Users, BookOpen, Target } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const About: React.FC = () => {
  const { aboutContent } = useContent();

  const stats = [
    { icon: Users, label: 'Students', value: '1,200+' },
    { icon: BookOpen, label: 'Courses', value: '50+' },
    { icon: Award, label: 'Awards', value: '25+' },
    { icon: Target, label: 'Success Rate', value: '98%' },
  ];


  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {aboutContent.title || 'About Excellence Academy'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent.content || 'For over two decades, we have been committed to providing exceptional education that prepares students for success in an ever-changing world.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-600 mb-6">
              To provide a nurturing and challenging educational environment that empowers 
              students to achieve academic excellence, develop critical thinking skills, 
              and become responsible global citizens.
            </p>
            <p className="text-gray-600 mb-6">
              We believe in holistic education that balances academic rigor with character 
              development, creativity, and social responsibility. Our dedicated faculty and 
              state-of-the-art facilities create an environment where every student can thrive.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 hover:bg-blue-200 hover:shadow-lg cursor-pointer">
                Academic Excellence
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 hover:bg-green-200 hover:shadow-lg cursor-pointer">
                Character Building
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 hover:bg-purple-200 hover:shadow-lg cursor-pointer">
                Innovation
              </div>
            </div>
          </div>
          <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src={aboutContent.image || "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=800"}
              alt="Students in classroom"
              className="rounded-xl shadow-lg w-full h-96 object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <stat.icon className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{stat.value}</div>
              <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;