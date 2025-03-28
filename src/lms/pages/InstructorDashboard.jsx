import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { 
  FiPlus, FiUpload, FiX, FiChevronRight, 
  FiChevronLeft, FiVideo, FiBook, FiCode,
  FiCheck, FiClock, FiImage
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const InstructorDashboard = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    thumbnail: '',
    chapters: []
  });

  const [newChapter, setNewChapter] = useState({
    title: '',
    duration: '',
    lessons: []
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    duration: '',
    content: ''
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'courseData'), {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('Course published successfully!');
      // Reset form
      setCourseData({
        title: '',
        description: '',
        instructor: '',
        thumbnail: '',
        chapters: []
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error adding course: ', error);
      alert('Error publishing course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const addLesson = () => {
    if (newLesson.title && activeChapterIndex !== null) {
      const updatedChapters = [...courseData.chapters];
      updatedChapters[activeChapterIndex].lessons = [
        ...updatedChapters[activeChapterIndex].lessons,
        newLesson
      ];
      setCourseData({
        ...courseData,
        chapters: updatedChapters
      });
      setNewLesson({
        title: '',
        type: 'video',
        duration: '',
        content: ''
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800">Course Basic Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g. Advanced React Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                <input
                  type="text"
                  value={courseData.instructor}
                  onChange={(e) => setCourseData({...courseData, instructor: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="4"
                  required
                  placeholder="Brief description of your course"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={courseData.thumbnail}
                    onChange={(e) => setCourseData({...courseData, thumbnail: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Paste image URL"
                  />
                  <button
                    type="button"
                    className="ml-2 p-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <FiUpload />
                  </button>
                </div>
                {courseData.thumbnail && (
                  <div className="mt-2 w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={courseData.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 2:
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
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800">Add Lessons</h3>
            
            {courseData.chapters.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">Please add at least one chapter before adding lessons.</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Chapter</label>
                  <select
                    value={activeChapterIndex || ''}
                    onChange={(e) => setActiveChapterIndex(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a chapter</option>
                    {courseData.chapters.map((chapter, index) => (
                      <option key={index} value={index}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {activeChapterIndex !== null && (
                  <div className="border border-dashed border-gray-300 rounded-xl p-6">
                    <h4 className="font-medium text-gray-700 mb-4">
                      Add Lesson to: {courseData.chapters[activeChapterIndex].title}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                        <input
                          type="text"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. Introduction to React"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={newLesson.type}
                          onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="video">Video</option>
                          <option value="reading">Reading</option>
                          <option value="assignment">Assignment</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. 15m"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content URL</label>
                        <input
                          type="text"
                          value={newLesson.content}
                          onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Link to video or document"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addLesson}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FiPlus className="mr-2" /> Add Lesson
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800">Review & Publish</h3>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Course Details</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Title:</span> {courseData.title}</p>
                  <p><span className="font-medium">Instructor:</span> {courseData.instructor}</p>
                  <p><span className="font-medium">Description:</span> {courseData.description}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Course Structure</h4>
                <div className="space-y-4">
                  {courseData.chapters.map((chapter, index) => (
                    <div key={index} className="border-l-2 border-indigo-200 pl-4">
                      <p className="font-medium">{chapter.title} <span className="text-sm text-gray-500 ml-2">({chapter.duration})</span></p>
                      <div className="mt-2 space-y-2 ml-4">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <p key={lessonIndex} className="text-sm">
                            • {lesson.title} <span className="text-gray-500">({lesson.type}, {lesson.duration})</span>
                          </p>
                        ))}
                        {chapter.lessons.length === 0 && (
                          <p className="text-sm text-gray-400">No lessons added yet</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {courseData.chapters.length === 0 && (
                    <p className="text-gray-400">No chapters added yet</p>
                  )}
                </div>
              </div>
              
              {courseData.thumbnail && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Thumbnail Preview</h4>
                  <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={courseData.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-700">Review all information carefully before publishing. You won't be able to edit after publishing.</p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h1>
          
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step ? 'bg-indigo-600 text-white' : 
                    currentStep > step ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step ? <FiCheck /> : step}
                  </div>
                  <span className={`text-xs mt-2 ${
                    currentStep === step ? 'text-indigo-600 font-medium' : 
                    currentStep > step ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Chapters'}
                    {step === 3 && 'Lessons'}
                    {step === 4 && 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
              <div 
                className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300" 
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form Content */}
          <form onSubmit={handleAddCourse}>
            {renderStep()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FiChevronLeft className="mr-2" /> Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Next <FiChevronRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Course'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;