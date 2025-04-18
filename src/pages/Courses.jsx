import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FaStar, FaClock, FaRupeeSign, FaChartLine, FaBookOpen, FaSearch, FaTimes, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courseData'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          features: doc.data().features || []
        }));
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesTab = activeTab === 'all' || 
      (course.features && 
       Array.isArray(course.features) && 
       course.features.includes(activeTab));
    
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const courseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 } 
    }
  };

  const getCourseFeatures = (course) => {
    return course?.features || [];
  };

  const popularTags = ['Price Action', 'Technical analysis', 'Beginner level', 'Market Knowledge', 'Trading', 'Investing'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Master the <span className="text-indigo-600">Stock Market</span>
          </motion.h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expert-curated courses designed to take you from beginner to pro trader
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {popularTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tag)}
                className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base ${
                  activeTab === tag
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                } transition-all flex items-center`}
              >
                {tag}
                {activeTab === tag && (
                  <motion.span 
                    className="ml-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {/* All Courses Button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600'
              } transition-colors`}
            >
              Show all courses
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"
            ></motion.div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <motion.div 
              className="mb-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredCourses.length}</span> 
                {filteredCourses.length === 1 ? ' course' : ' courses'}
                {activeTab !== 'all' && ` in "${activeTab}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 px-4">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    variants={courseVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.banner || '/default-course-banner.jpg'}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {course.level || 'All Levels'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-xl drop-shadow-md">{course.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-4">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-600">4.8 (120)</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-1 text-sm" />
                          <span className="text-sm">{course.duration || 'N/A'} Months</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getCourseFeatures(course).slice(0, 3).map((feature, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full"
                          >
                            {feature}
                          </motion.span>
                        ))}
                        {getCourseFeatures(course).length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                            +{getCourseFeatures(course).length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto flex justify-between items-center">
                        <div className="text-lg font-bold text-indigo-600">
                          <FaRupeeSign className="inline mr-1" />
                          {course.price || 'Free'}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourse(course);
                          }}
                        >
                          View details
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery 
                    ? `We couldn't find any courses matching "${searchQuery}"`
                    : `No courses available in the "${activeTab}" category`}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View all courses
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Course Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="overflow-y-auto flex-1">
                  {/* Header with close button */}
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{selectedCourse.name}</h2>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Course Banner with Play Button */}
                  <div className="relative h-64 md:h-80 overflow-hidden group">
                    <img
                      src={selectedCourse.banner || '/default-course-banner.jpg'}
                      alt={selectedCourse.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/90 hover:bg-white text-indigo-600 rounded-full p-4 shadow-lg"
                        onClick={() => navigate(`/course/${selectedCourse.id}`)}
                      >
                        <FaPlay className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 sm:p-8">
                    {/* Course Stats */}
                    <div className="flex flex-wrap gap-6 mb-8">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <FaStar className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rating</p>
                          <p className="font-bold">4.8 (120 reviews)</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <FaClock className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-bold">{selectedCourse.duration || 'N/A'} Months</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <FaChartLine className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Level</p>
                          <p className="font-bold">{selectedCourse.level || 'All Levels'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaBookOpen className="text-indigo-600 mr-2" />
                        About This Course
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCourse.description || 'No description available'}
                      </p>
                    </div>

                    {/* What You'll Learn */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaChartLine className="text-indigo-600 mr-2" />
                        What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCourseFeatures(selectedCourse).length > 0 ? (
                          getCourseFeatures(selectedCourse).map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
                                <svg
                                  className="h-4 w-4 text-indigo-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-gray-700">{feature}</span>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500">No features listed for this course</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer with Price and CTA */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                      <div className="text-2xl font-bold text-indigo-600">
                        <FaRupeeSign className="inline mr-1" />
                        {selectedCourse.price || 'Free'}
                      </div>
                      <p className="text-sm text-gray-500">One-time payment • Lifetime access</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 sm:w-auto px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                        onClick={() => setSelectedCourse(null)}
                      >
                        Learn More
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                        onClick={() => navigate(`/course/${selectedCourse.id}`)}
                      >
                        Enroll Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursesPage;