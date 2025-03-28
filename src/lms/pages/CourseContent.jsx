import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBook, FiAward, FiFileText, FiCheckCircle,
  FiChevronDown, FiChevronRight, FiHome,
  FiUsers, FiSettings, FiBarChart2, FiX,
  FiMenu, FiPlay, FiBookOpen, FiCode,
  FiDownload, FiClock, FiPercent
} from 'react-icons/fi';

function App() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [expandedChapters, setExpandedChapters] = useState([0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
      // Start with expanded sidebar on desktop by default
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
          setIsLoading(false);
        }
      };
      fetchCourses();
    }, []);

  // Rest of your existing code...
   const toggleChapter = (index) => {
      if (expandedChapters.includes(index)) {
        setExpandedChapters(expandedChapters.filter(i => i !== index));
      } else {
        setExpandedChapters([...expandedChapters, index]);
      }
    };
  
    if (isInstructor) {
      return <InstructorDashboard />;
    }
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading your courses...</p>
          </div>
        </div>
      );
    }
  
    if (!selectedCourse) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <FiBook className="mx-auto h-12 w-12 text-indigo-500" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">No Courses Available</h2>
            <p className="mt-2 text-gray-600">There are no courses to display at the moment.</p>
            <button
              onClick={() => setIsInstructor(true)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Become an Instructor
            </button>
          </div>
        </div>
      );
    }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Mobile Sidebar Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-8 right-10 z-30 bg-white p-2 rounded-lg"
        >
          <FiMenu className="text-gray-700" size={25}/>
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <>
            <motion.div 
              className={`fixed md:relative z-20 ${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white shadow-xl h-screen flex flex-col transition-all duration-300`}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Sidebar Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200">
                {sidebarCollapsed ? (
                  <FiBook className="text-xl text-indigo-600 mx-auto" />
                ) : (
                  <h1 className="text-xl font-bold text-indigo-600">LearnHub</h1>
                )}
                <div className="flex items-center">
                  {!isMobile && (
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 mr-2"
                    >
                      {sidebarCollapsed ? '»' : '«'}
                    </button>
                  )}
                  {isMobile && (
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                    >
                      <FiX className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2">
                  {[
                    { icon: <FiHome />, text: "Dashboard" },
                    { icon: <FiBook />, text: "My Courses", active: true },
                    { icon: <FiAward />, text: "Certificates" },
                    { icon: <FiUsers />, text: "Community" },
                    { icon: <FiBarChart2 />, text: "Progress" },
                    { icon: <FiSettings />, text: "Settings" }
                  ].map((item, index) => (
                    <SidebarItem 
                      key={index}
                      icon={item.icon}
                      text={item.text}
                      active={item.active}
                      collapsed={sidebarCollapsed}
                    />
                  ))}
                </nav>
                
                {!sidebarCollapsed && (
                  <div className="px-4 mt-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Course Chapters
                    </h2>
                    
                    <div className="mt-2 space-y-1">
                      {selectedCourse.chapters?.map((chapter, index) => (
                        <div key={index} className="mb-1">
                          <button
                            onClick={() => toggleChapter(index)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                              activeChapter === index 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                                activeChapter === index 
                                  ? 'bg-indigo-100 text-indigo-600 font-medium' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="truncate text-sm font-medium">{chapter.title}</span>
                            </div>
                            <FiChevronDown 
                              size={16} 
                              className={`text-gray-500 transition-transform ${
                                expandedChapters.includes(index) ? 'rotate-0' : '-rotate-90'
                              }`}
                            />
                          </button>
                          
                          {expandedChapters.includes(index) && (
                            <div className="ml-8 mt-1 space-y-1">
                              {chapter.lessons?.map((lesson, lessonIndex) => (
                                <button
                                  key={lessonIndex}
                                  onClick={() => {
                                    setActiveChapter(index);
                                    if (isMobile) setSidebarOpen(false);
                                  }}
                                  className={`w-full text-left p-2 pl-3 rounded-lg flex items-center text-sm ${
                                    activeChapter === index 
                                      ? 'text-indigo-600 font-medium' 
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="w-5 h-5 flex items-center justify-center mr-2">
                                    {lesson.completed ? (
                                      <FiCheckCircle className="text-green-500" />
                                    ) : (
                                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    )}
                                  </span>
                                  <span className="truncate">{lesson.title}</span>
                                  <span className="ml-auto text-xs text-gray-400 flex items-center">
                                    <FiClock className="mr-1" /> {lesson.duration}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Instructor Mode Button */}
              {!sidebarCollapsed && (
                <div className="p-4 border-t border-gray-200">
                  <button 
                    onClick={() => setIsInstructor(true)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    Instructor Mode
                  </button>
                </div>
              )}
            </motion.div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 z-10"
                onClick={() => setSidebarOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
        !isMobile && sidebarOpen && !sidebarCollapsed ? 'ml-72 md:ml-0' : 
        !isMobile && sidebarCollapsed ? 'ml-20 md:ml-0' : 'ml-0'
      }`}>
        {/* Rest of your main content remains the same */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-0">
            <div>
              <h1 className="md:text-2xl text-xl font-bold text-gray-800">{selectedCourse.title}</h1>
              <p className="text-sm text-gray-600">Instructor: {selectedCourse.instructor}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${selectedCourse.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                    <FiPercent className="mr-1" /> {selectedCourse.progress || 0}%
                  </span>
                </div>
              </div>
              
              <button className="hidden md:flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
                <FiPlay className="mr-2" /> Continue
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* <img src={selectedCourse.thumbnail} alt="" /> */}
                  {selectedCourse.chapters?.[activeChapter] && (
                    <div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{selectedCourse.chapters[activeChapter].title}</h2>
                          <p className="text-gray-600 flex items-center">
                            <FiClock className="mr-1" /> {selectedCourse.chapters[activeChapter].duration} • 
                            {selectedCourse.chapters[activeChapter].lessons?.length || 0} items
                          </p>
                        </div>
                        <button className="md:hidden flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
                          <FiPlay className="mr-2" /> Continue Learning
                        </button>
                      </div>
        
                      <div className="grid grid-cols-1 gap-6">
                        {selectedCourse.chapters[activeChapter].lessons?.map((lesson, index) => (
                          <motion.div
                            key={index}
                            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                              lesson.completed ? 'border-l-4 border-green-400' : 'border-l-4 border-indigo-300'
                            }`}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Progress indicator ribbon */}
                            {lesson.completed && (
                              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                COMPLETED
                              </div>
                            )}
        
                            <div className="p-6 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-5">
                              {/* Icon with gradient background */}
                              <div className={`relative flex-shrink-0 ${getLessonIconColor(lesson.type)} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}>
                                {getLessonIcon(lesson.type)}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                              </div>
        
                              {/* Lesson content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {lesson.title}
                                  </h3>
                                  {/* {!lesson.completed && (
                                    <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      New
                                    </span>
                                  )} */}
                                </div>
        
                                {/* Metadata */}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <FiClock className="mr-1.5 text-indigo-400" />
                                    {lesson.duration}
                                  </span>
                                  <span className="flex items-center capitalize">
                                    <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                      lesson.type === 'video' ? 'bg-blue-400' :
                                      lesson.type === 'reading' ? 'bg-purple-400' :
                                      'bg-orange-400'
                                    }`}></span>
                                    {lesson.type}
                                  </span>
                                  {lesson.resources && (
                                    <span className="flex items-center">
                                      <FiFileText className="mr-1.5 text-indigo-400" />
                                      {lesson.resources} resources
                                    </span>
                                  )}
                                </div>
        
                                {/* Description (optional) */}
                                {lesson.description && (
                                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
        
                              {/* Action button */}
                              <motion.button
                              onclick={() => {  setActiveChapter(index);}}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                  lesson.completed
                                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200'
                                    : 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200'
                                } shadow-sm hover:shadow-md`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {lesson.completed ? (
                                  <>
                                    <FiCheckCircle className="mr-2" />
                                    <span className="hidden md:inline">Reviewed</span>
                                  </>
                                ) : (
                                  <>
                                  
                                    <FiPlay className="mr-2" />
                                    <span className="hidden md:inline">Next Lesson</span>
                                  </>
                                )}
                              </motion.button>
                            </div>
        
                            {/* Progress bar (for in-progress lessons) */}
                            {!lesson.completed && lesson.progress > 0 && (
                              <div className="px-6 pb-4 pt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      lesson.type === 'video' ? 'bg-blue-500' :
                                      lesson.type === 'reading' ? 'bg-purple-500' :
                                      'bg-orange-500'
                                    }`}
                                    style={{ width: `${lesson.progress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                  {lesson.progress}% completed
                                </div>
                              </div>
                            )}
                        
                            <div className='px-6 py-4 bg-white border-t border-gray-200 md:m-10'>
                                <h1 className='text-lg font-semibold text-gray-800'>Content</h1>
                                <div className='text-sm text-gray-600 mt-2 overflow-hidden'>
                                {lesson.content || "Content"}
                                <img src={selectedCourse.thumbnail} alt="" />
                                </div>
                            </div>
                          </motion.div>
                          
                        ))}
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
      </div>
    </div>
  );
}

// Updated Sidebar Item Component for collapsed state
function SidebarItem({ icon, text, active, collapsed }) {
  return (
    <button
      className={`w-full flex items-center p-3 mx-2 rounded-lg transition-colors ${
        active ? 'bg-indigo-50 text-indigo-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="ml-3">{text}</span>}
    </button>
  );
}

// Resource Card Component
function ResourceCard({ title, type, icon, size }) {
    return (
      <motion.div 
        className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-all bg-white hover:shadow-md"
        whileHover={{ y: -3 }}
      >
        <div className="flex items-start">
          <div className="bg-indigo-50 p-3 rounded-lg mr-4">
            {icon}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{title}</h4>
            <p className="text-sm text-gray-500 mt-1">{type}</p>
            <div className="mt-1 flex justify-between items-center">
              <span className="text-xs text-gray-400">{size}</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                <FiDownload className="ml-4" /> Download
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Helper functions for lesson icons
  function getLessonIcon(type) {
    const iconClass = "text-white text-lg";
    switch (type) {
      case 'video':
        return <FiPlay className={iconClass} />;
      case 'reading':
        return <FiBookOpen className={iconClass} />;
      case 'assignment':
        return <FiCode className={iconClass} />;
      default:
        return <FiBook className={iconClass} />;
    }
  }
  
  function getLessonIconColor(type) {
    switch (type) {
      case 'video':
        return 'bg-blue-500';
      case 'reading':
        return 'bg-purple-500';
      case 'assignment':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  }
  
  export default App;