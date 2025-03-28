import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { NavbarMenu } from "../mockdata/Menuitems";
import { 
  FaTimes, FaHome, FaUser, FaCogs, FaBook, 
  FaImages, FaEnvelope, FaInfoCircle, FaChevronRight 
} from "react-icons/fa";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiDashboardLine } from "react-icons/ri";

const ResponsiveMenu = ({ open, setOpen }) => {
  const { user, logout } = useUser();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const menuIcons = {
    Home: <FaHome className="text-lg" />,
    About: <FaInfoCircle className="text-lg" />,
    Services: <FaCogs className="text-lg" />,
    Courses: <FaBook className="text-lg" />,
    Gallery: <FaImages className="text-lg" />,
    Contact: <FaEnvelope className="text-lg" />,
    Dashboard: <RiDashboardLine className="text-lg" />,
    Profile: <FiUser className="text-lg" />,
    Notifications: <IoMdNotificationsOutline className="text-lg" />,
  };

  // Add this CSS to your global styles or component styles
const scrollbarStyles = `
/* For Webkit browsers (Chrome, Safari) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}


/* For Firefox */
* {
  scrollbar-width: thin;
  
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
}

/* Dark mode styles */
.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dark * {
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
}
`;


  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
           
          
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.5
            }}
            className="fixed top-0 left-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 shadow-2xl z-50 flex flex-col backdrop-blur-lg border-r border-gray-200 dark:border-gray-700"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <img 
                  src="https://desk-on-fire-store.com/assets/logo.png" 
                  alt="Logo" 
                  className="w-auto h-8"
                />
                
              </motion.div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
          
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>

            {user && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white overflow-hidden">
                    {user.photo ? (
                      <img 
                        src={user.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-xl" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{user.name || "Guest"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user.email || ""}</p>
                </div>
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide ">
              <motion.ul className="space-y-2 pr-2">
                     
                {NavbarMenu.map((item, index) => (
                  <motion.li
                    key={item.link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.2 + index * 0.05 }
                    }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={item.link}
                      className={({ isActive }) => 
                        `flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${isActive ? 'bg-blue-100/50 dark:bg-blue-500/20' : 'bg-gray-100/50 dark:bg-gray-700/50'}`}>
                              {menuIcons[item.title.split(' ')[0]] || <FaUser />}
                            </span>
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <FaChevronRight className="text-xs text-gray-400" />
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>

              {user && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Account
                  </h3>
                  <ul className="space-y-2">
                    <motion.li
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <NavLink
                        to="/profile"
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gray-100/50 dark:bg-gray-700/50 font-medium' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                          }`
                        }
                      >
                        <span className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-700/50">
                          <FiUser />
                        </span>
                        <span>My Profile</span>
                      </NavLink>
                    </motion.li>
                    {/* Other account links... */}
                  </ul>
                </motion.div>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              {user ? (
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                >
                  <FiLogOut className="text-lg" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to="/login"
                      className="block text-center px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Login
                    </NavLink>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to="/register"
                      className="block text-center px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                    >
                      Register
                    </NavLink>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;