import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook, FaMoneyBill, FaSignOutAlt, FaBars } from "react-icons/fa";
import StudentIDCard from "./components/StudentIDCard";

function StudentDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 p-5 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          className="mb-6 text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars className="text-2xl" />
        </button>

        <nav className="flex flex-col gap-4">
          <a href="#" className="flex items-center gap-3 text-lg hover:text-gray-300">
            <FaUser /> {isSidebarOpen && "Profile"}
          </a>
          <a href="#" className="flex items-center gap-3 text-lg hover:text-gray-300">
            <FaBook /> {isSidebarOpen && "My Courses"}
          </a>
          <a href="#" className="flex items-center gap-3 text-lg hover:text-gray-300">
            <FaMoneyBill /> {isSidebarOpen && "Payments"}
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-lg hover:text-gray-300 focus:outline-none"
          >
          
            <FaSignOutAlt /> {isSidebarOpen && "Logout"}
          </button>
        </nav>
      </div>

      {/* Main Content */}
     
       <div className="flex justify-center items-center w-full"><StudentIDCard email={user.email}/></div>
    </div>
  );
}

export default StudentDashboard;


