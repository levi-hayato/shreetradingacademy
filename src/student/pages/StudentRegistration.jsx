import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import uploadToCloudinary from "../../utils/uploadToCloudinary";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAlert } from "../../context/AlertContext";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { IoClose, IoMail, IoLockClosed, IoPerson, IoImage, IoKey, IoCalendar, IoCall } from "react-icons/io5";
import { FaBookOpen, FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";

const StudentRegistration = () => {
    const { setUser } = useContext(UserContext);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const [student, setStudent] = useState({
        name: "",
        email: "",
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
            const querySnapshot = await getDocs(collection(db, "courses"));
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
        <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            {/* Left Section - Registration Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-1/1 justify-around bg-white flex rounded-lg shadow-lg p-8 mx-4"
            >
              <div>
                  {/* Cropper Modal */}
                  {showCropper && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Crop Your Image</h2>
                            <div className="relative w-64 h-64">
                                <Cropper
                                    image={imageFile}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={handleCropComplete}
                                />
                            </div>
                            <div className="flex justify-between gap-4 mt-4">
                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowCropper(false)}>Cancel</button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCropSave}>Crop & Save</button>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Registration</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Profile Image Upload */}
                    <div className="flex justify-center">
                        <label className="cursor-pointer">
                            {croppedImage ? (
                                <img src={croppedImage} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-blue-500" />
                            ) : (
                                <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 transition">
                                    <IoImage className="text-blue-500 text-3xl" />
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    {/* Student Name */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <IoPerson className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Student Name"
                            className="w-full outline-none"
                            required
                            value={student.name}
                            onChange={(e) => setStudent({ ...student, name: e.target.value })}
                        />
                    </div>

                    {/* Student Email */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <IoMail className="text-gray-500 mr-2" />
                        <input
                            type="email"
                            placeholder="Student Email"
                            className="w-full outline-none"
                            required
                            value={student.email}
                            onChange={(e) => setStudent({ ...student, email: e.target.value })}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <IoCall className="text-gray-500 mr-2" />
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            className="w-full outline-none"
                            required
                            value={student.mobile}
                            onChange={(e) => setStudent({ ...student, mobile: e.target.value })}
                        />
                    </div>

                    {/* Course Selection */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <FaBookOpen className="text-gray-500 mr-2" />
                        <select
                            className="w-full outline-none"
                            onChange={handleCourseChange}
                            required
                        >
                            <option value="">Select a Course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} - ₹{course.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Password */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <IoLockClosed className="text-gray-500 mr-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none"
                            required
                            value={student.password}
                            onChange={(e) => setStudent({ ...student, password: e.target.value })}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg hover:border-blue-500 transition">
                        <IoKey className="text-gray-500 mr-2" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full outline-none"
                            required
                            value={student.confirmPassword}
                            onChange={(e) => setStudent({ ...student, confirmPassword: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
              </div>

               {/* Right Section - Shape Animation */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex items-center justify-center"
            >
                <div className="relative w-96 h-96">
                    {/* Animated Shapes */}
                    <motion.div
                        className="absolute w-100 h-100 bg-blue-400 rounded-full"
                        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-80 h-80 bg-indigo-400 rounded-lg"
                        animate={{ x: [0, 20, 0], rotate: [0, -360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-60 h-60 bg-purple-400 rounded-full"
                        animate={{ y: [0, 20, 0], rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
            </motion.div>

           
        </div>
    );
};

export default StudentRegistration;