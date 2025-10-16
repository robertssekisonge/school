import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const Testimonials: React.FC = () => {
  const { testimonials, loading } = useContent();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our students, parents, and alumni about their experiences 
            at Excellence Academy and how we've made a difference in their lives.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
                
                <p className="text-gray-600 mb-6 italic group-hover:text-gray-700 transition-colors duration-300">"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image_url || 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Parent Satisfaction</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-100">University Acceptance</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-3xl font-bold mb-2">1200+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;