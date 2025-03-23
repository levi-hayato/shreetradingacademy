import { useState, useEffect } from "react";
import { db, auth, googleProvider } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const navigate = useNavigate();


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Step 1: Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Step 2: Fetch user details from Firestore using the user's UID
            const studentDoc = await getDoc(doc(db, "students", user.uid)); // Corrected query
    
            let userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || "User",
                photo: user.photoURL || "",
                studentId: "", // Initialize studentId
                mobile: "", // Initialize mobile
                course: "", // Initialize course
                price: "", // Initialize price
                duration: "", // Initialize duration
            };
    
            if (studentDoc.exists()) {
                const studentInfo = studentDoc.data();
                console.log("Fetched Student Data from Firestore:", studentInfo); // Debugging
    
                // Step 3: Update userData with Firestore data
                userData.studentId = studentInfo.studentId || ""; // Fetch studentId
                userData.mobile = studentInfo.mobile || ""; // Fetch mobile
                userData.course = studentInfo.course || ""; // Fetch course
                userData.price = studentInfo.price || ""; // Fetch price
                userData.duration = studentInfo.duration || ""; // Fetch duration
                userData.name = studentInfo.name || userData.name;
                userData.photo = studentInfo.photo || userData.photo;
            } else {
                console.log("No student document found for uid:", user.uid); // Debugging
            }
    
            // Step 4: Save user data to context and localStorage
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            console.log("User Data saved to context and localStorage:", userData); // Debugging
    
            showAlert("success", "Login successful!");
            setTimeout(() => navigate("/student"), 2000);
        } catch (error) {
            console.error("Login Error:", error); // Debugging
            showAlert("error", "Invalid email or password!");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            // Step 1: Sign in with Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Step 2: Fetch student details from Firestore
            const userDoc = await getDoc(doc(db, "students", user.uid));

            let userData = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                studentId: "", // Initialize studentId
                mobile: "", // Initialize mobile
                course: "", // Initialize course
                price: "", // Initialize price
                duration: "", // Initialize duration
            };

            if (userDoc.exists()) {
                const userInfo = userDoc.data();
                userData.studentId = userInfo.studentId || ""; // Fetch studentId
                userData.mobile = userInfo.mobile || ""; // Fetch mobile
                userData.course = userInfo.course || ""; // Fetch course
                userData.price = userInfo.price || ""; // Fetch price
                userData.duration = userInfo.duration || ""; // Fetch duration
            } else {
                // If user is new, store data in Firestore
                const newStudentId = Math.floor(100000 + Math.random() * 900000).toString();
                await setDoc(doc(db, "students", user.uid), {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    studentId: newStudentId, // Generate studentId for new user
                    mobile: "",
                    course: "",
                    price: "",
                    duration: "",
                });
                userData.studentId = newStudentId;
            }

            // Step 3: Save user data to context and localStorage
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            showAlert("success", "Google Login successful!");
            setTimeout(() => navigate("/student"), 2000);
        } catch (error) {
            console.error("Google Login Error:", error); // Debugging
            localStorage.removeItem("user");
            showAlert("error", "An error occurred during Google login!");
        }
        setGoogleLoading(false);
    };

    return (
        <div className="flex p-auto m-auto h-screen justify-center items-center gap-20">
            <div className="p-8 mb-20 bg-white rounded-lg relative">
                {alert.visible && (
                    <div className={`absolute top-0 left-0 right-0 mx-auto p-3 text-white rounded flex items-center justify-between transition-opacity duration-300 ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}>
                        <span>{alert.message}</span>
                        <IoClose className="cursor-pointer" onClick={() => setAlert({ ...alert, visible: false })} />
                    </div>
                )}

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 uppercase">Login</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                        <FaUser className="text-gray-500 mx-2" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                        <FaLock className="text-gray-500 mx-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span> : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center text-gray-500 text-sm">or</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-200 mt-4"
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <span className="animate-spin w-5 h-5 border-4 border-black border-t-transparent rounded-full"></span>
                    ) : (
                        <FcGoogle size={20} />
                    )}
                    {googleLoading ? "Signing in..." : "Sign in with Google"}
                </button>
            </div>

            <div className="flex mb-20 items-center justify-center bg-gradient-to-r">
                <div className="w-60 h-60 bg-gradient-to-r from-indigo-500 to-blue-400 animate-morph"></div>
            </div>
        </div>
    );
};

export default Login;