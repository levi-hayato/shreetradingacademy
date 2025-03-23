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
    name: user?.name || "",
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Contact Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>

          {alert && (
            <div
              className={`text-white px-4 py-2 rounded mb-4 ${
                alert.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {alert.message}
            </div>
          )}

          <form className="space-y-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent peer"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={!!user?.name}
              />
              <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-500">
                Your Name
              </label>
              <IoPerson className="absolute right-2 top-2 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent peer"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={!!user?.email}
              />
              <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-500">
                Your Email
              </label>
              <IoMail className="absolute right-2 top-2 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="tel"
                name="contact"
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent peer"
                required
                value={formData.contact}
                onChange={handleChange}
              />
              <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-500">
                Your Contact
              </label>
              <IoCall className="absolute right-2 top-2 text-gray-400" />
            </div>

            <div className="relative">
              <textarea
                name="message"
                placeholder=" "
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent peer resize-none"
                required
                value={formData.message}
                onChange={handleChange}
              />
              <label className="absolute left-0 -top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-500">
                Your Message
              </label>
              <IoChatbubble className="absolute right-2 top-2 text-gray-400" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}{" "}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Right - Lottie Animation & Social Links */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 p-8 flex flex-col items-center justify-center">
          <div className="animate-float">
            <Lottie animationData={contactAnimation} className="w-72 h-72" loop={true} />
          </div>

          {/* Social Links */}
          <div className="flex gap-6 mt-8">
            <a
              href="https://www.instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-300 transition-all transform hover:scale-110"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://www.linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 transition-all transform hover:scale-110"
            >
              <FaLinkedin size={28} />
            </a>
            <a
              href="mailto:your-email@example.com"
              className="text-white hover:text-red-200 transition-all transform hover:scale-110"
            >
              <FaEnvelope size={28} />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-300 transition-all transform hover:scale-110"
            >
              <FaWhatsapp size={28} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;