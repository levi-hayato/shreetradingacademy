import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { NavbarMenu } from "../mockdata/Menuitems";
import { MdMenu } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { BsPerson } from "react-icons/bs";
import { FaX } from "react-icons/fa6";
import { FiBell, FiChevronRight, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { MdLogin, MdAppRegistration } from "react-icons/md";
import { FaRegBell, FaUserShield } from "react-icons/fa";
import { db, auth } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        const q = query(collection(db, "admins"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        setIsAdmin(!querySnapshot.empty); // If email exists, user is admin
      }
    };

    checkAdminStatus();
  }, [user]);

  // Handle user click for redirection
  const handleUserClick = () => {
    if (user) {
      if (isAdmin) {
        navigate("/dash"); // Redirect to Dashboard if admin
      } else {
        navigate("/student"); // Redirect to Student page if not admin
      }
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    navigate("/"); // Redirect to homepage after logout
  };

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/content", "/login", "/register", "/admin", "/student", "/student/profile", "/student/courses", "/student/payments", "/student/certificates", "/dash", "/dash/sales", "/dash/manage", "/dash/payments", "/dash/message", "/dash/students", "/dash/admins", "/dash/settings", "/dash/offline"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <nav className="font-poppins px-8 bg-white dark:bg-gray-600 bg-fresh-shapes bg-cover bg-center">
          <div className="container flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className=" lg-auto">
              <img className="w-30 size-14" src="https://desk-on-fire-store.com/assets/logo.png" alt="Logo" />
            </div>

            {/* Menu Section */}
            <div className="hidden lg:block">
              <ul className="flex items-center gap-2 text-gray-600 dark:text-white uppercase font-semibold">
                {NavbarMenu.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `inline-block py-2 px-4 hover:text-btn hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 ${isActive ? "text-btn font-bold bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Profile & Menu */}
            <div className="flex items-center gap-1 relative">
              {/* User Profile Section / Dropdown */}

              <div className="relative">
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setTimeout(() => {
                      setDropdownOpen(false);
                    }, 2000);
                  }}
                  className="flex items-center w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {user ? (
                    <img
                      src={user.photo || "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-btn transition-all duration-300"
                      alt=""
                    />
                  ) : (
                    <BsPerson className="text-2xl h-10 w-10 p-2 text-gray-700 dark:text-white hover:text-btn transition-all duration-300" />
                  )}
                </button>



                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform origin-top-right animate-fade-in"
                    style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {user ? (
                      <ul className="py-1">
                        <li
                          className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                          onClick={handleUserClick}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-600 dark:to-gray-700 text-indigo-600 dark:text-indigo-300">
                            <FiUser className="text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name || "Guest"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || ""}</p>
                          </div>
                          <FiChevronRight className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </li>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        <li className="px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-200 group">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300">
                            <FiSettings className="text-sm" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Settings
                          </span>
                        </li>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        <li
                          onClick={handleLogout}
                          className="px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <FiLogOut className="text-sm" />
                          </div>
                          <span className="text-sm text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                            Logout
                          </span>
                        </li>
                      </ul>
                    ) : (
                      <ul className="py-1">
                        <Link to="/login">
                          <li className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-200 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-teal-100 dark:from-gray-600 dark:to-gray-700 text-green-600 dark:text-teal-300">
                              <MdLogin className="text-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Login</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Access your account</p>
                            </div>
                          </li>
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        <Link to="/register">
                          <li className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-200 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-600 dark:to-gray-700 text-blue-600 dark:text-indigo-300">
                              <MdAppRegistration className="text-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Register</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Create new account</p>
                            </div>
                          </li>
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        <Link to="/admin">
                          <li className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-all duration-200 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-600 dark:to-gray-700 text-purple-600 dark:text-pink-300">
                              <FaUserShield className="text-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Panel</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Manage system</p>
                            </div>
                          </li>
                        </Link>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* <button>
                                <FiBell  className="text-2xl h-11 w-11 p-3 text-gray-700 dark:text-white hover:text-btn transition-all duration-300"  />
                            </button> */}

              {/* Mobile Hamburger Menu */}
              {open ? (
                <FaX
                  className="text-2xl lg:hidden dark:text-white hover:text-btn transition-all duration-300"
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <MdMenu
                  className="text-3xl lg:hidden dark:text-white hover:text-btn transition-all duration-300"
                  onClick={() => setOpen(!open)}
                />
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Sidebar Section */}
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;