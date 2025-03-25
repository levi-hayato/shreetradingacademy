import { useState } from "react";
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
  FaAward
} from "react-icons/fa";
import StudentIDCard from "./components/StudentIDCard";

function StudentDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sidebar menu items
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`flex flex-col bg-indigo-800 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold">Shree Trading</h1>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaBars size={18} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveItem(item.name);
                      navigate(item.path);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg transition-all ${activeItem === item.name ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                  >
                    <Icon className="text-lg" />
                    {isSidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              {user?.name?.charAt(0) || 'S'}
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-xs text-indigo-200 hover:text-white mt-1"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {/* Mobile Header */}
          <div className="md:hidden flex justify-between items-center mb-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-gray-200"
            >
              <FaBars className="text-indigo-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{activeItem}</h1>
          </div>

          {/* Dashboard Content */}
          <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <StudentIDCard email={user?.email} name={user?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;