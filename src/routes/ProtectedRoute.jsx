import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children }) => {
  const [user] = useAuthState(auth);

  return user ? children : <Navigate to={'/log'}/>;
};

export default ProtectedRoute;
