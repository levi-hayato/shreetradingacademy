import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Loader from '../components/Loader'

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                let userData = {
                    uid: authUser.uid,
                    name: authUser.displayName || "User",
                    email: authUser.email,
                    photo: authUser.photoURL || "",
                    role: null // ✅ Default role set to null to force role update
                };

                try {
                    // 🔹 Fetch Admin Role First
                    const adminDoc = await getDoc(doc(db, "admins", authUser.uid));
                    if (adminDoc.exists()) {
                        const adminInfo = adminDoc.data();
                        userData.role = "admin";
                        userData.name = adminInfo.name || userData.name;
                        userData.photo = adminInfo.photo || userData.photo;
                    } else {
                        // 🔹 If Not Admin, Fetch Student Role
                        const studentDoc = await getDoc(doc(db, "students", authUser.uid));
                        if (studentDoc.exists()) {
                            const studentInfo = studentDoc.data();
                            userData.role = "student";
                            userData.name = studentInfo.name || userData.name;
                            userData.photo = studentInfo.photo || userData.photo;
                        } else {
                            userData.role = "guest"; // ✅ Fallback role
                        }
                    }

                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store updated user data
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {loading ? <Loader/> : children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
