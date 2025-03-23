import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { NavbarMenu } from "../mockdata/Menuitems";
import { MdMenu } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { BsPerson } from "react-icons/bs";
import {  FaX } from "react-icons/fa6";
import { FiBell, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
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
    const hideNavbarRoutes = ["/dash", "/dash/sales", "/dash/manage", "/dash/payments"];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && (
                <nav className="font-poppins w-full px-8 bg-white dark:bg-gray-600 bg-fresh-shapes bg-cover bg-center">
                    <div className="container flex justify-between items-center py-4">
                        {/* Logo Section */}
                        <div className=" lg-auto">
                            <img className="w-30 size-14" src="https://desk-on-fire-store.com/assets/logo.png" alt="Logo" />
                        </div>

                        {/* Menu Section */}
                        <div className="hidden lg:block">
                            <ul className="flex items-center gap-2 text-gray-600 dark:text-white uppercase font-semibold">
                                {NavbarMenu.map((item) => (
                                    <li key={item.id}>
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
                                    <div className="absolute right-0 mt-2 w-56 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                        {user ? (
                                            <ul className="py-2 text-gray-700 dark:text-white">
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-all duration-300"
                                                    onClick={handleUserClick} // Clicking redirects based on role
                                                >
                                                    <FiUser /> {user.name || "Guest"}
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-all duration-300">
                                                    <FiSettings /> Settings
                                                </li>
                                                <li
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer transition-all duration-300"
                                                >
                                                    <FiLogOut /> Logout
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="py-2 text-gray-700 uppercase font-[5px] dark:text-white">
                                                <Link to={"/log"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-all duration-300">
                                                        <MdLogin /> Login
                                                    </li>
                                                </Link>
                                                <Link to={"/register"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-all duration-300">
                                                        <MdAppRegistration /> Register
                                                    </li>
                                                </Link>
                                                <Link to={"/admin"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-all duration-300">
                                                        <FaUserShield /> Admin
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