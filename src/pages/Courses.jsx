import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaBookOpen, FaClock, FaCheckCircle, FaRupeeSign } from "react-icons/fa";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // For animations

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="py-10 w-full bg-gray-50  relative overflow-hidden">
    
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float1 w-40 h-40 bg-indigo-200 rounded-full absolute top-10 left-10 opacity-30"></div>
        <div className="animate-float2 w-60 h-60 bg-pink-200 rounded-full absolute bottom-20 right-20 opacity-30"></div>
        <div className="animate-float3 w-80 h-80 bg-purple-200 rounded-full absolute top-1/2 left-1/2 opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-black text-4xl text-center font-extrabold uppercase relative after:block after:w-20 after:h-1 after:bg-indigo-500 after:mt-1 after:mx-auto mb-12"
        >
          Courses
        </motion.h1>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-8">
          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// 🔹 Course Card Component
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative  bg-white/90 backdrop-blur-md flex flex-col shadow-lg rounded-xl overflow-hidden transition-transform transform hover:shadow-2xl duration-300 border border-gray-200"
    >
      {/* Course Banner */}
      <div className="relative">
        <img
          src={course.banner}
          alt={course.name}
          className="w-full h-52 object-cover rounded-t-xl"
        />
        <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-semibold">
          <FaClock className="inline-block mr-1" /> {course.duration}
        </div>
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-md rounded-b-xl">
        {/* Course Name */}
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {course.name}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mt-2 line-clamp-2 overflow-hidden">
          {course.description}
        </p>

        {/* Course Features - Display Top 3 */}
        <div className="mt-3">
          <p className="font-semibold text-gray-800">Features</p>
          <ul className="mt-2 space-y-1">
            {course.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm flex items-center gap-2 text-gray-700">
                <FaCheckCircle className="text-green-500" /> {feature}
              </li>
            ))}
            {course.features.length > 3 && (
              <li className="text-sm text-gray-500">+ More...</li>
            )}
          </ul>
        </div>

        {/* Course Price */}
        <div className="mt-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <FaRupeeSign className="text-indigo-500" /> {course.price}
        </div>

        {/* Register Button */}
        <button
          className="bg-indigo-500 w-full font-bold uppercase text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition-all mt-4 shadow-md hover:shadow-lg transform hover:scale-[1.03] duration-200"
          onClick={() => navigate(`/course/${course.id}`)} // Navigate to Course Details
        >
          Register
        </button>
      </div>
    </motion.div>
  );
};