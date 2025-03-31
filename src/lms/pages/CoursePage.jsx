import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { MainLayout } from '../components/Layout/MainLayout';
import CourseHeader from '../components/Course/CourseHeader';
import LessonCard from '../components/Course/LessonCard';
import ResourceCard from '../components/Course/ResourceCard';
import {
  FiDownload, FiBookOpen, FiCode, FiFileText, FiClock,
  FiPlay, FiChevronLeft, FiChevronRight, FiBook
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const CoursePage = ({ setIsInstructor }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { courseID } = useParams();

  // Check screen size and adjust sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
      if (!mobile) setSidebarCollapsed(false);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch course data when courseID changes
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseID) {
          throw new Error('No course ID provided');
        }

        const docRef = doc(db, 'courseData', courseID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSelectedCourse({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          throw new Error('Course not found');
        }
      } catch (err) {
        console.error("Error fetching course: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseID) {
      fetchCourse();
    }
  }, [courseID]);

  const handleLessonClick = (chapterIndex, lessonIndex) => {
    if (!selectedCourse?.chapters?.[chapterIndex]?.lessons?.[lessonIndex]) {
      console.error("Invalid lesson selection");
      return;
    }

    setActiveChapter(chapterIndex);
    setActiveLesson(lessonIndex);
    if (isMobile) setSidebarOpen(false);
  };

  const goToNextChapter = () => {
    if (!selectedCourse?.chapters) return;

    const nextChapter = activeChapter + 1;
    if (nextChapter < selectedCourse.chapters.length) {
      setActiveChapter(nextChapter);
      setActiveLesson(0);
      setExpandedChapters(prev => [...prev, nextChapter]);
    }
  };

  const goToPrevChapter = () => {
    const prevChapter = activeChapter - 1;
    if (prevChapter >= 0) {
      setActiveChapter(prevChapter);
      setActiveLesson(0);
    }
  };

  const getLessonIcon = (type) => {
    const iconClass = "text-white text-lg";
    switch (type) {
      case 'video': return <FiPlay className={iconClass} />;
      case 'reading': return <FiBookOpen className={iconClass} />;
      case 'assignment': return <FiCode className={iconClass} />;
      default: return <FiBook className={iconClass} />;
    }
  };

  const getLessonIconColor = (type) => {
    switch (type) {
      case 'video': return 'bg-blue-500';
      case 'reading': return 'bg-purple-500';
      case 'assignment': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNextLesson = (chapterIndex, nextLessonIndex) => {
    setActiveChapter(chapterIndex);
    setActiveLesson(nextLessonIndex);
  };

  const handleNextChapter = (nextChapterIndex) => {
    setActiveChapter(nextChapterIndex);
    setActiveLesson(0);
    setExpandedChapters(prev => [...prev, nextChapterIndex]);
  };

  const calculateCourseProgress = () => {
    if (!selectedCourse?.chapters) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    selectedCourse.chapters.forEach(chapter => {
      chapter.lessons?.forEach(lesson => {
        totalLessons++;
        if (lesson.completed) completedLessons++;
      });
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Error Loading Course</h2>
          <p className="text-gray-600 mb-6">{error || 'Course data not available'}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      isMobile={isMobile}
      selectedCourse={selectedCourse}
      setIsInstructor={setIsInstructor}
      activeChapter={activeChapter}
      setActiveChapter={setActiveChapter}
      activeLesson={activeLesson}
      setActiveLesson={setActiveLesson}
      expandedChapters={expandedChapters}
      setExpandedChapters={setExpandedChapters}
    >
      <CourseHeader
        selectedCourse={selectedCourse}
        progress={calculateCourseProgress()}
      />

      <main className="p-4 md:p-6">
        {selectedCourse.chapters?.[activeChapter] ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCourse.chapters[activeChapter].title}
                </h2>
                <p className="text-gray-500 flex items-center mt-1">
                  <FiClock className="mr-1" />
                  {selectedCourse.chapters[activeChapter].duration}
                  <span className="mx-3">• {selectedCourse.chapters[activeChapter].lessons?.length || 0} items</span>
                </p>
              </div>
              <button
                className="md:hidden flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                onClick={() => setSidebarOpen(true)}
              >
                <FiPlay className="mr-2" /> View Chapters
              </button>
            </div>

            {selectedCourse.chapters[activeChapter].lessons?.length > 0 ? (
              <div className="space-y-4">
                {selectedCourse.chapters[activeChapter].lessons.map((lesson, lessonIndex) => (
                  <LessonCard
                    key={lessonIndex}
                    lesson={lesson}
                    onClick={() => handleLessonClick(activeChapter, lessonIndex)}
                    getLessonIcon={getLessonIcon}
                    getLessonIconColor={getLessonIconColor}
                    isCurrentLesson={activeLesson === lessonIndex}
                    chapterIndex={activeChapter}
                    lessonIndex={lessonIndex}
                    totalLessonsInChapter={selectedCourse.chapters[activeChapter].lessons.length}
                    totalChapters={selectedCourse.chapters.length}
                    onNextLesson={handleNextLesson}
                    onNextChapter={handleNextChapter}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No lessons available in this chapter</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrevChapter}
                disabled={activeChapter === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  activeChapter === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <FiChevronLeft className="mr-2" />
                <span className="hidden md:inline">Previous Chapter</span>
              </button>

              <button
                onClick={goToNextChapter}
                disabled={activeChapter === selectedCourse.chapters.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  activeChapter === selectedCourse.chapters.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <span className="hidden md:inline">Next Chapter</span>
                <FiChevronRight className="ml-2" />
              </button>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                <FiDownload className="mr-2" /> Chapter Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ResourceCard
                  title="Lecture Slides"
                  type="PDF Document"
                  icon={<FiFileText className="text-indigo-600" />}
                  size="2.4 MB"
                />
                <ResourceCard
                  title="Source Code"
                  type="ZIP Archive"
                  icon={<FiCode className="text-indigo-600" />}
                  size="5.1 MB"
                />
                <ResourceCard
                  title="Reading Materials"
                  type="External Link"
                  icon={<FiBookOpen className="text-indigo-600" />}
                  size="Webpage"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No chapter data available</p>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

CoursePage.propTypes = {
  setIsInstructor: PropTypes.func.isRequired
};

export default CoursePage;