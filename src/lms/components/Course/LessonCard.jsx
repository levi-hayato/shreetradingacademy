import { motion } from 'framer-motion';
import { FiPlay, FiCheckCircle, FiClock, FiFileText, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const LessonCard = ({ 
  lesson, 
  onClick,
  getLessonIcon,
  getLessonIconColor,
  isCurrentLesson,
  chapterIndex,
  lessonIndex,
  totalLessonsInChapter,
  totalChapters,
  onNextLesson,
  onNextChapter
}) => {
  const hasNextLesson = lessonIndex < totalLessonsInChapter - 1;
  const hasNextChapter = chapterIndex < totalChapters - 1;

  return (
    <motion.div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        lesson.completed ? 'border-l-4 border-green-400' : 'border-l-4 border-indigo-300'
      } ${isCurrentLesson ? 'ring-2 ring-indigo-500' : ''}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {lesson.completed && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          COMPLETED
        </div>
      )}

      <div className="p-6 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-5">
        <div className={`relative flex-shrink-0 ${getLessonIconColor(lesson.type)} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}>
          {getLessonIcon(lesson.type)}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">
              {lesson.title}
            </h3>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center">
              <FiClock className="mr-1.5 text-indigo-400" />
              {lesson.duration}
            </span>
            <span className="flex items-center capitalize">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                lesson.type === 'video' ? 'bg-blue-400' :
                lesson.type === 'reading' ? 'bg-purple-400' :
                'bg-orange-400'
              }`}></span>
              {lesson.type}
            </span>
            {lesson.resources && (
              <span className="flex items-center">
                <FiFileText className="mr-1.5 text-indigo-400" />
                {lesson.resources} resources
              </span>
            )}
          </div>

          {lesson.description && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {lesson.description}
            </p>
          )}
        </div>

        <motion.button
          onClick={() => onClick(chapterIndex, lessonIndex)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
            lesson.completed
              ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200'
              : 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200'
          } shadow-sm hover:shadow-md`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lesson.completed ? (
            <>
              <FiCheckCircle className="mr-2" />
              <span className="hidden md:inline">Reviewed</span>
            </>
          ) : (
            <>
              <FiPlay className="mr-2" />
              <span className="hidden md:inline">
                {isCurrentLesson ? 'Continue' : 'Start Lesson'}
              </span>
            </>
          )}
        </motion.button>
      </div>

      {!lesson.completed && lesson.progress > 0 && (
        <div className="px-6 pb-4 pt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                lesson.type === 'video' ? 'bg-blue-500' :
                lesson.type === 'reading' ? 'bg-purple-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${lesson.progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {lesson.progress}% completed
          </div>
        </div>
      )}
    
      {isCurrentLesson && lesson.content && (
        <div className='px-6 py-4 bg-white border-t border-gray-200'>
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-lg font-semibold text-gray-800'>Lesson Content</h2>
           
          </div>
          
          <div className='text-sm text-gray-600'>
            {lesson.content}
          </div>
          
          <div className="w-full flex justify-between items-center p-3 mt-4 rounded-lg bg-indigo-50">
            {lessonIndex > 0 ? (
              <button
              onClick={() => onNextLesson(chapterIndex, lessonIndex - 1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
               <FiArrowLeft className="mr-2" /> Prev Lesson
            </button>
          ) : hasNextChapter ? (
            <button
              onClick={() => onNextChapter(chapterIndex - 1)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
               <FiArrowLeft className="mr-2" /> Prev Chapter
            </button>
          ) : null}
            
            {hasNextLesson ? (
              <button
                onClick={() => onNextLesson(chapterIndex, lessonIndex + 1)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Next Lesson <FiArrowRight className="ml-2" />
              </button>
            ) : hasNextChapter ? (
              <button
                onClick={() => onNextChapter(chapterIndex + 1)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Next Chapter <FiArrowRight className="ml-2" />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LessonCard;