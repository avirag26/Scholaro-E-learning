import Button from './Button';
import CourseCard from './CourseCard';

export default function CourseSection({ title, courses, showViewAll = true, featured = false }) {
  return (
    <section className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          {showViewAll && (
            <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
              View All
            </Button>
          )}
        </div>
      )}
      <div className={`grid gap-6 ${
        featured 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} featured={featured} />
        ))}
      </div>
    </section>
  );
}