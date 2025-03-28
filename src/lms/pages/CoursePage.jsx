import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { MainLayout } from '../components/Layout/MainLayout';
import CourseHeader from '../components/Course/CourseHeader';
import LessonCard from '../components/Course/LessonCard';
import ResourceCard from '../components/Course/ResourceCard';
import {
  FiDownload, FiBookOpen, FiCode, FiFileText, FiClock,
  FiPlay, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CoursePage = ({ setIsInstructor }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState([0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courseData'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setSelectedCourse(coursesData[0]);
        }
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLessonClick = (chapterIndex, lessonIndex) => {
    if (!selectedCourse || !selectedCourse.chapters?.[chapterIndex]?.lessons?.[lessonIndex]) {
      console.error("Invalid lesson selection");
      return;
    }

    setActiveChapter(chapterIndex);
    setActiveLesson(lessonIndex);
    if (isMobile) setSidebarOpen(false);

    // Mark lesson as started if not already
    const updatedCourses = [...courses];
    if (
      updatedCourses[chapterIndex]?.lessons?.[lessonIndex] &&
      !updatedCourses[chapterIndex].lessons[lessonIndex].started
    ) {
      updatedCourses[chapterIndex].lessons[lessonIndex].started = true;
      setCourses(updatedCourses);
    }
  };

  const goToNextChapter = () => {
    if (!selectedCourse?.chapters) return;

    const nextChapter = activeChapter + 1;
    if (nextChapter < selectedCourse.chapters.length) {
      setActiveChapter(nextChapter);
      setActiveLesson(0); // Reset to first lesson of new chapter
      setExpandedChapters(prev => [...prev, nextChapter]); // Expand new chapter
    }
  };

  const goToPrevChapter = () => {
    const prevChapter = activeChapter - 1;
    if (prevChapter >= 0) {
      setActiveChapter(prevChapter);
      setActiveLesson(0); // Reset to first lesson of previous chapter
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
    setActiveLesson(0); // Reset to first lesson of new chapter
    setExpandedChapters(prev => [...prev, nextChapterIndex]); // Expand new chapter
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

  if (!selectedCourse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold text-gray-800">No Course Available</h2>
          <p className="mt-2 text-gray-600">Please check back later or contact support.</p>
          <button onClick={() => { navigate("/") }} className=' px-4 py-2 mt-3 bg-btn text-white font-bold rounded-xl' >Go Back</button>
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

      <main className="p-6">
        {selectedCourse.chapters?.[activeChapter] && (
          <div>
            {/* Chapter Navigation Buttons */}
            

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCourse.chapters[activeChapter].title} {selectedCourse.chapters[activeChapter].lessons?.title}
                </h2>
                <p className="text-gray-400 flex items-center">
                  <FiClock className="mr-1" />
                  {selectedCourse.chapters[activeChapter].duration}
                  <p className='mx-3 '>• {selectedCourse.chapters[activeChapter].lessons?.length || 0} items</p>
                </p>
              </div>
              <button
                className="md:hidden flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                onClick={() => setSidebarOpen(true)}
              >
                <FiPlay className="mr-2" /> View Chapters
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {selectedCourse.chapters[activeChapter].lessons?.map((lesson, lessonIndex) => (
                <LessonCard
                  key={lessonIndex}
                  lesson={lesson}
                  onClick={handleLessonClick}
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
            <div className="flex justify-between mt-6 px-2">
              <button
                onClick={goToPrevChapter}
                disabled={activeChapter === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${activeChapter === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <FiChevronLeft className="mr-2" />
                <div className='hidden md:block'>Previous Chapter</div>
              </button>

              <button
                onClick={goToNextChapter}
                disabled={activeChapter === selectedCourse.chapters.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg ${activeChapter === selectedCourse.chapters.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <div className='hidden md:block'>Next Chapter</div>

                <FiChevronRight className="ml-2" />
              </button>
            </div>

            <div className="mt-12">
              <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
                <FiDownload className="mr-2" /> Chapter Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        )}
        
      </main>
    </MainLayout>
  );
};

export default CoursePage;