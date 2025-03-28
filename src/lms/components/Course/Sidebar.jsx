import { motion } from 'framer-motion';
import SidebarItem from '../Layout/SidebarItem';
import ChapterList from './ChapterList';
import {
  FiBook, FiX, FiHome, FiAward, 
  FiUsers, FiSettings, FiBarChart2,
  FiArrowLeft,
  FiArrowRightCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
  selectedCourse,
  activeChapter,
  setActiveChapter,
  activeLesson,
  setActiveLesson, // Make sure this is in the props
  expandedChapters,
  setExpandedChapters,
  setIsInstructor
}) => {
  const navigate = useNavigate();
  return (
    
    <motion.div 
      className={`fixed md:relative z-20 ${
        isMobile ? 'w-64' : sidebarCollapsed ? 'w-20' : 'w-72'
      } bg-white shadow-xl h-screen flex flex-col transition-all duration-300`}
      initial={{ x: isMobile ? -300 : 0 }}
      animate={{ x: 0 }}
      exit={{ x: isMobile ? -300 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {sidebarCollapsed && !isMobile ? (
          ""
        ) : (
          <img className="w-30 size-14" src="https://desk-on-fire-store.com/assets/logo.png" alt="Logo" />
        )}
        <div className="flex items-center">
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 mr-2"
            >
              {sidebarCollapsed ? <FiArrowRightCircle className=" text-indigo-600 mx-auto size-8" /> : '«'}
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
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2">
          {[
            { icon: <FiHome />, text: "Home" , active: true},
            // { icon: <FiBook />, text: "My Courses", active: true },
            // { icon: <FiAward />, text: "Certificates" },
            // { icon: <FiUsers />, text: "Community" },
            // { icon: <FiBarChart2 />, text: "Progress" },
            // { icon: <FiSettings />, text: "Settings" }
          ].map((item, index) => (
            <SidebarItem 
              key={index}
              icon={item.icon}
              text={item.text}
              active={item.active}
              collapsed={sidebarCollapsed && !isMobile}
            />
          ))}
        </nav>
        
        {(!sidebarCollapsed || isMobile) && selectedCourse && (
          <ChapterList 
          selectedCourse={selectedCourse} 
          isMobile={isMobile}
          setSidebarOpen={setSidebarOpen}
          activeChapter={activeChapter}
          setActiveChapter={setActiveChapter}
          activeLesson={activeLesson}
          setActiveLesson={setActiveLesson} // Pass it here
          expandedChapters={expandedChapters}
          setExpandedChapters={setExpandedChapters}
          />
        )}
      </div>
      
      {(!sidebarCollapsed || isMobile) && (
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => navigate('/student')}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Go Back
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;