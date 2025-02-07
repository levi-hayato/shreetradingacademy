import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                let userData = {
                    uid: authUser.uid,
                    name: authUser.displayName || "User",
                    email: authUser.email,
                    photo: authUser.photoURL || ""
                };

                // Fetch from Firestore for additional data
                const userDoc = await getDoc(doc(db, "students", authUser.uid));
                if (userDoc.exists()) {
                    const userInfo = userDoc.data();
                    userData.name = userInfo.name || userData.name;
                    userData.photo = userInfo.photo || userData.photo;
                }

                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
