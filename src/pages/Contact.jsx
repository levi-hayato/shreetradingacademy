import { useState, useContext } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { IoMail, IoPerson, IoCall, IoChatbubble } from "react-icons/io5";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { Send, Loader2 } from "lucide-react";
import Lottie from "lottie-react";
import contactAnimation from "../assets/contact.json"; // Ensure this file exists

const Contact = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    contact: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showAlert("error", "Please log in to send a message.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        uid: user.uid,
        timestamp: new Date(),
      });

      showAlert("success", "Message sent successfully!");
      setFormData({ ...formData, contact: "", message: "" });
    } catch (error) {
      showAlert("error", "Failed to send message.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-10 p-20 px-90 bg-white rounded-lg mt-10">
      {/* Left - Contact Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">Contact Us</h2>

        {alert && (
          <div className={`text-white px-4 py-2 rounded mb-4 ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {alert.message}
          </div>
        )}

        <form className="space-y-4">
          <div className="flex items-center border p-2 rounded transition-all duration-300 focus-within:border-blue-500">
            <IoPerson className="text-gray-400 mr-2 transition-all duration-300 group-focus-within:text-blue-500" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full outline-none text-gray-700 focus:text-black"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={!!user?.displayName}
            />
          </div>

          <div className="flex items-center border p-2 rounded transition-all duration-300 focus-within:border-blue-500">
            <IoMail className="text-gray-400 mr-2 transition-all duration-300 group-focus-within:text-blue-500" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full outline-none text-gray-700 focus:text-black"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={!!user?.email}
            />
          </div>

          <div className="flex items-center border p-2 rounded transition-all duration-300 focus-within:border-blue-500">
            <IoCall className="text-gray-400 mr-2 transition-all duration-300 group-focus-within:text-blue-500" />
            <input
              type="tel"
              name="contact"
              placeholder="Your Contact"
              className="w-full outline-none text-gray-700 focus:text-black"
              required
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start border p-2 rounded transition-all duration-300 focus-within:border-blue-500">
            <IoChatbubble className="text-gray-400 mr-2 mt-1 transition-all duration-300 group-focus-within:text-blue-500" />
            <textarea
              name="message"
              placeholder="Your Message"
              className="w-full outline-none resize-none h-20 text-gray-700 focus:text-black"
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />} {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Right - Lottie Animation & Social Links */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <Lottie animationData={contactAnimation} className="w-72 h-72" loop={true} />

        {/* Social Links */}
        <div className="flex gap-6 mt-6">
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-pink-500 transition-all">
            <FaInstagram size={28} />
          </a>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition-all">
            <FaLinkedin size={28} />
          </a>
          <a href="mailto:your-email@example.com" className="text-blue-500 hover:text-red-600 transition-all">
            <FaEnvelope size={28} />
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-green-500 transition-all">
            <FaWhatsapp size={28} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
