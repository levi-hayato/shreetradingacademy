import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { useAlert } from "../../context/AlertContext";
import { FaBook, FaClock, FaDollarSign, FaCloudUploadAlt, FaPlus, FaSpinner, FaTrash, FaTag, FaCheckCircle } from "react-icons/fa";
import { FaImage, FaPen } from "react-icons/fa6";

export default function AddCourse() {
  const { showAlert } = useAlert();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState("1 Month");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseFeatures, setCourseFeatures] = useState([""]); // Retained Features Input
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]); // Store Existing Courses

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
  }, [courses]);

  // Generate 6-digit Course ID
  const generateCourseID = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Extract Month & Year
  const extractMonthYear = () => {
    const now = new Date();
    return { month: now.toLocaleString("default", { month: "long" }), year: now.getFullYear() };
  };

  // Handle Course Submission
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
      setCourseName("");
      setCourseDescription("");
      setCourseDuration("1 Month");
      setCoursePrice("");
      setCourseFeatures([""]);
      setImageFile(null);
    } catch (error) {
      showAlert("error", "Failed to add course. Try again.");
    }
    setLoading(false);
  };

  // Handle Course Deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "courses", id));
      showAlert("success", "Course deleted successfully!");
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      showAlert("error", "Failed to delete course.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Left - Add Course Form */}
      <div className="md:w-2/3 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl uppercase font-bold text-gray-800 mb-4 text-center">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Name */}
          <div className="relative">
            <FaBook className="absolute left-3 top-4 text-gray-500" />
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Course Name"
              required
            />
          </div>

          {/* Course Description */}
          <div className="relative">
            <FaTag className="absolute left-3 top-4 text-gray-500" />
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Course Description"
              rows="4"
              required
            />
          </div>

          {/* Course Duration */}
          <div className="relative">
            <FaClock className="absolute left-3 top-4 text-gray-500" />
            <select
              value={courseDuration}
              onChange={(e) => setCourseDuration(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
            </select>
          </div>

          {/* Course Price */}
          <div className="relative">
            <FaDollarSign className="absolute left-3 top-4 text-gray-500" />
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Course Price (₹)"
              required
            />
          </div>

             {/* Course Banner Upload */}
             <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
            <FaImage className="text-gray-500 text-xl mx-auto" />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer flex items-center justify-center gap-2 text-blue-600 hover:underline">
              <FaCloudUploadAlt size={20} />
              {imageFile ? "File Selected" : "Upload Course Banner"}
            </label>
            {imageFile && (
              <img src={URL.createObjectURL(imageFile)} alt="Course Banner" className="mt-2 w-full h-40 object-cover rounded-md" />
            )}
          </div>

          {/* Course Features */}
          {courseFeatures.map((feature, index) => (
            <div key={index} className="relative">
              <FaCheckCircle className="absolute left-3 top-4 text-gray-500" />
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const updatedFeatures = [...courseFeatures];
                  updatedFeatures[index] = e.target.value;
                  setCourseFeatures(updatedFeatures);
                }}
                className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="Course Feature"
              />
            </div>
          ))}
          <button type="button" onClick={() => setCourseFeatures([...courseFeatures, ""])} className="text-blue-500 hover:underline">
            + Add Feature
          </button>

          {/* Submit Button with Loader */}
          <button type="submit" className="w-full uppercase font-bold bg-blue-500 text-white p-3 rounded-md flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin" /> : "Add Course"}
          </button>
        </form>
      </div>

      {/* Right - Course List */}
      <div className="md:w-1/3">
        <h3 className="text-2xl font-semibold mb-4">Existing Courses</h3>
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="bg-white shadow-md p-4 rounded-lg flex items-center justify-between">
            <div className="flex gap-4">
            <img src={course.banner} alt={course.name} className="w-16 h-16 object-cover rounded-md" />
             <div>
             <span className="font-bold text-black ">{course.name}</span>
             <p className="text-[14px]">{course.duration}</p>
             <p>₹ {course.price}</p>
             </div>
            </div>
            <div className="flex flex-col gap-4">
            <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
              <button onClick={() => handleDelete(course.id)} className="text-green-500 hover:text-green-700">
                <FaPen />
              </button>
            </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
