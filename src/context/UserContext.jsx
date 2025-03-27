import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Loader from '../components/Loader';

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
                    studentId: "", // Initialize studentId
                    mobile: "", // Initialize mobile
                    course: "", // Initialize course
                    price: "", // Initialize price
                    duration: "", // Initialize duration
                };

                try {
                    // Fetch additional user data from Firestore
                    const studentDoc = await getDoc(doc(db, "students", authUser.uid));
                    if (studentDoc.exists()) {
                        const studentInfo = studentDoc.data();
                        console.log("Fetched Student Data from Firestore:", studentInfo); // Debugging

                        // Update userData with Firestore data
                        userData.studentId = studentInfo.studentId || ""; // Fetch studentId
                        userData.mobile = studentInfo.mobile || ""; // Fetch mobile
                        userData.course = studentInfo.course || ""; // Fetch course
                        userData.price = studentInfo.price || ""; // Fetch price
                        userData.duration = studentInfo.duration || ""; // Fetch duration
                        userData.name = studentInfo.name || userData.name;
                        userData.photo = studentInfo.photo || userData.photo;
                    }

                    // Save user data to context and localStorage
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
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
            {loading ? <Loader /> : children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);