import { motion } from 'framer-motion';
import { FaLock, FaUserShield, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import { MdPrivacyTip, MdDataUsage } from 'react-icons/md';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <FaUserShield className="text-indigo-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Demographic information (age, gender, location)</li>
          <li>Profile photo for account identification</li>
          <li>Payment details for course purchases (processed securely through our payment gateway)</li>
          <li>Usage data and course progress information</li>
        </ul>
      )
    },
    {
      title: "How We Use Your Information",
      icon: <MdDataUsage className="text-indigo-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>To create and manage your account</li>
          <li>To process your course enrollments</li>
          <li>To personalize your learning experience</li>
          <li>To communicate important updates about your courses</li>
          <li>To improve our services and website functionality</li>
          <li>To comply with legal obligations</li>
        </ul>
      )
    },
    {
      title: "Data Protection",
      icon: <FaShieldAlt className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <p>We implement appropriate security measures to protect your personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>SSL encryption for all data transmissions</li>
            <li>Secure servers with restricted access</li>
            <li>Regular security audits and updates</li>
            <li>Payment processing through PCI-DSS compliant services</li>
          </ul>
        </div>
      )
    },
    {
      title: "Third-Party Sharing",
      icon: <FaInfoCircle className="text-indigo-500" />,
      content: (
        <div className="space-y-3">
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Payment processors to complete transactions</li>
            <li>Service providers who assist in website operations (under confidentiality agreements)</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </div>
      )
    },
    {
      title: "Your Rights",
      icon: <MdPrivacyTip className="text-indigo-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Access and request a copy of your personal data</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal data (subject to legal requirements)</li>
          <li>Withdraw consent for data processing</li>
          <li>Lodge complaints with data protection authorities</li>
        </ul>
      )
    },
    {
      title: "Policy Updates",
      icon: <FaLock className="text-indigo-500" />,
      content: (
        <p>
          We may update this policy periodically. Significant changes will be notified through email or website announcements. 
          The updated policy will be effective immediately upon posting on our website.
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
            <FaLock className="mr-3 text-indigo-600" />
            Privacy Policy
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
            At <span className="font-semibold text-indigo-600">Shree Trading Academy</span> (located at Uttamrao Shinde Complex, Yeola, Nashik, Maharashtra), 
            we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information 
            when you use our website and services.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By registering on our website or purchasing our courses, you agree to the collection and use of information in accordance with this policy.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
          <p className="text-gray-700">
            For any questions about this Privacy Policy or your personal data, please contact:
          </p>
          <ul className="mt-3 space-y-1">
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
        </motion.div>

        {/* Policy Sections */}
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
            By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <p className="mt-2 text-sm">
            © {new Date().getFullYear()} Shree Trading Academy. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;