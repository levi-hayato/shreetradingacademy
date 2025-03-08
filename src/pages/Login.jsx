import { useState, useEffect } from "react";
import { db, auth, googleProvider } from "../firebase/firebase";
import { doc, getDoc , setDoc } from "firebase/firestore";
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "students", user.uid));
        let userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "User",
            photo: user.photoURL || ""
        };

        if (userDoc.exists()) {
            const userInfo = userDoc.data();
            userData.name = userInfo.name || userData.name;
            userData.photo = userInfo.photo || userData.photo;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        showAlert("success", "Login successful!");
        setTimeout(() => navigate("/student"), 2000);
    } catch (error) {
        showAlert("error", "Invalid email or password!");
    }
    setLoading(false);
};




const handleGoogleSignIn = async () => {
  setGoogleLoading(true);
  try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Fetch user from Firestore
      const userDoc = await getDoc(doc(db, "students", user.uid));
      
      // If user does not exist in Firestore, save their details
      if (!userDoc.exists()) {
          await setDoc(doc(db, "students", user.uid), {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              photo: user.photoURL
          });
      }

      // Update the user state
      const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      showAlert("success", "Google Login successful!");
      setTimeout(() => navigate("/student"), 2000);
  } catch (error) {
      showAlert("error", "An error occurred during Google login!");
  }
  setGoogleLoading(false);
};

  return (
    <div className="max-w-md mx-auto mt-20 p-8 mb-40 bg-white shadow-lg rounded-lg relative">
      {alert.visible && (
        <div className={`absolute top-0 left-0 right-0 mx-auto p-3 text-white rounded flex items-center justify-between transition-opacity duration-300 ${alert.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
          <span>{alert.message}</span>
          <IoClose className="cursor-pointer" onClick={() => setAlert({ ...alert, visible: false })} />
        </div>
      )}

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

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
          <span className="animate-spin w-5 h-5 border-4  border-black border-t-transparent rounded-full"></span>
        ) : (
          <FcGoogle size={20} />
        )}
        {googleLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default Login;


// if i provide you a zip file of my project can you make it more optimized , faster and more structured for me