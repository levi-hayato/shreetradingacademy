import { 
    FaUser, 
    FaBook, 
    FaMoneyBill, 
    FaSignOutAlt,
    FaHome,
    FaChartLine,
    FaCalendarAlt,
    FaFileAlt,
    FaAward,
    FaTimes,
    FaBars
  } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  import { useUser } from "../../context/UserContext";
  
  const SideBar = ({ isSidebarOpen, toggleSidebar, isMobile, activeItem, setActiveItem }) => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
  
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
  
    const handleNavigation = (path, name) => {
      setActiveItem(name);
      navigate(path);
      if (isMobile) {
        toggleSidebar();
      }
    };
  
    const handleLogout = () => {
      logout();
      navigate("/login");
    };
  
    return (
      <aside className={`fixed md:relative z-30 flex flex-col bg-indigo-800 text-white transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-15 -translate-x-full md:translate-x-0'}
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
            <div className="w-6"></div>
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
                    onClick={() => handleNavigation(item.path, item.name)}
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
    );
  };
  
  export default SideBar;