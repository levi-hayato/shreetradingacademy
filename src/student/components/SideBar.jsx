import { useState } from 'react';
import { 
  FiHome, 
  FiTrendingUp, 
  FiDollarSign, 
  FiUsers, 
  FiSettings,
  FiBook,
  FiCalendar,
  FiPieChart,
  FiMenu,
  FiChevronLeft
} from 'react-icons/fi';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: FiHome },
    { name: 'Analytics', icon: FiTrendingUp },
    { name: 'Payments', icon: FiDollarSign },
    { name: 'Students', icon: FiUsers },
    { name: 'Courses', icon: FiBook },
    { name: 'Schedule', icon: FiCalendar },
    { name: 'Reports', icon: FiPieChart },
    { name: 'Settings', icon: FiSettings }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`flex flex-col h-screen bg-indigo-700 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        {!collapsed && (
          <h1 className="text-xl font-bold">Shree Trading</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
          {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${activeItem === item.name ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-indigo-600">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-sm font-medium">ST</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-indigo-200">admin@shreetrading.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;