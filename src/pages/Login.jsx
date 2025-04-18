import { useState, useEffect } from "react";
import { db, auth, googleProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiLock, FiCalendar, FiPhone, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const [showPopup, setShowPopup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [courses, setCourses] = useState([]);
    const [additionalDetails, setAdditionalDetails] = useState({
        mobile: "",
        course: "",
        duration: "",
        joiningDate: new Date().toISOString().split("T")[0],
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesCollection = collection(db, "courses");
            const coursesSnapshot = await getDocs(coursesCollection);
            const coursesList = coursesSnapshot.docs.map(doc => ({
                name: doc.data().name,
                duration: doc.data().duration,
            }));
            setCourses(coursesList);
        };

        fetchCourses();

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ ...alert, visible: false }), 4000);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            showAlert("error", "Please enter your email address first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            showAlert("success", "Password reset link sent to your email!");
            setShowForgotPassword(false);
        } catch (error) {
            console.error("Password reset error:", error);
            showAlert("error", "Failed to send reset email. Please check your email address.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch student data by email instead of UID
            const studentsRef = collection(db, "students");
            const q = query(studentsRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            let userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || "User",
                photo: user.photoURL || "",
                studentId: "",
                mobile: "",
                course: "",
                price: "",
                duration: "",
            };

            if (!querySnapshot.empty) {
                const studentDoc = querySnapshot.docs[0];
                const studentInfo = studentDoc.data();
                userData.studentId = studentInfo.studentId || "";
                userData.mobile = studentInfo.mobile || "";
                userData.course = studentInfo.course || "";
                userData.price = studentInfo.price || "";
                userData.duration = studentInfo.duration || "";
                userData.name = studentInfo.name || userData.name;
                userData.photo = studentInfo.photo || userData.photo;
            }

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            showAlert("success", "Login successful!");
            setTimeout(() => navigate("/student"), 2000);
        } catch (error) {
            console.error("Login Error:", error);
            showAlert("error", "Invalid email or password!");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Fetch student data by email for Google sign-in too
            const studentsRef = collection(db, "students");
            const q = query(studentsRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            let userData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                studentId: "",
                mobile: "",
                course: "",
                price: "",
                duration: "",
            };

            if (!querySnapshot.empty) {
                const studentDoc = querySnapshot.docs[0];
                const studentInfo = studentDoc.data();
                userData.studentId = studentInfo.studentId || "";
                userData.mobile = studentInfo.mobile || "";
                userData.course = studentInfo.course || "";
                userData.price = studentInfo.price || "";
                userData.duration = studentInfo.duration || "";
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                showAlert("success", "Google Login successful!");
                setTimeout(() => navigate("/student"), 2000);
            } else {
                setShowPopup(true);
                setUser(userData);
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            localStorage.removeItem("user");
            showAlert("error", "An error occurred during Google login!");
        }
        setGoogleLoading(false);
    };

    const handleCourseChange = (e) => {
        const selectedCourse = courses.find(course => course.name === e.target.value);
        setAdditionalDetails({
            ...additionalDetails,
            course: selectedCourse.name,
            duration: selectedCourse.duration,
        });
    };

    const handleAdditionalDetailsSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const newStudentId = Math.floor(100000 + Math.random() * 900000).toString();
        const userData = {
            ...additionalDetails,
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            studentId: newStudentId,
        };

        await setDoc(doc(db, "students", user.uid), userData);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        showAlert("success", "Registration successful!");
        setShowPopup(false);
        setTimeout(() => navigate("/student"), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <AnimatePresence>
                {alert.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 ${alert.type === "success"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}
                    >
                        <div className="font-medium">{alert.message}</div>
                        <button
                            onClick={() => setAlert({ ...alert, visible: false })}
                            className="text-current hover:opacity-70"
                        >
                            <IoClose size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Left Column - Login Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                            <p className="text-gray-500 mt-2">Sign in to access your student dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="text-sm text-blue-600 hover:text-blue-800">
                                            {showPassword ? <FiEye color="black" /> : <FiEyeOff color="black" />}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all ${loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                    }`}
                            >
                                {loading ? (
                                    <TailSpin color="#ffffff" height={20} width={20} />
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-3 text-gray-500 text-sm">OR</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            {googleLoading ? (
                                <TailSpin color="#3b82f6" height={20} width={20} />
                            ) : (
                                <>
                                    <FcGoogle className="mr-2" size={20} />
                                    Continue with Google
                                </>
                            )}
                        </button>
                        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center mt-4 text-white font-semibold py-3 px-4 rounded-lg hover:text-black border bg-blue-600 border-gray-200 hover:bg-gray-50 transition-all"
                        > <FaArrowLeft className="mr-2" /> Go Back</button>
                    </div>

                    {/* Right Column - Decorative */}
                    <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                        <div className="absolute inset-0 flex items-center justify-center p-10">
                            <div className="text-center text-white">
                                <h2 className="text-3xl font-bold mb-4">Student Portal</h2>
                                <p className="text-blue-100 mb-8">
                                    Access your courses, track progress, and connect with instructors
                                </p>
                                <div className="flex justify-center">
                                    <div className="w-48 h-48 bg-white/10 rounded-full backdrop-blur-sm animate-morph">
                                        <div className="w-40 h-40 bg-white/10 rounded-full backdrop-blur-sm animate-morph">
                                            <div className="w-30 h-30 bg-white/10 rounded-full backdrop-blur-sm animate-morph"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Additional Details Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Complete Registration</h2>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <IoClose size={24} />
                                    </button>
                                </div>

                                <p className="text-gray-500 mb-6">
                                    Please provide some additional details to complete your registration
                                </p>

                                <form onSubmit={handleAdditionalDetailsSubmit} className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiPhone className="text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={additionalDetails.mobile}
                                            onChange={(e) => setAdditionalDetails({ ...additionalDetails, mobile: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <select
                                            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                                            value={additionalDetails.course}
                                            onChange={handleCourseChange}
                                            required
                                        >
                                            <option value="" disabled>Select Course</option>
                                            {courses.map((course, index) => (
                                                <option key={index} value={course.name}>{course.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiCalendar className="text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={additionalDetails.joiningDate}
                                            onChange={(e) => setAdditionalDetails({ ...additionalDetails, joiningDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Complete Registration
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forgot Password Popup */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                                    <button
                                        onClick={() => setShowForgotPassword(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <IoClose size={24} />
                                    </button>
                                </div>

                                <p className="text-gray-500 mb-6">
                                    Enter your email address and we'll send you a link to reset your password
                                </p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Your Email Address"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        onClick={handleForgotPassword}
                                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Send Reset Link
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

export default Login;