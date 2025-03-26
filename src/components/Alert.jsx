import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

const Alert = ({ type = "info", message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the transition duration
  };

  const alertConfig = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-800",
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-rose-800",
      icon: <FiXCircle className="w-5 h-5" />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: <FiInfo className="w-5 h-5" />,
    },
  };

  const { bg, text, icon } = alertConfig[type];

  return (
    <div className={`fixed top-5 right-5 z-50 transition-all duration-300 ${isClosing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}`}>
      <div className={`flex items-start max-w-xs md:max-w-sm rounded-lg border shadow-lg overflow-hidden ${bg}`}>
        <div className={`flex-shrink-0 p-3 ${text}`}>
          {icon}
        </div>
        <div className="flex-1 p-3">
          <p className={`text-sm font-medium ${text}`}>{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;