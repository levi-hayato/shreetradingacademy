import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiChevronRight, FiChevronLeft, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const LessonForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    videoUrl: '',
    description: '',
    sections: [{ title: '', content: '' }],
    quiz: {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e, index, section, field) => {
    const { name, value } = e.target;
    const updatedData = { ...formData };

    if (section === 'sections') {
      updatedData[section][index][field] = value;
    } else if (section === 'quiz' && field === 'options') {
      updatedData[section][field][index] = value;
    } else if (section === 'quiz' && field) {
      updatedData[section][field] = parseInt(value) || value;
    } else {
      updatedData[name] = value;
    }

    setFormData(updatedData);
  };

  const addNewSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length > 1) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index)
      }));
    }
  };

  const addNewQuizOption = () => {
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        options: [...prev.quiz.options, '']
      }
    }));
  };

  const removeQuizOption = (index) => {
    if (formData.quiz.options.length > 1) {
      setFormData(prev => ({
        ...prev,
        quiz: {
          ...prev.quiz,
          options: prev.quiz.options.filter((_, i) => i !== index),
          correctAnswer: prev.quiz.correctAnswer >= index && prev.quiz.correctAnswer !== 0 
            ? prev.quiz.correctAnswer - 1 
            : prev.quiz.correctAnswer
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'lessons'), { ...formData });
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      console.error('Error adding document: ', e);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Create New Lesson</h1>
          <p className="text-lg text-indigo-700">Fill in the details to create an engaging learning experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {[...Array(totalSteps)].map((_, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center ${idx + 1 <= step ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 
                    ${idx + 1 < step ? 'bg-green-500 text-white' : 
                      idx + 1 === step ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                >
                  {idx + 1 < step ? <FiCheckCircle size={20} /> : idx + 1}
                </div>
                <span className="text-xs font-medium">
                  {['Video', 'Description', 'Sections', 'Quiz'][idx]}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {submitSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your lesson has been saved and is now available for students.</p>
            <div className="animate-pulse text-sm text-gray-500">Redirecting...</div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Step 1: Video URL */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">1</span>
                      Video Content
                    </h2>
                    <div className="mb-6">
                      <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Video URL
                        <span className="text-xs text-gray-500 ml-1">(YouTube, Vimeo, etc.)</span>
                      </label>
                      <input
                        id="videoUrl"
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={(e) => handleChange(e, null, '', 'videoUrl')}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                    </div>
                    {formData.videoUrl && (
                      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h3>
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-md overflow-hidden">
                          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                            Video preview would appear here
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Description */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">2</span>
                      Lesson Description
                    </h2>
                    <div className="mb-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description
                        <span className="text-xs text-gray-500 ml-1">(Markdown supported)</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleChange(e, null, '', 'description')}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[200px]"
                        placeholder="Describe what students will learn in this lesson..."
                        required
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Preview</h3>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {formData.description || <span className="text-gray-400">Description preview will appear here</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Sections */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">3</span>
                      Lesson Sections
                    </h2>
                    <p className="text-gray-600 mb-6">Break your lesson into digestible sections with titles and content.</p>
                    
                    {formData.sections.map((section, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="mb-6 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-gray-700">Section {index + 1}</h3>
                          {formData.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={section.title}
                            onChange={(e) => handleChange(e, index, 'sections', 'title')}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Section title..."
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm text-gray-700 mb-1">Content</label>
                          <textarea
                            name="content"
                            value={section.content}
                            onChange={(e) => handleChange(e, index, 'sections', 'content')}
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[120px]"
                            placeholder="Detailed content for this section..."
                            required
                          />
                        </div>
                      </motion.div>
                    ))}

                    <button
                      type="button"
                      onClick={addNewSection}
                      className="flex items-center justify-center w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <FiPlus className="mr-2" /> Add New Section
                    </button>
                  </div>
                )}

                {/* Step 4: Quiz */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">4</span>
                      Lesson Quiz
                    </h2>
                    <p className="text-gray-600 mb-6">Add a quiz to test your students' understanding of the material.</p>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                      <input
                        type="text"
                        name="question"
                        value={formData.quiz.question}
                        onChange={(e) => handleChange(e, null, 'quiz', 'question')}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="What is the main concept covered in this lesson?"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options</label>
                      {formData.quiz.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.quiz.correctAnswer === index}
                            onChange={() => setFormData(prev => ({
                              ...prev,
                              quiz: {
                                ...prev.quiz,
                                correctAnswer: index
                              }
                            }))}
                            className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleChange(e, index, 'quiz', 'options')}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder={`Option ${index + 1}`}
                            required
                          />
                          {formData.quiz.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuizOption(index)}
                              className="ml-3 text-red-500 hover:text-red-700 transition p-2"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addNewQuizOption}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 mt-2 transition"
                      >
                        <FiPlus className="mr-1" /> Add another option
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
                >
                  <FiChevronLeft className="mr-2" /> Back
                </button>
              ) : (
                <div></div> // Empty div to maintain space
              )}
              
              {step < totalSteps ? (
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
                    'Saving...'
                  ) : (
                    <>
                      <FiEdit className="mr-2" /> Save Lesson
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

export default LessonForm;