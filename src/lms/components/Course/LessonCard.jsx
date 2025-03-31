import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiArrowRight, 
  FiArrowLeft,
  FiDownload
} from 'react-icons/fi';
import ReactPlayer from 'react-player';

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

  const [isPlaying, setIsPlaying] = useState(false);
const [isHovered, setIsHovered] = useState(false);

  const renderContent = () => {
    if (!isCurrentLesson || !lesson.content) return null;

    switch(lesson.type) {
      case 'video':
        return (
          <div className="mt-4 rounded-xl overflow-hidden bg-gray-900 shadow-2xl group relative">
          {/* Video Player */}
          <div className="relative aspect-video">
            <ReactPlayer
              url={lesson.content}
              width="100%"
              height="100%"
              controls={true}
              light={false}
              playing={false}
              playIcon={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center transform transition-all group-hover:scale-110">
                    <FiPlay className="text-white text-2xl" />
                  </div>
                </div>
              }
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                    disablePictureInPicture: true
                  }
                }
              }}
              style={{
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}
            />
            
            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Progress indicator when not playing */}
            {!isPlaying && lesson.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${lesson.progress}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Video Info Bar */}
          <div className="p-3 bg-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-300">LIVE</span>
            </div>
            <div className="text-xs text-gray-400">
              {lesson.duration || '00:00'}
            </div>
          </div>
          
          {/* Quality selector (appears on hover) */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              1080p HD
            </div>
          </div>
        </div>
        );
      
      case 'reading':
        return (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-700 mb-2">{lesson.content}</div>
              <a 
                href={lesson.content} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FiDownload className="mr-1" /> Download PDF
              </a>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-700 mb-2">{lesson.content}</div>
              {lesson.resourceUrl && (
                <a 
                  href={lesson.resourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FiDownload className="mr-1" /> Download Resource
                </a>
              )}
            </div>
          </div>
        );
    }
  };

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
            <div className="flex items-center">
              <FiClock className="mr-1.5 text-indigo-400" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center capitalize">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                lesson.type === 'video' ? 'bg-blue-400' :
                lesson.type === 'reading' ? 'bg-purple-400' :
                'bg-orange-400'
              }`}></span>
              <span>{lesson.type}</span>
            </div>
            {lesson.resources && (
              <div className="flex items-center">
                <FiFileText className="mr-1.5 text-indigo-400" />
                <span>{lesson.resources} resources</span>
              </div>
            )}
          </div>

          {lesson.description && (
            <div className="mt-3 text-sm text-gray-600 line-clamp-2">
              {lesson.description}
            </div>
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
    
      {isCurrentLesson && (
        <div className='px-6 py-4 bg-white border-t border-gray-200'>
          <div className="flex justify-between items-center mb-4">
            <h2 className='text-lg font-semibold text-gray-800'>Lesson Content</h2>
          </div>
          
          {renderContent()}
          
          <div className="w-full flex justify-between items-center p-3 mt-4 rounded-lg bg-indigo-50">
            {lessonIndex > 0 ? (
              <button
                onClick={() => onNextLesson(chapterIndex, lessonIndex - 1)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Prev Lesson
              </button>
            ) : chapterIndex > 0 ? (
              <button
                onClick={() => onNextChapter(chapterIndex - 1)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <FiArrowLeft className="mr-2" /> Prev Chapter
              </button>
            ) : <div />}
            
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
            ) : <div />}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LessonCard;