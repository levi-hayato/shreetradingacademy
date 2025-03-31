import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { 
  FiClock, FiBook, FiUser, FiAward, 
  FiArrowRight, FiCheckCircle, FiBarChart2,
  FiVideo, FiFileText, FiCode, FiLayers
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const CourseIntro = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const navigate = useNavigate();
  const {courseID} = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        
        if (!courseID) {
          throw new Error('No course ID provided');
        }

        const courseRef = doc(db, 'courseData', courseID);
        const courseSnap = await getDoc(courseRef);

        if (!courseSnap.exists()) {
          throw new Error('Course not found');
        }

        setCourse({
          id: courseSnap.id,
          ...courseSnap.data()
        });
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseID]);

  const handleStartCourse = () => {
    if (course?.id) {
      navigate(`/content/${course.id}`);
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <FiVideo className="text-blue-500 mr-2" />;
      case 'reading': return <FiBook className="text-purple-500 mr-2" />;
      default: return <FiFileText className="text-gray-500 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  // Calculate total duration
  const totalDuration = course.chapters?.reduce((total, chapter) => {
    return total + (parseFloat(chapter.duration) || 0);
  }, 0) || 0;

  // Calculate total lessons
  const totalLessons = course.chapters?.reduce((total, chapter) => {
    return total + (chapter.lessons?.length || 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12"
        >
          <div className="md:flex">
            <div className="md:w-1/2 lg:w-2/5 relative">
              <img 
                className="w-full h-64 md:h-full object-cover"
                src={course.banner}
                alt={course.name}
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-md">
                  Stock Market
                </span>
              </div>
            </div>
            
            <div className="p-8 md:w-1/2 lg:w-3/5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded">
                    {course.level || 'All Levels'}
                  </span>
                  <h1 className="mt-3 text-3xl font-bold text-gray-900">{course.name}</h1>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow">
                    <img 
                      src="https://randomuser.me/api/portraits/men/1.jpg" 
                      alt={course.instructor}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{course.instructor}</span>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600 leading-relaxed">{course.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiClock className="text-indigo-500 mr-2" />
                  <span className="text-gray-700">{totalDuration.toFixed(2)} hours</span>
                </div>
                <div className="flex items-center">
                  <FiBook className="text-indigo-500 mr-2" />
                  <span className="text-gray-700">{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center">
                  <FiUser className="text-indigo-500 mr-2" />
                  <span className="text-gray-700">{course.enrolledStudents || 0} Students</span>
                </div>
                <div className="flex items-center">
                  <FiAward className="text-indigo-500 mr-2" />
                  <span className="text-gray-700">
                    {course.certificate ? 'Certificate' : 'No Certificate'}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartCourse}
                className="mt-8 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Learning Now <FiArrowRight className="inline ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
  {/* What You'll Learn */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white p-6 rounded-2xl shadow-md"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <FiBarChart2 className="text-indigo-500 mr-2" />
      What You'll Learn
    </h3>
    <ul className="space-y-3">
      {course.features?.map((item, index) => (
        <li key={index} className="flex items-start">
          <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>

        

          {/* Course Content Types */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiBook className="text-indigo-500 mr-2" />
              Course Includes
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiVideo className="text-indigo-500 mr-3" />
                <span className="text-gray-700">
                  {course.chapters?.reduce((total, chapter) => 
                    total + (chapter.lessons?.filter(l => l.type === 'video').length || 0), 0)} Video Lessons
                </span>
              </li>
              <li className="flex items-center">
                <FiFileText className="text-indigo-500 mr-3" />
                <span className="text-gray-700">
                  {course.chapters?.reduce((total, chapter) => 
                    total + (chapter.lessons?.filter(l => l.type === 'reading').length || 0), 0)} Reading Materials
                </span>
              </li>
              <li className="flex items-center">
                <FiAward className="text-indigo-500 mr-3" />
                <span className="text-gray-700">
                  {course.certificate ? 'Completion Certificate' : 'No Certificate'}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Course Curriculum */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden mb-12"
        >
          <h3 className="text-xl font-bold text-gray-800 p-6 border-b">Course Curriculum</h3>
          
          <div className="divide-y">
            {course.chapters?.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="p-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveChapter(activeChapter === chapterIndex ? -1 : chapterIndex)}
                >
                  <h4 className="text-lg font-medium text-gray-800">
                    {chapter.title}
                  </h4>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-4">{chapter.duration}</span>
                    <span className="text-sm text-gray-500">{chapter.lessons?.length || 0} lessons</span>
                  </div>
                </div>
                
                {activeChapter === chapterIndex && (
                  <div className="mt-4 space-y-3">
                    {chapter.lessons?.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                        {getLessonIcon(lesson.type)}
                        <div className="flex-1">
                          <h5 className="text-gray-800">{lesson.title}</h5>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Preview
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructor Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden mb-12"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">About the Instructor</h3>
            <div className="flex flex-col md:flex-row items-start">
              <img 
                src="https://randomuser.me/api/portraits/men/1.jpg" 
                alt={course.instructor}
                className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <h4 className="text-lg font-bold text-gray-800">{course.instructor}</h4>
                <p className="text-gray-600 mt-2">
                  Experienced stock market professional with over 10 years of trading experience. 
                  Specialized in technical analysis and portfolio management.
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex text-yellow-400">
                    ★ ★ ★ ★ ★
                  </div>
                  <span className="text-sm text-gray-500 ml-2">4.9 instructor rating</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  1,245 students • 5 courses
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Learning?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join {course.enrolledStudents || 0}+ students who have already enrolled in this course and are transforming their trading skills.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartCourse}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Enroll Now & Start Learning <FiArrowRight className="inline ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseIntro;