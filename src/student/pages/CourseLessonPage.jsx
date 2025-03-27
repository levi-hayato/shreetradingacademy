import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBook, FiFileText, FiAward, FiLoader, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const CourseLessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lesson');
  const [courseData, setCourseData] = useState({
    title: '',
    instructor: '',
    progress: 0,
    lessons: [],
    resources: [],
    assignments: []
  });
  const [lessonContent, setLessonContent] = useState({
    title: '',
    sections: [],
    quiz: { question: '', options: [], correctAnswer: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course document
        const courseRef = doc(db, 'courseData', courseId);
        const courseSnap = await getDoc(courseRef);

        if (!courseSnap.exists()) {
          throw new Error('Course not found');
        }

        const course = {
          id: courseSnap.id,
          title: courseSnap.data().title || 'Untitled Course',
          instructor: courseSnap.data().instructor || 'Unknown Instructor',
          progress: courseSnap.data().progress || 0,
          lessons: courseSnap.data().lessons || [],
          resources: courseSnap.data().resources || [],
          assignments: courseSnap.data().assignments || []
        };
        setCourseData(course);

        // Determine which lesson to load
        const targetLessonId = lessonId || courseSnap.data().currentLessonId || 
                             (courseSnap.data().lessons?.[0]?.id || null);

        if (targetLessonId) {
          const lessonRef = doc(db, 'lessons', targetLessonId);
          const lessonSnap = await getDoc(lessonRef);

          if (lessonSnap.exists()) {
            const lesson = {
              id: lessonSnap.id,
              title: lessonSnap.data().title || 'Untitled Lesson',
              sections: lessonSnap.data().sections || [],
              quiz: lessonSnap.data().quiz || { question: '', options: [], correctAnswer: 0 }
            };
            setLessonContent(lesson);
          }
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-blue-600 mb-4" />
        <p className="text-lg text-gray-700">Loading course content...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center">
          <FiAlertCircle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
              onClick={() => navigate('/')}
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseHeader 
        title={courseData.title} 
        instructor={courseData.instructor} 
      />
      
      <div className="flex flex-col md:flex-row">
        {sidebarOpen && (
          <LessonSidebar 
            lessons={courseData.lessons} 
            currentLessonId={lessonContent?.id} 
            onLessonSelect={handleLessonSelect} 
          />
        )}
        
        <main className="flex-1 p-4 md:p-6">
          <CourseProgress progress={courseData.progress || 0} />
          
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              className={`pb-2 px-4 font-medium flex items-center ${
                activeTab === 'lesson' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('lesson')}
            >
              <FiBook className="mr-2" />
              Lesson
            </button>
            <button
              className={`pb-2 px-4 font-medium flex items-center ${
                activeTab === 'resources' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              <FiFileText className="mr-2" />
              Resources
            </button>
            <button
              className={`pb-2 px-4 font-medium flex items-center ${
                activeTab === 'assignments' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('assignments')}
            >
              <FiAward className="mr-2" />
              Assignments
            </button>
          </div>
          
          {activeTab === 'lesson' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {lessonContent ? (
                <LessonContent 
                  title={lessonContent.title || 'Untitled Lesson'} 
                  content={lessonContent} 
                />
              ) : (
                <div className="p-8 text-center">
                  <FiBook className="mx-auto text-3xl text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Lesson Selected</h3>
                  <p className="text-gray-500">Please select a lesson from the sidebar</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ResourcesPanel 
                resources={courseData.resources} 
                loading={loading}
              />
            </div>
          )}
          
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {courseData.assignments?.length > 0 ? (
                courseData.assignments.map(assignment => (
                  <AssignmentCard 
                    key={assignment.id || assignment.title} 
                    assignment={assignment} 
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <FiAward className="mx-auto text-3xl text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Assignments</h3>
                  <p className="text-gray-500">This course doesn't have any assignments yet</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseLessonPage;