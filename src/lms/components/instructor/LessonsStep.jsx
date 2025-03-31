import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiVideo, FiBook, FiCode, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const LessonsStep = ({ courseData, setCourseData }) => {
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    duration: '',
    content: '',
    quiz: [],
    keyPoints: []
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState(null);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  const [newKeyPoint, setNewKeyPoint] = useState({
    title: '',
    description: ''
  });

  const addLesson = () => {
    if (newLesson.title && activeChapterIndex !== null) {
      const updatedChapters = [...courseData.chapters];
      
      if (editingLessonIndex !== null) {
        // Update existing lesson
        updatedChapters[activeChapterIndex].lessons[editingLessonIndex] = newLesson;
        setEditingLessonIndex(null);
      } else {
        // Add new lesson
        updatedChapters[activeChapterIndex].lessons = [
          ...updatedChapters[activeChapterIndex].lessons,
          newLesson
        ];
      }
      
      setCourseData({
        ...courseData,
        chapters: updatedChapters
      });
      setNewLesson({
        title: '',
        type: 'video',
        duration: '',
        content: '',
        quiz: [],
        keyPoints: []
      });
    }
  };

  const editLesson = (chapterIndex, lessonIndex) => {
    setActiveChapterIndex(chapterIndex);
    setEditingLessonIndex(lessonIndex);
    const lesson = courseData.chapters[chapterIndex].lessons[lessonIndex];
    setNewLesson({
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      content: lesson.content,
      quiz: lesson.quiz || [],
      keyPoints: lesson.keyPoints || []
    });
  };

  const deleteLesson = (chapterIndex, lessonIndex) => {
    const updatedChapters = [...courseData.chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[chapterIndex].lessons.filter(
      (_, index) => index !== lessonIndex
    );
    setCourseData({
      ...courseData,
      chapters: updatedChapters
    });
  };

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim() !== '')) {
      setNewLesson({
        ...newLesson,
        quiz: [...newLesson.quiz, newQuestion]
      });
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const removeQuestion = (index) => {
    setNewLesson({
      ...newLesson,
      quiz: newLesson.quiz.filter((_, i) => i !== index)
    });
  };

  const addKeyPoint = () => {
    if (newKeyPoint.title) {
      setNewLesson({
        ...newLesson,
        keyPoints: [...newLesson.keyPoints, newKeyPoint]
      });
      setNewKeyPoint({
        title: '',
        description: ''
      });
    }
  };

  const removeKeyPoint = (index) => {
    setNewLesson({
      ...newLesson,
      keyPoints: newLesson.keyPoints.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <FiVideo className="text-blue-500" />;
      case 'reading': return <FiBook className="text-green-500" />;
      case 'assignment': return <FiCode className="text-purple-500" />;
      default: return <FiVideo className="text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Manage Lessons</h3>
      
      {courseData.chapters.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please add at least one chapter before adding lessons.</p>
        </div>
      ) : (
        <>
          {/* Chapter selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Chapter</label>
            <select
              value={activeChapterIndex || ''}
              onChange={(e) => {
                setActiveChapterIndex(e.target.value ? parseInt(e.target.value) : null);
                setEditingLessonIndex(null);
                setNewLesson({
                  title: '',
                  type: 'video',
                  duration: '',
                  content: '',
                  quiz: [],
                  keyPoints: []
                });
              }}
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
          
          {/* Lesson form */}
          {activeChapterIndex !== null && (
            <div className="border border-dashed border-gray-300 rounded-xl p-6 mb-8">
              <h4 className="font-medium text-gray-700 mb-4">
                {editingLessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'} to: {courseData.chapters[activeChapterIndex].title}
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
                    <option value="assignment">Quiz</option>
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

              {/* Key Points Section */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Key Points</h5>
                <div className="space-y-3 mb-3">
                  {newLesson.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-800">{point.title}</h6>
                        {point.description && (
                          <p className="text-sm text-gray-600 mt-1">{point.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeKeyPoint(index)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newKeyPoint.title}
                    onChange={(e) => setNewKeyPoint({...newKeyPoint, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Key point title"
                  />
                  <textarea
                    value={newKeyPoint.description}
                    onChange={(e) => setNewKeyPoint({...newKeyPoint, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Description (optional)"
                    rows="2"
                  />
                  <button
                    onClick={addKeyPoint}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <FiPlus className="mr-1" /> Add Key Point
                  </button>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Quiz Questions</h5>
                <div className="space-y-4 mb-4">
                  {newLesson.quiz.map((question, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h6 className="font-medium text-gray-800">{question.question}</h6>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <FiX />
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex} className="flex items-center">
                            {optIndex === question.correctAnswer ? (
                              <FiCheck className="text-green-500 mr-2" />
                            ) : (
                              <FiX className="text-gray-300 mr-2" />
                            )}
                            <span className={optIndex === question.correctAnswer ? 'text-green-600' : ''}>
                              {option}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Question"
                  />
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={newQuestion.correctAnswer === index}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addQuestion}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <FiPlus className="mr-1" /> Add Question
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                onClick={addLesson}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiPlus className="mr-2" /> 
                {editingLessonIndex !== null ? 'Update Lesson' : 'Add Lesson'}
              </button>
            </div>
          )}

          {/* Display existing chapters with lessons */}
          <div className="space-y-6">
            {courseData.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">{chapter.title}</h4>
                </div>
                
                {chapter.lessons.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500">{lesson.type}</span>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                              {lesson.keyPoints?.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs font-medium text-gray-500">Key Points:</span>
                                  <ul className="flex flex-wrap gap-1 mt-1">
                                    {lesson.keyPoints.slice(0, 3).map((point, i) => (
                                      <li key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        {point.title}
                                      </li>
                                    ))}
                                    {lesson.keyPoints.length > 3 && (
                                      <li className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        +{lesson.keyPoints.length - 3} more
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                              {lesson.quiz?.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    {lesson.quiz.length} quiz question{lesson.quiz.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editLesson(chapterIndex, lessonIndex)}
                              className="text-gray-500 hover:text-indigo-600 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => deleteLesson(chapterIndex, lessonIndex)}
                              className="text-gray-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No lessons added yet for this chapter.
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LessonsStep;