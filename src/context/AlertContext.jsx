import { createContext, useState, useContext } from "react";
import Alert from "../components/customAlert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message, duration = 3000) => {
    setAlert({ type, message, duration });
    setTimeout(() => setAlert(null), duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <Alert type={alert.type} message={alert.message} duration={alert.duration} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
