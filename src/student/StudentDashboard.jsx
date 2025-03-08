import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook, FaMoneyBill, FaSignOutAlt, FaBars } from "react-icons/fa";

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
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mt-2">{user?.email}</p>
      </div>
    </div>
  );
}

export default StudentDashboard;