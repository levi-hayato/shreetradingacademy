import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import { FaBars } from 'react-icons/fa';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Set active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('profile')) return 'Profile';
    if (path.includes('update')) return 'Update Profile';
    if (path.includes('courses')) return 'My Courses';
    // Add other path checks as needed
    return 'Dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location]);

  // Check screen size and handle resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full ">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleSidebar} />
      )}

      {/* Main Content Area */}
      <main className={`
        flex-1 overflow-auto
        transition-all duration-300
        ${isSidebarOpen && !isMobile ? 'md:ml-0' : 'md:ml-15'}
      `}>
        {/* Mobile Header */}
        <header className="md:hidden flex items-center p-4 bg-white shadow-sm sticky top-0 z-10">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-4 text-indigo-800 hover:bg-gray-100 rounded-lg"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">{activeItem}</h1>
        </header>

        {/* Centered Content Container */}
        <div className="min-h-[calc(100vh-100px)] w-full flex justify-center px-1  py-0">
          <div className="w-full"> {/* Adjust max-width as needed */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );

};

export default Layout;