export default function CategoryCard({ category, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl text-center transition-all duration-300 ${
        isSelected
          ? 'bg-sky-500 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 shadow-md'
      }`}
    >
      <category.icon className="w-8 h-8 mx-auto mb-2" />
      <div className="font-medium text-sm">{category.name}</div>
      <div className="text-xs opacity-75 mt-1">{category.count} courses</div>
    </button>
  );
}