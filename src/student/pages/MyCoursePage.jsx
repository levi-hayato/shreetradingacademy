import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FaBookOpen, 
  FaChartLine,
  FaWallet,
  FaCertificate,
  FaUserTie,
  FaCalendarCheck,
  FaCheckCircle,
  FaDownload
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import certificateBg from '../../assets/certificateBg.jpg';

const MyCourses = () => {
  const [course, setCourse] = useState({
    courseName: "Advanced Stock Market Strategies: Mastering Trading & Investments",
    courseId: "XeNSQMUcJ1v2Xcm9xuom",
    date: new Date("March 31, 2025 12:35:59 GMT+0530"),
    email: "rushya@gmail.com",
    name: "Rushiraj Sonawane",
    price: 4999,
    status: "completed",
    transactionId: "pay_QDJDTfndy4Pkff",
    uid: "WSfQ1xv9fGgKfgMT5LT3gC7ZG9w1"
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(100);
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateCertificate = () => {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });

    // Add background image
    doc.addImage(certificateBg, 'JPEG', 0, 0, 297, 210); // A4 size in mm (landscape)

    // Set font styles
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138); // Dark blue color

    // Add certificate title
    doc.setFontSize(36);
    doc.text('CERTIFICATE OF COMPLETION', 148, 50, { align: 'center' });

    // Add decorative line
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(60, 60, 237, 60);

    // Add "This is to certify that" text
    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99); // Gray color
    doc.text('This is to certify that', 148, 80, { align: 'center' });

    // Add student name
    doc.setFontSize(28);
    doc.setTextColor(30, 58, 138);
    doc.text(course.name.toUpperCase(), 148, 95, { align: 'center' });

    // Add course completion text
    doc.setFontSize(14);
    doc.setTextColor(75, 85, 99);
    doc.text('has successfully completed the course', 148, 110, { align: 'center' });

    // Add course name
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text(`"${course.courseName}"`, 148, 125, { align: 'center', maxWidth: 200 });

    // Add completion date
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(`Completed on: ${formatDate(course.date)}`, 148, 140, { align: 'center' });

    // Add certificate ID
    doc.text(`Certificate ID: ${course.transactionId}`, 148, 150, { align: 'center' });

    // Add signature lines
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    
    // Left signature (Instructor)
    doc.text('________________________', 80, 170);
    doc.text('Course Instructor', 80, 175);
    doc.text('Market Experts Team', 80, 180);

    // Right signature (CEO)
    doc.text('________________________', 215, 170);
    doc.text('CEO', 215, 175);
    doc.text('Stock Market Academy', 215, 180);

    // Add watermark
  

    // Save the PDF
    doc.save(`Certificate_${course.name.replace(/\s+/g, '_')}.pdf`);
  };

  const getCourseModules = () => {
    return [
      { title: "Market Fundamentals", completed: true },
      { title: "Technical Analysis", completed: true },
      { title: "Options Trading", completed: true },
      { title: "Portfolio Management", completed: true },
      { title: "Risk Management", completed: true },
      { title: "Advanced Strategies", completed: true }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                  <FaCheckCircle className="mr-1" /> {course.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.courseName}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Master advanced trading techniques, portfolio management, and risk assessment strategies 
                to excel in today's dynamic stock markets.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <FaUserTie className="text-blue-500 mr-2" />
                  <span className="text-gray-700">Instructor: Market Experts Team</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarCheck className="text-blue-500 mr-2" />
                  <span className="text-gray-700">Enrolled: {formatDate(course.date)}</span>
                </div>
                <div className="flex items-center">
                  <GiMoneyStack className="text-blue-500 mr-2" />
                  <span className="text-gray-700">Paid: ₹{course.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-6">
                <span>{progress}% Completed</span>
                <span>Certificate Ready</span>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate(`/content/${course.courseId}`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaBookOpen className="mr-2" /> <span className='hidden md:block'>Continue Learning</span>
                </button>
                <button 
                  onClick={generateCertificate}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                >
                  <FaDownload className="mr-2" /> <span className='hidden md:block'>Download Certificate</span> 
                </button>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 p-8 flex flex-col justify-center">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaWallet className="mr-2" /> Payment Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-200">Transaction ID</p>
                    <p className="font-mono">{course.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Amount Paid</p>
                    <p className="text-2xl font-bold">₹{course.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Payment Status</p>
                    <p className="text-green-300 font-medium flex items-center">
                      <FaCheckCircle className="mr-1" /> {course.status.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Enrollment Date</p>
                    <p>{formatDate(course.date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;