import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBook, 
  FaMoneyBill, 
  FaSignOutAlt, 
  FaBars,
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaFileAlt,
  FaAward,
  FaTimes
} from "react-icons/fa";
import StudentIDCard from "./components/StudentIDCard";

function StudentDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size and handle resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Close sidebar by default on mobile
      } else {
        setIsSidebarOpen(true); // Open sidebar by default on desktop
      }
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: 'Dashboard', icon: FaHome, path: '/student' },
    { name: 'My Courses', icon: FaBook, path: '/student/courses' },
    { name: 'Payments', icon: FaMoneyBill, path: '/student/payments' },
    { name: 'Progress', icon: FaChartLine, path: '/student/progress' },
    { name: 'Schedule', icon: FaCalendarAlt, path: '/student/schedule' },
    { name: 'Assignments', icon: FaFileAlt, path: '/student/assignments' },
    { name: 'Certificates', icon: FaAward, path: '/student/certificates' },
    { name: 'Profile', icon: FaUser, path: '/student/profile' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 flex flex-col bg-indigo-800 text-white transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
        h-full shadow-lg`}>

        {/* Mobile close button */}
        {isMobile && isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute right-4 top-4 p-1 text-white hover:text-indigo-200"
          >
            <FaTimes size={20} />
          </button>
        )}

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700 h-16">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold whitespace-nowrap">Shree Trading</h1>
          ) : (
            <div className="w-6"></div> // Spacer when collapsed
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaBars size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto py-2 px-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveItem(item.name);
                      navigate(item.path);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200
                      ${activeItem === item.name ? 'bg-indigo-700' : 'hover:bg-indigo-700'}
                      ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    {isSidebarOpen && (
                      <span className="ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {item.name}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-indigo-700">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {user?.name || 'Student'}
                </p>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-xs text-indigo-200 hover:text-white mt-1"
                >
                  <FaSignOutAlt className="mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300
        ${isSidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-20'}`}>

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

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-2xl">
              <StudentIDCard 
                email={user?.email} 
                name={user?.name} 
                studentId={user?.studentId}
              />
              
              {/* Additional Dashboard Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
                  {/* Activity content here */}
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-800 mb-2">Course Progress</h3>
                  {/* Progress content here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;