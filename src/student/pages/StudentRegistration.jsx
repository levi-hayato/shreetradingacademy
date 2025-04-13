import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { IoClose, IoMail, IoLockClosed, IoPerson, IoImage, IoKey, IoCalendar, IoCall } from "react-icons/io5";
import { FaArrowLeft, FaBookOpen, FaRupeeSign } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAlertContext } from "../../context/AlertContext";
import { TailSpin } from "react-loader-spinner";

const StudentRegistration = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { showAlert } = useAlertContext();

    const [student, setStudent] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        course: "",
        price: "",
        duration: "",
    });

    const [courses, setCourses] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const querySnapshot = await getDocs(collection(db, "courseData"));
            const coursesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCourses(coursesData);
        };
        fetchCourses();
    }, []);

    const generateStudentId = async () => {
        let studentId;
        let isUnique = false;

        while (!isUnique) {
            studentId = Math.floor(100000 + Math.random() * 900000).toString();
            const q = query(collection(db, "students"), where("studentId", "==", studentId));
            const querySnapshot = await getDocs(q);
            isUnique = querySnapshot.empty;
        }

        return studentId;
    };

    const handleCourseChange = (e) => {
        const selectedCourse = courses.find(course => course.id === e.target.value);
        if (selectedCourse) {
            setStudent({
                ...student,
                course: selectedCourse.name,
                price: selectedCourse.price,
                duration: selectedCourse.duration,
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showAlert("error", "File size should be less than 5MB!");
            return;
        }
        if (!file.type.startsWith("image/")) {
            showAlert("error", "Please select a valid image file!");
            return;
        }

        setImageFile(URL.createObjectURL(file));
        setShowCropper(true);
    };

    const handleCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            const croppedImg = await getCroppedImg(imageFile, croppedAreaPixels);
            setCroppedImage(croppedImg);
            setShowCropper(false);
        } catch (error) {
            showAlert("error", "Failed to crop image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (student.password !== student.confirmPassword) {
            showAlert("error", "Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, "students"), where("email", "==", student.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                showAlert("error", "Email is already registered!");
                setLoading(false);
                return;
            }

            const studentId = await generateStudentId();

            let imageUrl = "";
            if (croppedImage) {
                imageUrl = await uploadToCloudinary(croppedImage);
            }

            const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: student.name,
                photoURL: imageUrl,
            });

            await addDoc(collection(db, "students"), {
                uid: user.uid,
                studentId,
                name: student.name,
                email: student.email,
                course: student.course,
                mobile: student.mobile,
                price: student.price,
                duration: student.duration,
                photo: imageUrl,
                dateJoined: new Date(),
            });

            setUser({
                uid: user.uid,
                studentId,
                name: student.name,
                email: student.email,
                course: student.course,
                mobile: student.mobile,
                photo: imageUrl,
            });

            localStorage.setItem("user", JSON.stringify({
                uid: user.uid,
                studentId,
                name: student.name,
                email: student.email,
                course: student.course,
                mobile: student.mobile,
                photo: imageUrl,
            }));

            showAlert("success", "Registration successful!");
            setTimeout(() => navigate("/student"), 2000);
        } catch (error) {
            showAlert("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Registration Form */}
                    <div className="w-full lg:w-1/2 p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Student Registration</h1>
                            <p className="text-gray-500 mt-2">Join our learning community today</p>
                        </div>

                        {/* Profile Image Upload */}
                        <div className="flex justify-center mb-6">
                            <label className="cursor-pointer group">
                                <div className="relative">
                                    {croppedImage ? (
                                        <img 
                                            src={croppedImage} 
                                            alt="Profile" 
                                            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md group-hover:border-blue-200 transition-all duration-300"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border-4 border-dashed border-gray-300 group-hover:border-blue-300 transition-all duration-300">
                                            <div className="text-center">
                                                <IoImage className="text-blue-500 text-4xl mx-auto" />
                                                <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md group-hover:bg-blue-600 transition-all">
                                        <IoImage className="text-lg" />
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                />
                            </label>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoPerson className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        value={student.name}
                                        onChange={(e) => setStudent({ ...student, name: e.target.value })}
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoMail className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        value={student.email}
                                        onChange={(e) => setStudent({ ...student, email: e.target.value })}
                                    />
                                </div>

                                {/* Mobile */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoCall className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        value={student.mobile}
                                        onChange={(e) => setStudent({ ...student, mobile: e.target.value })}
                                    />
                                </div>

                                {/* Course Selection */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBookOpen className="text-gray-400" />
                                    </div>
                                    <select
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        onChange={handleCourseChange}
                                        required
                                    >
                                        <option className="rounded-full" value="">Select Course</option>
                                        {courses.map((course) => (
                                            <option className=" bg-white" key={course.id} value={course.id}>
                                                {course.name} - ₹{course.price}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoLockClosed className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        value={student.password}
                                        onChange={(e) => setStudent({ ...student, password: e.target.value })}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoKey className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        value={student.confirmPassword}
                                        onChange={(e) => setStudent({ ...student, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all ${
                                    loading 
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                            >
                                {loading ? (
                                    <TailSpin color="#ffffff" height={20} width={20} />
                                ) : (
                                    "Register Now"
                                )}
                            </button>
                             <button onClick={() => navigate('/')} className="w-full flex items-center justify-center mt-4 text-white font-semibold py-3 px-4 rounded-lg hover:text-black border bg-blue-600 border-gray-200 hover:bg-gray-50 transition-all"
                                                > <FaArrowLeft className="mr-2"/> Go Back</button>
                        </form>
                    </div>

                    {/* Right Section - Visual Content */}
                    <div className="hidden lg:block w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                        <div className="absolute inset-0 flex items-center justify-center p-10">
                            <div className="text-center text-white">
                                <h2 className="text-3xl font-bold mb-4">Welcome to Our Academy</h2>
                                <p className="text-blue-100 mb-8 text-lg">
                                    Start your learning journey with our expert instructors and comprehensive courses
                                </p>
                                <div className="relative w-64 h-64 mx-auto">
                                    <motion.div
                                        className="absolute w-full h-full bg-white/10 rounded-full backdrop-blur-sm"
                                        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute w-3/4 h-3/4 bg-white/5 rounded-lg backdrop-blur-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                        animate={{ rotate: [0, -360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-40 h-40 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center">
                                                <FaBookOpen className="text-white text-3xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Image Cropper Modal */}
            <AnimatePresence>
                {showCropper && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Crop Profile Image</h3>
                                    <button 
                                        onClick={() => setShowCropper(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <IoClose size={24} />
                                    </button>
                                </div>
                                <div className="relative w-full h-64">
                                    <Cropper
                                        image={imageFile}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={handleCropComplete}
                                        cropShape="round"
                                        showGrid={false}
                                        classes={{
                                            containerClassName: "rounded-lg",
                                            mediaClassName: "rounded-lg",
                                        }}
                                    />
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(e.target.value)}
                                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setShowCropper(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCropSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Save Crop
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentRegistration;