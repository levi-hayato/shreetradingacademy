import { FiPlay, FiPercent } from 'react-icons/fi';

const CourseHeader = ({ selectedCourse, progress }) => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-0">
        <div>
          <h1 className="md:text-2xl text-xl font-bold text-gray-800">{selectedCourse.title}</h1>
          <p className="text-sm text-gray-600">Instructor: {selectedCourse.instructor}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                <FiPercent className="mr-1" /> {progress}%
              </span>
            </div>
          </div>
          
          <button className="hidden md:flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
            <FiPlay className="mr-2" /> Continue
          </button>
        </div>
      </div>
    </header>
  );
};

export default CourseHeader;