import { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiLoader } from "react-icons/fi";
import { useAlertContext } from "../../context/AlertContext";// Make sure this path is correct
import { FaArrowLeft } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { showAlert } = useAlertContext();


  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is admin
      const q = query(collection(db, "admins"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showAlert('error', 'Access denied: Admin privileges required');
        setLoading(false);
        return;
      }

      // Authenticate
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Extract admin data
      const adminData = querySnapshot.docs[0].data();

      // Store admin info
      const userData = {
        uid: user.uid,
        name: adminData.name,
        email: adminData.email,
        photo: adminData.photo || "",
        role: adminData.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      showAlert('success', 'Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate("/dash");
      }, 1500);
      
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No admin found with this email';
      }
      showAlert('error', errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
    
        
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-blue-100 mt-1">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Admin Email"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
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
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Login
                </>
              )}
            </button>
             <button onClick={() => navigate('/')} className="w-full flex items-center justify-center text-white font-semibold py-3 px-4 rounded-lg hover:text-black border bg-blue-600 border-gray-200 hover:bg-gray-50 transition-all"
                                > <FaArrowLeft className="mr-2"/> Go Back</button>
            
            <div className="text-center text-sm text-gray-500">
              <p>For authorized personnel only</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;