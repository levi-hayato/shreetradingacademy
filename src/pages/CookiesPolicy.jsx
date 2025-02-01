import React from "react";

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          Cookies Policy
        </h1>

        {/* Effective Date */}
        <p className="text-gray-400 text-sm text-center">
          <strong>Effective Date:</strong> [Insert Date]
        </p>

        {/* Introduction */}
        <p className="mt-4 text-gray-300">
          Welcome to <span className="text-blue-400">Shree Trading</span> ("we," "our," "us"). This Cookies Policy explains how we use cookies and similar technologies on our website <strong>[Insert Website URL]</strong> ("Website").
        </p>

        {/* What Are Cookies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">1. What Are Cookies?</h2>
          <p className="text-gray-300">
            Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help us enhance your browsing experience, improve website functionality, and analyze website traffic.
          </p>
        </div>

        {/* How We Use Cookies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">2. How We Use Cookies</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Ensure the Website functions correctly.</li>
            <li>Remember your preferences and settings.</li>
            <li>Improve Website security and performance.</li>
            <li>Analyze traffic and understand user behavior to enhance our services.</li>
            <li>Provide personalized content and advertisements.</li>
          </ul>
        </div>

        {/* Types of Cookies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">3. Types of Cookies We Use</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li><strong>Essential Cookies:</strong> Necessary for the Website to function properly (e.g., login authentication, security features).</li>
            <li><strong>Performance Cookies:</strong> Collect anonymous data to improve Website performance.</li>
            <li><strong>Functional Cookies:</strong> Remember user preferences to enhance browsing experience.</li>
            <li><strong>Advertising Cookies:</strong> Track browsing activity to provide relevant advertisements.</li>
          </ul>
        </div>

        {/* Managing Cookies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">4. Managing Cookies</h2>
          <p className="text-gray-300">
            You can manage or delete cookies through your browser settings. Disabling cookies may impact your Website experience.
          </p>
          <div className="mt-3 text-gray-400 text-sm">
            <p><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Google Chrome</a></p>
            <p><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Mozilla Firefox</a></p>
            <p><a href="https://support.microsoft.com/en-us/microsoft-edge/view-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Microsoft Edge</a></p>
            <p><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Apple Safari</a></p>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">5. Third-Party Cookies</h2>
          <p className="text-gray-300">
            We may use third-party services, such as Google Analytics and advertising networks, which may place their own cookies on your device. These cookies are governed by their respective privacy policies.
          </p>
        </div>

        {/* Updates to Policy */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">6. Updates to This Policy</h2>
          <p className="text-gray-300">
            We may update this Cookies Policy from time to time. Any changes will be posted on this page with a revised "Effective Date."
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">7. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about our Cookies Policy, please contact us at:
          </p>
          <div className="mt-3 text-gray-400">
            <p><strong>Email:</strong> <a href="mailto:rushirajsonawane1414@gmail.com" className="text-blue-300 hover:underline">rushirajsonawane1414@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919322615124" className="text-blue-300 hover:underline">+91 9322615124</a></p>
            <p><strong>Address:</strong> Babhulgaon Kh., Yeola - Manmad Road, Yeola 423401</p>
          </div>
        </div>

        {/* Consent Notice */}
        <p className="mt-6 text-center text-gray-400">
          By using our Website, you consent to our use of cookies as described in this policy.
        </p>
      </div>
    </div>
  );
};

export default CookiesPolicy;
