import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { useContext, createContext, useState, useRef, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [user] = useAuthState(auth);

  return (
    <aside className="h-screen bg-white shadow-sm">
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex border-b border-gray-300 justify-between items-center">
          <img
            src="https://desk-on-fire-store.com/assets/logo.png"
            className={`transition-all ${expanded ? "w-32" : "w-0"}`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <BsChevronLeft /> : <BsChevronRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 mt-3 px-3">{children}</ul>
        </SidebarContext.Provider>

        {user && (
          <div className="border-t border-gray-400 flex p-3">
            <img
              src={user.photoURL || "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"}
              alt="User Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div className={`flex justify-between overflow-hidden items-center transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4">
                <h4 className="font-semibold">{user.displayName}</h4>
                <span className="text-xs text-gray-600">{user.email}</span>
              </div>
              <FiMoreVertical size={20} />
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

// 🔹 Sidebar Item Component
export function SidebarItem({ icon, text, to, dropdownItems }) {
  const { expanded } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isActive = location.pathname === to;

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li className="relative" ref={dropdownRef}>
      {/* 🔹 Sidebar Item Clickable Navigation */}
      <Link
        to={to}
        className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          isActive ? "bg-indigo-200 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-2" : "w-0"}`}>
          {text}
        </span>

        {dropdownItems && (
          <span className="ml-auto">
            {dropdownOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        )}
      </Link>

      {/* 🔹 Dropdown Menu */}
      {dropdownItems && dropdownOpen && (
        <ul className="ml-6 mt-1 bg-white rounded-md overflow-hidden">
          {dropdownItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <Link
                to={item.to}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 transition w-full"
              >
                {item.icon}
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
