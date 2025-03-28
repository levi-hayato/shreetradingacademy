import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { 
  FaBook, FaClock, FaCheckCircle, FaMoneyBillWave, 
  FaUser, FaIdBadge, FaIdCard, FaRegCreditCard, FaStore 
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import StudentIDCard from "../student/components/StudentIDCard";
import Loader from "../components/Loader";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [codEnabled, setCodEnabled] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/register");
      return;
    }

    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such course!");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id, user, navigate]);

  const handleCOD = async () => {
    setProcessingPayment(true);
    try {
      await addDoc(collection(db, "offlinepurchase"), {
        uid: user.uid,
        courseId: id,
        courseName: course.name,
        name: user.displayName || "User Name",
        email: user.email,
        price: course.price,
        date: new Date(),
        status: "Pending Payment",
      });
      navigate("/student", { state: { success: "Your order has been placed successfully!" } });
    } catch (error) {
      console.error("Error processing COD:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (codEnabled) return handleCOD();
    
    setProcessingPayment(true);
    try {
      const options = {
        key: "rzp_test_OQAJKOgQg5SpLv",
        amount: course.price * 100,
        currency: "INR",
        name: "Shree Trading",
        description: course.name,
        image: "/logo.png",
        handler: async (response) => {
          await addDoc(collection(db, "payments"), {
            uid: user.uid,
            courseId: id,
            courseName: course.name,
            name: user.name,
            email: user.email,
            price: course.price,
            transactionId: response.razorpay_payment_id,
            date: new Date(),
          });
          navigate("/student", { state: { success: "Payment successful!" } });
        },
        prefill: {
          name: user.name || "User Name",
          email: user.email,
          contact: user.mobile || "+91 XXXXXXXXXX",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Course Not Found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formattedDateTime = new Date().toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10 md:py-12"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Course Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl shadow-xl"
          >
            <img 
              src={course.banner} 
              alt={course.name} 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{course.name}</h1>
              <div className="flex items-center mt-2 text-white/90">
                <FaClock className="mr-2" />
                <span>Duration: {course.duration}</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-sm rounded-full shadow-lg flex items-center">
              <FaBook className="mr-2" /> {course.category || "Course"}
            </div>
          </motion.div>

          {/* Course Description */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
            <p className="text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4">
              {course.description}
            </p>
          </motion.div>

          {/* Course Features */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.features.map((feature, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start p-3 bg-gray-50 rounded-lg"
                >
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Section - Payment & User Info */}
        <div className="space-y-6">
          {/* Student ID Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <StudentIDCard email={user.email} />
          </motion.div>

          {/* Payment Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <FaMoneyBillWave className="mr-2" /> Payment Summary
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{course.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course ID:</span>
                  <span className="font-medium">{course.courseID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formattedDateTime}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{course.price}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codEnabled}
                      onChange={() => setCodEnabled(!codEnabled)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium flex items-center">
                      <FaStore className="mr-2" /> Pay Offline
                    </span>
                  </label>
                  
                  <button 
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showPaymentOptions ? "Hide Options" : "More Options"}
                  </button>
                </div>

                <AnimatePresence>
                  {showPaymentOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3">
                        <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <FaRegCreditCard className="text-blue-500 mr-3" />
                            <span>Credit/Debit Card</span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Popular</span>
                        </button>
                        <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <img src="/upi-icon.png" alt="UPI" className="w-6 h-6 mr-3" />
                          <span>UPI Payment</span>
                        </button>
                        <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <img src="/netbanking-icon.png" alt="Net Banking" className="w-6 h-6 mr-3" />
                          <span>Net Banking</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${
                    processingPayment 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {processingPayment ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : codEnabled ? (
                    <span className="flex items-center justify-center">
                      <FaStore className="mr-2" /> Place Order (COD)
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaRegCreditCard className="mr-2" /> Pay ₹{course.price} Now
                    </span>
                  )}
                </motion.button>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Secure payment processing. Your information is protected.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}