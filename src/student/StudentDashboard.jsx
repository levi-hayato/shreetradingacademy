import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">Welcome, {user?.name}!</h2>
      <p className="text-gray-600">{user?.email}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;
