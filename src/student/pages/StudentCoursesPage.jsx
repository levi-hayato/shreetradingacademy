import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FaBookOpen, 
  FaChartLine,
  FaWallet,
  FaCertificate,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaUserGraduate
} from 'react-icons/fa';
import { GiGraduateCap, GiMoneyStack } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsersViewfinder } from 'react-icons/fa6';

const StudentCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeCourse, setActiveCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          const paymentsRef = collection(db, 'payments');
          const q = query(paymentsRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          
          const courses = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure all required fields exist with fallback values
            courses.push({
              id: doc.id,
              course: data.course || 'Untitled Course',
              courseId: data.courseId || '',
              date: data.date?.toDate() || new Date(),
              email: data.email || user.email,
              name: data.name || 'Student',
              price: data.price || 0,
              status: data.status || 'active',
              uid: data.uid || user.uid,
              transactionId: data.transactionId || 'N/A'
            });
          });
          
          setEnrolledCourses(courses);
          if (courses.length > 0) setActiveCourse(courses[0]);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching enrolled courses:', err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCourses = enrolledCourses.filter(course => {
    // Safely handle course.course being undefined
    const courseName = course.course || '';
    const matchesSearch = courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (course.status || 'active') === filter;
    return matchesSearch && matchesFilter;
  });

  // Rest of the component remains the same...
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <GiGraduateCap className="mx-auto text-5xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Courses Enrolled</h2>
          <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-md"
          >
            Browse Available Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">View and manage all your enrolled courses</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Enrolled Courses ({filteredCourses.length})</h2>
            <div className="space-y-3">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    onClick={() => setActiveCourse(course)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      activeCourse?.id === course.id
                        ? 'bg-white shadow-lg border-l-4 border-blue-500'
                        : 'bg-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{course.course}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : course.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      <span>{formatDate(course.date)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <FaRupeeSign className="mr-2" />
                      <span>{course.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse?.id || 'empty'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {activeCourse ? (
                  <>
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <h2 className="text-2xl font-bold">{activeCourse.course}</h2>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="flex items-center">
                          <FaUserGraduate className="mr-2" /> {activeCourse.name}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-2" /> Enrolled: {formatDate(activeCourse.date)}
                        </span>
                        <span className="flex items-center">
                          <GiMoneyStack className="mr-2" /> ₹{activeCourse.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                            <FaWallet className="text-blue-500 mr-2" /> Payment Details
                          </h3>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="text-gray-500">Transaction ID:</span>{' '}
                              <span className="font-mono">{activeCourse.transactionId}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Status:</span>{' '}
                              <span className={`font-medium ${
                                activeCourse.status === 'completed'
                                  ? 'text-green-600'
                                  : activeCourse.status === 'pending'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                              }`}>
                                {activeCourse.status}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                            <FaChartLine className="text-blue-500 mr-2" /> Course Progress
                          </h3>
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  activeCourse.coursestatus === 'completed'
                                    ? 'bg-green-500 w-full'
                                    : activeCourse.coursestatus === 'pending'
                                    ? 'bg-yellow-500 w-1/3'
                                    : 'bg-blue-500 w-2/3'
                                }`}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activeCourse.coursestatus === 'completed'
                                ? '100% Completed'
                                : activeCourse.coursestatus === 'pending'
                                ? 'Pending activation'
                                : 'In progress'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => navigate(`/content/${activeCourse.courseId}`)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FaBookOpen className="mr-2" /> Course Content
                        </button>
                        <button
                        onClick={() => navigate(`/student/course/${activeCourse.courseId}`)}
                        className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center">
                            <FaUsersViewfinder className="mr-2" /> View Course
                          </button>
                        {activeCourse.coursestatus === 'completed' && (
                          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center">
                            <FaCertificate className="mr-2" /> Get Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Select a course to view details
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesPage;