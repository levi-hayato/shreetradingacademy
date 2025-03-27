import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Your Firebase config
import { FaStar, FaClock, FaRupeeSign, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.features.includes(activeTab));

  const courseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-[#f8f9fa] to-[#e9ecef] py-12 px-4 sm:px-6 lg:px-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#2d3748] mb-4">Our Courses</h1>
          <p className="text-lg text-[#4a5568] max-w-3xl mx-auto">
            Master the stock market with our expert-curated courses designed for all skill levels
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'Price Action', 'Technical analysis', 'Beginner level', 'Market Knowledge'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium ${
                activeTab === tab
                  ? 'bg-[#6254f3] text-white'
                  : 'bg-white text-[#4a5568] hover:bg-gray-100'
              } shadow-sm`}
            >
              {tab === 'all' ? 'All Courses' : tab}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6254f3]"></div>
          </div>
        ) : (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={courseVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.banner}
                      alt={course.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-xl">{course.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-600">4.8 (120 reviews)</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-[#6254f3]/10 text-[#6254f3] text-xs px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-lg font-bold text-[#6254f3]">
                        <FaRupeeSign className="inline mr-1" />
                        {course.price}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Course Modal */}
            {/* Course Modal */}
{selectedCourse && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      {/* Custom scroll container to hide scrollbar */}
      <div className="overflow-y-auto scrollbar-hide flex-1">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-end">
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Course Banner with decorative elements */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={selectedCourse.banner}
            alt={selectedCourse.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {selectedCourse.name}
            </h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center mr-4 text-white/90">
                <FaStar className="text-yellow-300 mr-1" />
                <span>4.8 (120 reviews)</span>
              </div>
              <div className="flex items-center text-white/90">
                <FaClock className="mr-1" />
                <span>{selectedCourse.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/50" />
        </div>

        {/* Course Content */}
        <div className="p-6 sm:p-8">
          {/* Price and CTA - Sticky at bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 sm:-mx-8 px-6 sm:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-[#6254f3]">
                  <FaRupeeSign className="inline mr-1" />
                  {selectedCourse.price}
                  <span className="text-sm font-normal text-gray-500 ml-2">one-time payment</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-[#6254f3] to-[#a04ff3] text-white font-bold py-3 px-8 rounded-lg mt-3 sm:mt-0 shadow-lg hover:shadow-xl transition-all"
              >
                Enroll Now
              </motion.button>
            </div>
          </div>

          {/* Course Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaBookOpen className="text-[#6254f3] mr-2" />
              Course Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedCourse.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaChartLine className="text-[#6254f3] mr-2" />
              What You'll Learn
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCourse.features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-gray-50 p-4 rounded-lg"
                >
                  <div className="bg-[#6254f3]/10 p-1 rounded-full mr-3">
                    <svg
                      className="h-5 w-5 text-[#6254f3]"
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
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Decorative elements */}
          <div className="relative">
            <div className="absolute -left-8 top-1/2 w-16 h-16 bg-[#6254f3]/10 rounded-full blur-lg" />
            <div className="absolute -right-8 bottom-1/2 w-16 h-16 bg-[#a04ff3]/10 rounded-full blur-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;