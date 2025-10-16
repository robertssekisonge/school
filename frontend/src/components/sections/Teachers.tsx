import React from 'react';
import { Award, BookOpen, Clock } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import ContinuousImageSlider from '../ui/ContinuousImageSlider';

const Teachers: React.FC = () => {
  const { teachers } = useContent();

  return (
    <section id="teachers" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Expert Teachers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated faculty members who bring passion, expertise, and innovation 
            to every classroom, inspiring students to reach their full potential.
          </p>
        </div>

        {/* Continuous Sliding Teacher Gallery */}
        {teachers.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Faculty Gallery</h3>
            <div className="h-64 rounded-xl overflow-hidden shadow-lg">
              <ContinuousImageSlider
                images={teachers.map(teacher => teacher.image_url).filter(Boolean)}
                direction="right"
                speed={22}
                className="h-full"
                imageClassName="h-64"
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">{teacher.name}</h3>
                  <p className="text-blue-200 group-hover:text-blue-100 transition-colors duration-300">{teacher.position}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{teacher.bio}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 transition-colors duration-300">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    {teacher.department}
                  </div>
                  <div className="flex items-start text-sm text-gray-600 transition-colors duration-300">
                    <Award className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                    <div>
                      {teacher.email}
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600 transition-colors duration-300">
                    <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
                    <div>
                      <strong>Contact:</strong> {teacher.phone}
                    </div>
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

export default Teachers;