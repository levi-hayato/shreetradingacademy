import { useUser } from "../context/UserContext";
import StudentIDCard from "./components/StudentIDCard";
import Layout from "./components/Layout";

function StudentDashboard() {
  const { user } = useUser();

  return (
    // <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-2xl">
          <StudentIDCard 
            email={user?.email} 
            name={user?.name} 
            studentId={user?.studentId}
          />
          
          {/* Additional Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
              {/* Activity content here */}
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-800 mb-2">Course Progress</h3>
              {/* Progress content here */}
            </div>
          </div>
        </div>
      </div>
    // </Layout>
  );
}

export default StudentDashboard;