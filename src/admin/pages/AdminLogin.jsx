import { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🔹 Query Firestore to Check If User is an Admin
            const q = query(collection(db, "admins"), where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("Access Denied! Only Admins can log in.");
                setLoading(false);
                return;
            }

            // 🔹 Authenticate the Admin with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔹 Extract Admin Data from Firestore
            const adminData = querySnapshot.docs[0].data();

            // 🔹 Store Admin Info with `role: "admin"`
            const userData = {
                uid: user.uid,
                name: adminData.name,
                email: adminData.email,
                photo: adminData.photo || "",
                role: adminData.role,  // ✅ Fetch `role: "admin"` from Firestore
            };

            localStorage.setItem("user", JSON.stringify(userData));

            alert("Login Successful! Redirecting...");
            navigate("/dash");
        } catch (error) {
            alert("Invalid Admin Credentials!");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="email" placeholder="Admin Email" className="w-full p-2 border rounded"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />

                <input type="password" placeholder="Password" className="w-full p-2 border rounded"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
