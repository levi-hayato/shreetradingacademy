import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Import Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUser, FaIdCard, FaPhone, FaCalendarAlt, FaBook } from "react-icons/fa"; // React Icons
import { FcApproval } from "react-icons/fc"; // React Icons

const StudentIDCard = ({ email }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentByEmail = async () => {
            try {
                // Query Firestore to find the student by email
                const studentsRef = collection(db, "students");
                const q = query(studentsRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Get the first document (assuming email is unique)
                    const studentDoc = querySnapshot.docs[0];
                    const studentData = studentDoc.data();
                    setStudent(studentData); // Set student data in state
                } else {
                    setError("No student found with this email.");
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
                setError("Failed to fetch student data.");
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchStudentByEmail();
        } else {
            setError("Please provide an email.");
            setLoading(false);
        }
    }, [email]);

    if (loading) {
        return <div className="text-center text-gray-600">Loading ID card...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!student) {
        return <div className="text-center text-gray-600">No student data found.</div>;
    }

    return (
        <div className="flex justify-center items-center  relative">
                   

                 {/* Background Div with 40% Opacity */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-40 z-0">
                <div className="w-60 h-60 bg-gradient-to-r from-indigo-500 to-blue-400 animate-morph rounded-full"></div>
            </div>   
            {/* Student ID Card */}
            <div className="bg-transperent rounded-xl shadow-lg overflow-hidden w-full  transform transition-all hover:scale-105 relative ">
          

          
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white text-center">
                    <h1 className="text-xl font-bold">Student ID Card</h1>
                    <p className="text-xs">University of Tech</p>
                </div>

                {/* Student Photo */}
                <div className="flex justify-center mt-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                            src={student.photo || "https://via.placeholder.com/150"} // Fallback for missing photo
                            alt="Student Photo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Student Details */}
                <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">{student.name}</h2>
                    <p className="text-xs text-gray-600">{student.email}</p>

                    <div className="mt-4 space-y-2">
                        {/* Course */}
                        <div className="flex items-center bg-transparent p-2 rounded-lg">
                            <FaBook className="text-blue-600 mr-2" />
                            <span className="text-sm text-gray-800">{student.course}</span>
                        </div>

                        {/* Student ID */}
                        <div className="flex items-center bg-transparent p-2 rounded-lg">
                            <FaIdCard className="text-purple-600 mr-2" />
                            <span className="text-sm text-gray-800">{student.studentId}</span>
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center bg-gradient-to-r bg-transparent p-2 rounded-lg">
                            <FaPhone className="text-green-600 mr-2" />
                            <span className="text-sm text-gray-800">{student.mobile}</span>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center bg-transparent p-2 rounded-lg">
                            <FaCalendarAlt className="text-orange-600 mr-2" />
                            <span className="text-sm text-gray-800">{student.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-3 text-center text-xs text-gray-600 flex items-center justify-center">
                    <FcApproval className="mr-1" />
                    <p>Valid until: December 2025</p>
                </div>
                

            </div>
        </div>
    );
};

export default StudentIDCard;