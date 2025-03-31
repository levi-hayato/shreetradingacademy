import { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import StudentIDCard from "./components/StudentIDCard";
import Layout from "./components/Layout";
import CourseIntro from "./pages/CourseIntro";
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from "./components/ErrorMessage";
import StudentCoursesPage from './pages/StudentCoursesPage';

function StudentDashboard() {
  const { user } = useUser();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user?.email) {
          setError('User email not available');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('No student record found for this email');
          return;
        }

        // Get the first document (assuming email is unique)
        const doc = querySnapshot.docs[0];
        setStudentData({
          id: doc.id,
          ...doc.data()
        });

      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user?.email]);

  if (loading) {
    return <LoadingSpinner fullHeight />;
  }

  if (error) {
    return <ErrorMessage message={error} fullHeight />;
  }

  return (
   
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar with student card */}
        

          {/* Main content */}
          <div className="w-full">
            <StudentCoursesPage/>
            {/* <CourseIntro courseID="XeNSQMUcJ1v2Xcm9xuom" /> */}
            
            {/* Dashboard widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <p className="text-gray-600">Your recent learning activity will appear here.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '30%'}}></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">30% of course completed</p>
              </div>
            </div>

            {/* Additional dashboard sections can be added here */}
          </div>
        </div>
      </div>
  );
}

export default StudentDashboard;