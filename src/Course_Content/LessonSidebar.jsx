import { FiCheck, FiLock } from 'react-icons/fi';

const LessonSidebar = ({ lessons, currentLessonId, onLessonSelect }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
        <nav className="space-y-1">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                lesson.current
                  ? 'bg-blue-50 text-blue-700'
                  : lesson.completed
                  ? 'text-gray-900 hover:bg-gray-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{lesson.title}</span>
              <div className="flex items-center">
                {lesson.completed ? (
                  <FiCheck className="h-4 w-4 text-green-500 ml-2" />
                ) : !lesson.current ? (
                  <FiLock className="h-3 w-3 text-gray-400 ml-2" />
                ) : null}
                <span className="text-xs ml-2">{lesson.duration}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LessonSidebar;