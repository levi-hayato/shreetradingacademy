import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FaBookOpen, 
  FaCalendarAlt, 
  FaClock, 
  FaRupeeSign, 
  FaUserGraduate,
  FaIdBadge
} from 'react-icons/fa';
import { GiGraduateCap } from 'react-icons/gi';

const StudentCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // Query students collection by email
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const courseData = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              courseData.push({
                id: doc.id,
                courseName: data.course,
                dateJoined: data.dateJoined,
                duration: data.duration,
                price: data.price,
                studentId: data.studentId,
                photo: data.photo
              });
            });
            setCourses(courseData);
          }
          setLoading(false);
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError('Failed to load course data');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const calculateCompletion = (dateJoined, duration) => {
    if (!dateJoined || !duration) return 'N/A';
    
    try {
      const joinDate = dateJoined.toDate ? dateJoined.toDate() : new Date(dateJoined);
      const months = parseInt(duration);
      if (isNaN(months)) return 'N/A';
      
      const endDate = new Date(joinDate);
      endDate.setMonth(joinDate.getMonth() + months);
      
      const today = new Date();
      const totalDays = (endDate - joinDate) / (1000 * 60 * 60 * 24);
      const daysCompleted = (today - joinDate) / (1000 * 60 * 60 * 24);
      
      if (today > endDate) return 'Completed';
      
      const percentage = Math.min(100, Math.round((daysCompleted / totalDays) * 100));
      return `${percentage}% Completed`;
    } catch (error) {
      console.error('Error calculating completion:', error);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <GiGraduateCap className="mx-auto text-5xl text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Courses Enrolled</h2>
          <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet.</p>
          <button 
            onClick={() => window.location.href = '/courses'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-md"
          >
            Browse Available Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'current' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Current Courses
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'completed' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <FaBookOpen className="text-white text-6xl opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-xl font-bold text-white">{course.courseName}</h3>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    {course.photo ? (
                      <img 
                        src={course.photo} 
                        alt="Student" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaUserGraduate className="text-gray-500 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-900">{course.studentId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Enrolled On</p>
                      <p className="font-medium">{formatDate(course.dateJoined)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaClock className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaRupeeSign className="text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Course Fee</p>
                      <p className="font-medium">₹{course.price}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-indigo-600">
                        {calculateCompletion(course.dateJoined, course.duration)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full" 
                        style={{ 
                          width: calculateCompletion(course.dateJoined, course.duration).includes('%') 
                            ? calculateCompletion(course.dateJoined, course.duration)
                            : '100%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                    View Course
                  </button>
                  <button className="flex-1 py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    Resources
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm">
            View All Learning Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesPage;