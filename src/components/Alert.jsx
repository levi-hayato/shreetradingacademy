import React, { useEffect } from "react";

const Alert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const alertStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={`fixed top-5 right-5 text-white px-4 py-2 rounded shadow-lg z-100 ${alertStyles[type]}`}>
      {message}
    </div>
  );
};

export default Alert;
