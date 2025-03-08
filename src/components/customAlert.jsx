import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const alertTypes = {
  success: { icon: <FaCheckCircle />, bgColor: "bg-green-100", textColor: "text-green-700", border: "border-green-500" },
  warning: { icon: <FaExclamationTriangle />, bgColor: "bg-yellow-100", textColor: "text-yellow-700", border: "border-yellow-500" },
  error: { icon: <FaTimesCircle />, bgColor: "bg-red-100", textColor: "text-red-700", border: "border-red-500" },
  info: { icon: <FaInfoCircle />, bgColor: "bg-blue-100", textColor: "text-blue-700", border: "border-blue-500" },
};

export default function Alert({ type = "info", message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-3 border-l-4 rounded-md shadow-md z-50 ${alertTypes[type].bgColor} ${alertTypes[type].border} ${alertTypes[type].textColor}`}>
      <div className="flex items-center">
        <span className="text-lg">{alertTypes[type].icon}</span>
        <span className="ml-3 flex-1">{message}</span>
        <button className="ml-4 text-gray-600 hover:text-gray-800" onClick={() => setVisible(false)}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
}
