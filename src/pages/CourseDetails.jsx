import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { FaBook, FaClock, FaCheckCircle, FaMoneyBillWave, FaUser, FaIdBadge, FaIdCard } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import StudentIDCard from "../student/components/StudentIDCard";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [codEnabled, setCodEnabled] = useState(false);

  useEffect(() => {
    if (!user) {
      // Redirect to register if user is not logged in
      navigate("/register");
      return;
    }

    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse(docSnap.data());
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

      alert("Your order has been placed successfully! You will receive further details soon.");
      navigate("/student");
    } catch (error) {
      console.error("Error processing COD:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (codEnabled) {
      handleCOD();
      return;
    }

    setProcessingPayment(true);

    try {
      const options = {
        key: "rzp_test_OQAJKOgQg5SpLv",
        amount: course.price * 100,
        currency: "INR",
        name: "Shree Trading",
        description: course.name,
        image: "/logo.png",
        handler: async function (response) {
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

          alert("Payment successful! Redirecting...");
          navigate("/student");
        },
        prefill: {
          name: user.name || "User Name",
          email: user.email,
          contact: user.mobile || "+91 XXXXXXXXXX",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
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

  if (loading) {
    return <div className="text-center text-xl font-semibold mt-10 animate-pulse">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center text-xl font-semibold mt-10 text-red-500">Course not found.</div>;
  }

  const now = new Date();
const formattedDateTime = now.toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section - Course Info */}
      <div className="md:col-span-2 bg-white shadow-xl rounded-lg border border-gray-200 p-6">
        <div className="relative">
          <img src={course.banner} alt={course.name} className="w-full h-64 object-cover rounded-md shadow-md" />
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 text-sm rounded-md shadow-lg">
            <FaBook className="inline-block mr-1" /> {course.name}
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mt-4">{course.name}</h2>
        <p className="text-gray-600 text-lg mt-1">
          <FaClock className="inline-block text-gray-500" /> Duration: {course.duration}
        </p>
        <p className="text-gray-700 mt-4 border-l-4 border-blue-500 pl-4 text-lg">{course.description}</p>

        {/* Course Features */}
        <h3 className="text-2xl font-semibold mt-6">Course Features</h3>
        <ul className="mt-2 space-y-2">
          {course.features.map((feature, index) => (
            <li key={index} className="text-gray-700 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section - User & Payment Cards */}
      <div className="space-y-6">
        {/* User Info Card */}
       
       <StudentIDCard email={user.email} />

        {/* Payment Bill Card with COD Option */}
        <div className="bg-white shadow-lg p-6 flex flex-col gap-2 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <FaMoneyBillWave className="text-green-500" /> <p>Payment Summary</p>
          </h3>
          <p className="mt-4 text-gray-700 flex justify-between"><strong>Course:</strong> <span>{course.name}</span></p>
          <p className="mt-4 text-gray-700 flex justify-between"><strong>Course ID:</strong> <span>{course.courseID}</span></p>
          <p className="text-gray-700 flex justify-between"><strong>Duration:</strong> <span>{course.duration}</span></p>
          <p className="text-gray-700 flex justify-between"><strong>Date:</strong> <span>{formattedDateTime}</span></p>
          <p className="text-lg font-bold text-blue-600 flex justify-between"><strong>Total Amount:</strong> <span>₹{course.price}</span></p>

          {/* Cash on Delivery Checkbox */}
          <label className="mt-4 flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={codEnabled} onChange={() => setCodEnabled(!codEnabled)} className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Pay Offline</span>
          </label>

          {/* Register Button */}
          <button
            onClick={handlePayment}
            disabled={processingPayment}
            className="mt-6 w-full font-bold bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all duration-300 shadow-md"
          >
            {processingPayment ? "Processing..." : codEnabled ? "Place Order" : `PAY ₹${course.price}/-`}
          </button>
          <button onClick={() => {
            console.log(user);
          }}>youo</button>
        </div>
      </div>
    </div>
  );
}
