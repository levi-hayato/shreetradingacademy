import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { NavbarMenu } from "../mockdata/Menuitems";
import { FaTimes } from "react-icons/fa"; // Close icon
import {
  FaHome,
  FaUser,
  FaCogs,
  FaBook,
  FaImages,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa"; // Importing React Icons

const ResponsiveMenu = ({ open, setOpen }) => {
  // Map menu items to their respective icons
  const menuIcons = {
    Home: <FaHome className="text-xl" />,
    About: <FaInfoCircle className="text-xl" />,
    Services: <FaCogs className="text-xl" />,
    Courses: <FaBook className="text-xl" />,
    Gallery: <FaImages className="text-xl" />,
    Contact: <FaEnvelope className="text-xl" />,
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 w-full h-screen bg-black/60 z-20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-fresh-shapes bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md py-8 rounded-3xl relative">
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)} // Close the menu
                className="absolute top-4 right-4 p-2 text-gray-700 dark:text-white hover:text-btn transition-all duration-300"
              >
                <FaTimes className="text-2xl" /> {/* Close icon */}
              </button>

              {/* Menu Items */}
              <ul className="flex flex-col justify-center items-center gap-6">
                {NavbarMenu.map((item) => (
                  <motion.li
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full text-center"
                  >
                    <NavLink
                      to={item.link}
                      onClick={() => setOpen(false)} // Close the menu when a link is clicked
                      className="flex items-center justify-center gap-3 text-xl font-semibold text-gray-700 dark:text-white hover:text-btn transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                   {/* Display icon */}
                      {item.title}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;