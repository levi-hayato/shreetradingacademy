import { FiChevronDown, FiClock, FiCheckCircle } from 'react-icons/fi';

const ChapterList = ({ 
  selectedCourse, 
  isMobile, 
  setSidebarOpen,
  activeChapter,
  setActiveChapter,
  activeLesson,
  setActiveLesson, // Now properly received
  expandedChapters,
  setExpandedChapters
}) => {
  const toggleChapter = (index) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter(i => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
    }
  };

  return (
    <div className="px-4 mt-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Course Chapters
      </h2>
      
      <div className="mt-2 space-y-1">
        {selectedCourse.chapters?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="mb-1">
            <button
              onClick={() => toggleChapter(chapterIndex)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                activeChapter === chapterIndex 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                  activeChapter === chapterIndex 
                    ? 'bg-indigo-100 text-indigo-600 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {chapterIndex + 1}
                </span>
                <span className="truncate text-sm font-medium">{chapter.title}</span>
              </div>
              <FiChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform ${
                  expandedChapters.includes(chapterIndex) ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
            
            {expandedChapters.includes(chapterIndex) && (
              <div className="ml-8 mt-1 space-y-1">
                {chapter.lessons?.map((lesson, lessonIndex) => (
                  <button
                    key={lessonIndex}
                    onClick={() => {
                      setActiveChapter(chapterIndex);
                      setActiveLesson(lessonIndex);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2 pl-3 rounded-lg flex items-center text-sm ${
                      activeChapter === chapterIndex && activeLesson === lessonIndex
                        ? 'text-indigo-600 font-medium bg-indigo-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center mr-2">
                      {lesson.completed ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      )}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                    <span className="ml-auto text-xs text-gray-400 flex items-center">
                      <FiClock className="mr-1" /> {lesson.duration}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;