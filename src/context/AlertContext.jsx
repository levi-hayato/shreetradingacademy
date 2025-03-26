// AlertContext.js
import { createContext, useContext, useState } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message, duration = 5000) => {
    setAlert({ type, message });
    
    if (duration) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}