import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiClock } from 'react-icons/fi';

const ChaptersStep = ({ courseData, setCourseData }) => {
  const [newChapter, setNewChapter] = useState({
    title: '',
    duration: '',
    lessons: []
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState(null);

  const addChapter = () => {
    if (newChapter.title) {
      setCourseData({
        ...courseData,
        chapters: [...courseData.chapters, newChapter]
      });
      setNewChapter({
        title: '',
        duration: '',
        lessons: []
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Course Chapters</h3>
      
      {courseData.chapters.length > 0 && (
        <div className="space-y-4">
          {courseData.chapters.map((chapter, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{chapter.title}</h4>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FiClock className="mr-1" /> {chapter.duration}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveChapterIndex(activeChapterIndex === index ? null : index)}
                  className="text-indigo-600 hover:text-indigo-800 p-2"
                >
                  {activeChapterIndex === index ? 'Hide' : 'Show'} Lessons
                </button>
              </div>
              
              {activeChapterIndex === index && (
                <div className="mt-3 space-y-2">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="bg-gray-50 p-3 rounded-lg flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${
                        lesson.type === 'video' ? 'bg-blue-100 text-blue-600' :
                        lesson.type === 'reading' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {lesson.type === 'video' ? <FiVideo /> : 
                         lesson.type === 'reading' ? <FiBook /> : <FiCode />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="border border-dashed border-gray-300 rounded-xl p-6">
        <h4 className="font-medium text-gray-700 mb-4">Add New Chapter</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
            <input
              type="text"
              value={newChapter.title}
              onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Getting Started"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              value={newChapter.duration}
              onChange={(e) => setNewChapter({...newChapter, duration: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. 2h 30m"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addChapter}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <FiPlus className="mr-2" /> Add Chapter
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChaptersStep;