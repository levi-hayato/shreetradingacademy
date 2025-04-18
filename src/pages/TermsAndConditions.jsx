import { motion } from 'framer-motion';
import { FaBook, FaMoneyBillWave, FaUserEdit, FaExclamationTriangle, FaGraduationCap } from 'react-icons/fa';
import { MdGavel, MdOutlinePolicy } from 'react-icons/md';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <MdGavel className="text-indigo-500" />,
      content: (
        <p>
          By accessing or using the Shree Trading Academy website and services, you agree to be bound by these Terms and Conditions. 
          If you do not agree with any part of these terms, you must not use our services.
        </p>
      )
    },
    {
      title: "Course Enrollment",
      icon: <FaGraduationCap className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be at least 18 years old to enroll in our courses</li>
            <li>All course purchases require accurate personal information</li>
            <li>Course access is granted only after successful payment</li>
            <li>Each enrollment is for individual use only - sharing accounts is prohibited</li>
          </ul>
        </div>
      )
    },
    {
      title: "Payments and Refunds",
      icon: <FaMoneyBillWave className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li>All prices are in Indian Rupees (₹) unless otherwise specified</li>
            <li>Payments are processed through secure third-party gateways</li>
            <li>Due to the digital nature of our products, we offer a 7-day refund policy from date of purchase</li>
            <li>Refund requests must be made in writing to our support email</li>
            <li>No refunds will be issued after course materials have been substantially accessed</li>
          </ul>
        </div>
      )
    },
    {
      title: "User Responsibilities",
      icon: <FaUserEdit className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <p>As a user of our services, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Use course materials for personal education only</li>
            <li>Not redistribute, resell, or share course content with others</li>
          </ul>
        </div>
      )
    },
    {
      title: "Intellectual Property",
      icon: <FaBook className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <p>All course materials, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Videos and presentations</li>
            <li>Documents and study materials</li>
            <li>Trading strategies and methodologies</li>
            <li>Website content and design</li>
          </ul>
          <p className="pt-2">
            are the exclusive property of Shree Trading Academy and are protected by copyright laws. Unauthorized use, reproduction, 
            or distribution is strictly prohibited.
          </p>
        </div>
      )
    },
    {
      title: "Limitations of Liability",
      icon: <FaExclamationTriangle className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <p>Shree Trading Academy provides educational content only. We do not:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Guarantee specific trading results or profits</li>
            <li>Provide financial advice or recommendations</li>
            <li>Assume responsibility for individual trading decisions</li>
          </ul>
          <p className="pt-2">
            Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.
          </p>
        </div>
      )
    },
    {
      title: "Modifications",
      icon: <MdOutlinePolicy className="text-indigo-500" />,
      content: (
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. 
          Your continued use of our services after such changes constitutes acceptance of the new Terms.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <MdGavel className="mr-3 text-indigo-600" />
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-700 leading-relaxed">
            Welcome to <span className="font-semibold text-indigo-600">Shree Trading Academy</span> (located at Uttamrao Shinde Complex, Yeola, Nashik, Maharashtra). 
            These Terms and Conditions govern your use of our website and services. Please read them carefully.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part, you may not access our services.
          </p>
        </motion.div>

        {/* Governing Law */}
        <motion.div 
          className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Governing Law</h3>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Nashik, Maharashtra.
          </p>
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Contact Information:</h4>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="font-medium mr-2">Director:</span>
                <span>Mayur Pawar</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">Address:</span>
                <span>Uttamrao Shinde Complex, Yeola, Nashik, Maharashtra</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">Email:</span>
                <span>contact@shreetradingacademy.com</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 text-xl">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <div className="text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final Note */}
        <motion.div 
          className="mt-12 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            These Terms and Conditions constitute the entire agreement between you and Shree Trading Academy regarding our services.
          </p>
          <p className="mt-2 text-sm">
            © {new Date().getFullYear()} Shree Trading Academy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;