import { auth } from "./firebase";

export const handleLogout = async () => {
    await auth.signOut();
};