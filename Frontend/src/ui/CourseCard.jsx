import { Star, Clock, Users, Heart, User } from 'lucide-react';
import Button from './Button';

export default function CourseCard({ course, featured = false }) {
  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${featured ? 'transform hover:scale-105' : ''}`}>
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
        {featured && (
          <div className="absolute top-3 left-3 bg-sky-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
            {course.category}
          </span>
          {course.level && (
            <span className="text-xs text-gray-500">{course.level}</span>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mr-2">
            <User className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-sm text-gray-600">{course.instructor}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{course.students}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-sky-600">{course.price}</span>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}