import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { FaBook, FaClock, FaDollarSign, FaCloudUploadAlt, FaPlus, FaSpinner, FaTrash, FaTag, FaCheckCircle } from "react-icons/fa";
import { FaImage, FaPen } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useAlertContext } from "../../context/AlertContext";

export default function AddCourse() {
  const { showAlert } = useAlertContext();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("1 Month");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseFeatures, setCourseFeatures] = useState([""]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch Courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    };
    fetchCourses();
  }, []);

  const generateCourseID = () => Math.floor(100000 + Math.random() * 900000).toString();

  const extractMonthYear = () => {
    const now = new Date();
    return { month: now.toLocaleString("default", { month: "long" }), year: now.getFullYear() };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      showAlert("warning", "Please select a course banner!");
      return;
    }

    setLoading(true);
    try {
      const courseBanner = await uploadToCloudinary(imageFile);
      const { month, year } = extractMonthYear();

      const newCourse = {
        courseID: generateCourseID(),
        name: courseName,
        description: courseDescription,
        duration: courseDuration,
        price: coursePrice,
        banner: courseBanner,
        features: courseFeatures.filter((feature) => feature.trim() !== ""),
        month,
        year,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "courses"), newCourse);
      showAlert("success", "Course added successfully!");
      resetForm();
    } catch (error) {
      showAlert("error", "Failed to add course. Try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseDuration("1 Month");
    setCoursePrice("");
    setCourseFeatures([""]);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        showAlert("success", "Course deleted successfully!");
        setCourses(courses.filter((course) => course.id !== id));
      } catch (error) {
        showAlert("error", "Failed to delete course.");
      }
    }
  };

  const addFeature = () => {
    setCourseFeatures([...courseFeatures, ""]);
  };

  const removeFeature = (index) => {
    if (courseFeatures.length > 1) {
      const updatedFeatures = courseFeatures.filter((_, i) => i !== index);
      setCourseFeatures(updatedFeatures);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Left - Add Course Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Course</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Course Name */}
          <div className="relative">
            <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Course Name"
              required
            />
          </div>

          {/* Course Description */}
          <div className="relative">
            <FaTag className="absolute left-3 top-4 text-gray-400" />
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Course Description"
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Duration */}
            <div className="relative">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </div>

            {/* Course Price */}
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Course Price (₹)"
                required
              />
            </div>
          </div>

          {/* Course Banner Upload */}
          <div 
            className={`border-2 border-dashed ${imageFile ? 'border-green-500' : 'border-gray-300'} rounded-xl p-6 text-center transition-colors cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="hidden" 
              id="course-banner" 
            />
            <label htmlFor="course-banner" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                <FaImage className={`text-4xl mb-3 ${imageFile ? 'text-green-500' : 'text-gray-400'} transition-colors`} />
                <p className={`font-medium ${imageFile ? 'text-green-600' : 'text-gray-500'}`}>
                  {imageFile ? imageFile.name : 'Upload Course Banner'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {imageFile ? 'Click to change' : 'Recommended size: 1200x600px'}
                </p>
                {isHovered && !imageFile && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-blue-500 flex items-center gap-1"
                  >
                    <FaCloudUploadAlt />
                    <span>Click to browse</span>
                  </motion.div>
                )}
              </div>
            </label>
            {imageFile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Course Banner Preview" 
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </motion.div>
            )}
          </div>

          {/* Course Features */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Course Features</h3>
            <AnimatePresence>
              {courseFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex items-center gap-2"
                >
                  <FaCheckCircle className="text-gray-400" />
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const updatedFeatures = [...courseFeatures];
                      updatedFeatures[index] = e.target.value;
                      setCourseFeatures(updatedFeatures);
                    }}
                    className="flex-1 pl-2 pr-8 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {courseFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="absolute right-0 text-red-400 hover:text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button
              type="button"
              onClick={addFeature}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm mt-2"
            >
              <FaPlus size={12} />
              <span>Add another feature</span>
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Adding Course...</span>
              </>
            ) : (
              <>
                <FaPlus />
                <span>Create Course</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Right - Course List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-1/3"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Courses</h3>
          
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No courses added yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <AnimatePresence>
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 rounded-lg p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        src={course.banner} 
                        alt={course.name} 
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{course.name}</h4>
                      <div className=" items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          {/* <FaClock size={12} /> */}
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          {/* <FaDollarSign size={12} /> */}
                          ₹{course.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleDelete(course.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete course"
                      >
                        <FaTrash size={14} />
                      </button>
                      <button 
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit course"
                      >
                        <FaPen size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}