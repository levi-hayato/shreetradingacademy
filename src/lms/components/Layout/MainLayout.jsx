import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Course/Sidebar';
import { FiMenu } from 'react-icons/fi';

export const MainLayout = ({ 
  children, 
  sidebarOpen, 
  setSidebarOpen, 
  sidebarCollapsed, 
  setSidebarCollapsed,
  isMobile,
  selectedCourse,
  setIsInstructor,
  activeChapter,
  setActiveChapter,
  activeLesson,
  setActiveLesson,
  expandedChapters,
  setExpandedChapters
}) => {
  return (
    <div className="relative flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Mobile Sidebar Toggle Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed z-30 top-4 left-4 p-2 rounded-md bg-white shadow-md"
        >
          <FiMenu className="text-gray-700 text-xl" />
        </button>
      )}

      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <>
            <Sidebar 
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sidebarCollapsed={isMobile ? false : sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              isMobile={isMobile}
              selectedCourse={selectedCourse}
              activeChapter={activeChapter}
              setActiveChapter={setActiveChapter}
              activeLesson={activeLesson}
              setActiveLesson={setActiveLesson}
              expandedChapters={expandedChapters}
              setExpandedChapters={setExpandedChapters}
              setIsInstructor={setIsInstructor}
            />
            
            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
              <motion.div 
                className="fixed inset-0 bg-transparent hidden bg-opacity-50 z-20"
                onClick={() => setSidebarOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`relative flex-1 h-full overflow-y-auto transition-all duration-300 ${
        !isMobile && sidebarOpen && !sidebarCollapsed ? 'ml-72 md:ml-0' : 
        !isMobile && sidebarCollapsed ? 'ml-15 md:ml-0' : 'ml-0'
      }`}>
        {/* Ensure the background is properly set */}
        <div className="absolute inset-0 bg-gray-50 -z-10" />
        {children}
      </div>
    </div>
  );
};