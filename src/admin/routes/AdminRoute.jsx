import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../components/Loader";

const AdminRoute = ({ children }) => {
    const { user, loading } = useUser();
    const [isAdmin, setIsAdmin] = useState(null); // ✅ Tracks if user is admin

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setIsAdmin(false);
                return;
            }

            // 🔹 Query Firestore to Check If User is an Admin
            const q = query(collection(db, "admins"), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            setIsAdmin(!querySnapshot.empty); // ✅ If admin exists, set true
        };

        checkAdmin();
    }, [user]);

    if (loading || isAdmin === null) {
        return <Loader />; // ✅ Prevents redirection before Firestore check is complete
    }

    return isAdmin ? children : <Navigate to="/dash" />; // ✅ Redirect if NOT admin
};

export default AdminRoute;
