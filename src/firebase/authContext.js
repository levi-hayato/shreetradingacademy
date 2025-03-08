import { auth } from "./firebase";

export const handleLogout = async () => {
    try {
        await auth.signOut();
        localStorage.removeItem("user"); // Clear stored user data
        window.location.href = "/log"; // Redirect to login page
    } catch (error) {
        console.error("Logout Error:", error);
    }
};
