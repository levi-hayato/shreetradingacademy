import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { NavbarMenu } from "../mockdata/Menuitems";
import { MdAdminPanelSettings, MdMenu } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { BsPerson } from "react-icons/bs";
import { FaX } from "react-icons/fa6";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { MdLogin, MdAppRegistration } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import { db, auth } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import CustomButton from "../styles/Button";
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
    const hideNavbarRoutes = ["/dash", "/dash/sales", "/dash/manage" , "/dash/payments"];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && (
                <nav className="font-poppins w-full px-8 bg-bg dark:bg-gray-600">
                    <div className="container flex justify-between items-center">
                        {/* Logo Section */}
                        <div className="w-60 lg-auto">
                            <img className="w-30 size-14" src="https://desk-on-fire-store.com/assets/logo.png" alt="Logo" />
                        </div>

                        {/* Menu Section */}
                        <div className="hidden lg:block">
                            <ul className="flex items-center gap-3 text-gray-600 dark:text-white uppercase font-semibold">
                                {NavbarMenu.map((item) => (
                                    <li key={item.id}>
                                        <NavLink className="inline-block py-1 hover:text-btn duration-900" to={item.link}>
                                            {item.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Section: Profile & Menu */}
                        <div className="flex items-center gap-4 relative">
                            <CustomButton />

                            {/* User Profile Section / Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    {user ? (
                                        <img
                                            src={user.photo || "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"}
                                            className="w-10 h-10 rounded-full border border-gray-300"
                                            alt="User Profile"
                                        />
                                    ) : (
                                        <BsPerson className="text-2xl text-gray-700 dark:text-white" />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                                        {user ? (
                                            <ul className="py-2 text-gray-700 dark:text-white">
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                    onClick={handleUserClick} // Clicking redirects based on role
                                                >
                                                    <FiUser /> {user.name || "Guest"}
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                                    <FiSettings /> Settings
                                                </li>
                                                <li
                                                    onClick={handleLogout}
                                                    className="px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
                                                >
                                                    <FiLogOut /> Logout
                                                </li>
                                            </ul>
                                        ) : (
                                            <ul className="py-2 text-gray-700 uppercase font-[5px] dark:text-white">
                                                <Link to={"/log"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                                        <MdLogin /> Login
                                                    </li>
                                                </Link>
                                                <Link to={"/register"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                                        <MdAppRegistration /> Register
                                                    </li>
                                                </Link>
                                                <Link to={"/admin"}>
                                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                                        <FaUserShield /> Admin
                                                    </li>
                                                </Link>
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger Menu */}
                            {open ? (
                                <FaX className="text-2xl lg:hidden dark:text-white" onClick={() => setOpen(!open)} />
                            ) : (
                                <MdMenu className="text-3xl lg:hidden dark:text-white" onClick={() => setOpen(!open)} />
                            )}
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile Sidebar Section */}
            <ResponsiveMenu open={open} />
        </>
    );
};

export default Navbar;
