import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUpload, FiChevronRight, FiChevronLeft, FiCheckCircle, FiFileText, FiVideo, FiBook, FiAward, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CourseUploadForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state with proper initialization
  const [formData, setFormData] = useState({
    course: {
      title: '',
      instructor: '',
      description: '',
      category: 'finance',
      level: 'intermediate',
      thumbnail: ''
    },
    lessons: [{
      title: '',
      duration: '',
      videoUrl: '',
      description: '',
      sections: [{ title: '', content: '' }],
      quiz: {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    }],
    resources: [],
    assignments: []
  });

  // Fixed handleChange function
  const handleChange = (e, index, section, field, optionIndex) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (section === 'course') {
        updated.course[name] = value;
      }
      else if (section === 'lesson') {
        updated.lessons[index][name] = value;
      }
      else if (section === 'section') {
        updated.lessons[index].sections[field][name] = value;
      }
      else if (section === 'quiz') {
        if (name === 'correctAnswer') {
          updated.lessons[index].quiz.correctAnswer = parseInt(value);
        } else if (field === 'options') {
          updated.lessons[index].quiz.options[optionIndex] = value;
        } else {
          updated.lessons[index].quiz[name] = value;
        }
      }
      else if (section === 'resource') {
        updated.resources[index][name] = value;
      }
      else if (section === 'assignment') {
        updated.assignments[index][name] = value;
      }

      return updated;
    });
  };

  // Add new items
  const addNewLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, {
        title: '',
        duration: '',
        videoUrl: '',
        description: '',
        sections: [{ title: '', content: '' }],
        quiz: {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      }]
    }));
  };

  const addNewSection = (lessonIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.lessons[lessonIndex].sections.push({ title: '', content: '' });
      return updated;
    });
  };

  const addNewQuizOption = (lessonIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.lessons[lessonIndex].quiz.options.push('');
      return updated;
    });
  };

  const addNewResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { type: 'pdf', title: '', url: '' }]
    }));
  };

  const addNewAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { title: '', due: '', description: '' }]
    }));
  };


  // Remove items
  const removeSection = (lessonIndex, sectionIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.lessons[lessonIndex].sections =
        updated.lessons[lessonIndex].sections.filter((_, i) => i !== sectionIndex);
      return updated;
    });
  };

  const removeQuizOption = (lessonIndex, optionIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.lessons[lessonIndex].quiz.options =
        updated.lessons[lessonIndex].quiz.options.filter((_, i) => i !== optionIndex);

      // Adjust correct answer if needed
      if (updated.lessons[lessonIndex].quiz.correctAnswer >= optionIndex) {
        updated.lessons[lessonIndex].quiz.correctAnswer =
          Math.max(0, updated.lessons[lessonIndex].quiz.correctAnswer - 1);
      }
      return updated;
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const courseRef = await addDoc(collection(db, 'courseData'), formData.course);

      const lessonPromises = formData.lessons.map(lesson =>
        addDoc(collection(db, 'lessons'), { ...lesson, courseId: courseRef.id })
      );

      await Promise.all(lessonPromises);
      setSubmitSuccess(true);
      setTimeout(() => navigate('/instructor/courses'), 2000);
    } catch (error) {
      console.error('Error uploading data: ', error);
      setIsSubmitting(false);
    }
  };

  // Navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Animation variants
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ... (keep the existing header and progress indicator code) ... */}

        {submitSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto"
          >
            {/* Success message */}
          </motion.div>
        ) : (
          <motion.div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Step 1: Course Information */}
                {/* Step 1: Course Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FiBook className="mr-3 text-indigo-600" size={24} />
                      Course Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.course.title}
                          onChange={(e) => handleChange(e, null, 'course')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          placeholder="Advanced Stock Market Trading"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructor*</label>
                        <input
                          type="text"
                          name="instructor"
                          value={formData.course.instructor}
                          onChange={(e) => handleChange(e, null, 'course')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          placeholder="Jane Smith"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                      <textarea
                        name="description"
                        value={formData.course.description}
                        onChange={(e) => handleChange(e, null, 'course')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[120px]"
                        placeholder="Describe what students will learn in this course..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                        <select
                          name="category"
                          value={formData.course.category}
                          onChange={(e) => handleChange(e, null, 'course')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        >
                          <option value="finance">Finance & Investing</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                          <option value="design">Design</option>
                          <option value="marketing">Marketing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level*</label>
                        <select
                          name="level"
                          value={formData.course.level}
                          onChange={(e) => handleChange(e, null, 'course')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Lessons - Fixed Section */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FiVideo className="mr-3 text-indigo-600" size={24} />
                      Course Lessons
                    </h2>

                    {formData.lessons.map((lesson, lessonIndex) => (
                      <motion.div
                        key={lessonIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: lessonIndex * 0.05 }}
                        className="mb-8 p-5 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                      >
                        {/* Lesson fields (keep existing) */}

                        {/* Fixed Sections */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Sections</h4>
                          {lesson.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-3 pl-3 border-l-2 border-indigo-200">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs text-gray-600">Section {sectionIndex + 1}</label>
                                {lesson.sections.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSection(lessonIndex, sectionIndex)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                name="title"
                                value={section.title}
                                onChange={(e) => handleChange(e, lessonIndex, 'section', sectionIndex)}
                                className="w-full p-2 border border-gray-300 rounded-lg mb-1"
                                placeholder="Section title"
                                required
                              />
                              <textarea
                                name="content"
                                value={section.content}
                                onChange={(e) => handleChange(e, lessonIndex, 'section', sectionIndex)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-xs min-h-[60px]"
                                placeholder="Section content..."
                                required
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addNewSection(lessonIndex)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                          >
                            <FiPlus size={12} className="mr-1" /> Add Section
                          </button>
                        </div>

                        {/* Fixed Quiz */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Quiz</h4>
                          <div className="mb-3">
                            <label className="block text-xs text-gray-600 mb-1">Question*</label>
                            <input
                              type="text"
                              name="question"
                              value={lesson.quiz.question}
                              onChange={(e) => handleChange(e, lessonIndex, 'quiz')}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Quiz question..."
                              required
                            />
                          </div>

                          <div className="mb-2">
                            <label className="block text-xs text-gray-600 mb-2">Options*</label>
                            {lesson.quiz.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center mb-2">
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={lesson.quiz.correctAnswer === optionIndex}
                                  onChange={() => setFormData(prev => {
                                    const updated = JSON.parse(JSON.stringify(prev));
                                    updated.lessons[lessonIndex].quiz.correctAnswer = optionIndex;
                                    return updated;
                                  })}
                                  className="mr-2"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleChange(e, lessonIndex, 'quiz', 'options', optionIndex)}
                                  className="flex-1 p-2 border border-gray-300 rounded-lg text-xs"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  required
                                />
                                {lesson.quiz.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeQuizOption(lessonIndex, optionIndex)}
                                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addNewQuizOption(lessonIndex)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                            >
                              <FiPlus size={12} className="mr-1" /> Add Option
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button
                      type="button"
                      onClick={addNewLesson}
                      className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center justify-center"
                    >
                      <FiPlus className="mr-2" /> Add Another Lesson
                    </button>
                  </div>
                )}

                {/* Step 3: Resources & Assignments */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FiFileText className="mr-3 text-indigo-600" size={24} />
                      Resources & Assignments
                    </h2>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                        <FiFileText className="mr-2 text-blue-500" />
                        Course Resources
                      </h3>

                      {formData.resources.map((resource, index) => (
                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm text-gray-700">Resource {index + 1}</label>
                            <button
                              type="button"
                              onClick={() => removeItem('resources', index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Type*</label>
                              <select
                                name="type"
                                value={resource.type}
                                onChange={(e) => handleChange(e, index, 'resource')}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                required
                              >
                                <option value="pdf">PDF Document</option>
                                <option value="spreadsheet">Spreadsheet</option>
                                <option value="video">Video</option>
                                <option value="link">External Link</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-gray-600 mb-1">Title*</label>
                              <input
                                type="text"
                                name="title"
                                value={resource.title}
                                onChange={(e) => handleChange(e, index, 'resource')}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Technical Analysis Handbook"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 mb-1">URL*</label>
                            <input
                              type="url"
                              name="url"
                              value={resource.url}
                              onChange={(e) => handleChange(e, index, 'resource')}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="https://example.com/resource.pdf"
                              required
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addNewResource}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-2"
                      >
                        <FiPlus className="mr-1" /> Add Resource
                      </button>
                    </div>

                    {/* Assignments Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                        <FiAward className="mr-2 text-green-500" />
                        Course Assignments
                      </h3>

                      {formData.assignments.map((assignment, index) => (
                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm text-gray-700">Assignment {index + 1}</label>
                            <button
                              type="button"
                              onClick={() => removeItem('assignments', index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mb-2">
                            <label className="block text-xs text-gray-600 mb-1">Title*</label>
                            <input
                              type="text"
                              name="title"
                              value={assignment.title}
                              onChange={(e) => handleChange(e, index, 'assignment')}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Identify Chart Patterns"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Due Date*</label>
                              <input
                                type="date"
                                name="due"
                                value={assignment.due}
                                onChange={(e) => handleChange(e, index, 'assignment')}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Description</label>
                              <input
                                type="text"
                                name="description"
                                value={assignment.description}
                                onChange={(e) => handleChange(e, index, 'assignment')}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Assignment instructions..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addNewAssignment}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-2"
                      >
                        <FiPlus className="mr-1" /> Add Assignment
                      </button>
                    </div>
                  </div>
                )}


                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FiCheckCircle className="mr-3 text-indigo-600" size={24} />
                      Review & Submit
                    </h2>

                    <div className="mb-8 p-5 bg-indigo-50 rounded-lg">
                      <h3 className="text-lg font-medium text-indigo-800 mb-3">Course Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Course Title</p>
                          <p className="font-medium">{formData.course.title || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Instructor</p>
                          <p className="font-medium">{formData.course.instructor || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium capitalize">{formData.course.category || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Level</p>
                          <p className="font-medium capitalize">{formData.course.level || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="whitespace-pre-line">{formData.course.description || '-'}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Lessons ({formData.lessons.length})</h3>
                      <div className="space-y-3">
                        {formData.lessons.map((lesson, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <h4 className="font-medium">{lesson.title || `Lesson ${index + 1}`}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="mr-3">Duration: {lesson.duration || '-'}</span>
                              <span>Sections: {lesson.sections.length}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Resources ({formData.resources.length})</h3>
                      {formData.resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.resources.map((resource, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                                  {resource.type === 'pdf' && <FiFileText size={16} />}
                                  {resource.type === 'spreadsheet' && <FiFileText size={16} />}
                                  {resource.type === 'video' && <FiVideo size={16} />}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{resource.title}</p>
                                  <p className="text-xs text-gray-500">{resource.type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No resources added</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Assignments ({formData.assignments.length})</h3>
                      {formData.assignments.length > 0 ? (
                        <div className="space-y-3">
                          {formData.assignments.map((assignment, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg">
                              <h4 className="font-medium">{assignment.title}</h4>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="mr-3">Due: {assignment.due || '-'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No assignments added</p>
                      )}
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Ready to publish your course?</h4>
                      <p className="text-xs text-yellow-700">
                        Please review all information carefully. Once submitted, you'll be able to edit the course but changes may take a few minutes to appear.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
                >
                  <FiChevronLeft className="mr-2" /> Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                >
                  Continue <FiChevronRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? (
                    'Publishing...'
                  ) : (
                    <>
                      <FiUpload className="mr-2" /> Publish Course
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseUploadForm;