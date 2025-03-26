import { Helmet } from 'react-helmet';

const CookiesPolicy = () => {
    
  return (
    <div className="max-w-8xl w-full mx-auto px-4 py-2 sm:px-6 lg:px-4">
      <Helmet>
        <title>Cookies Policy - Shree Trading Academy</title>
        <meta name="description" content="Learn how Shree Trading Academy uses cookies to enhance your experience on our trading education platform." />
      </Helmet>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Cookies Policy</h1>
        
        <div className="prose prose-indigo max-w-none">
          <p className="text-gray-600 mb-6">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Shree Trading Academy ("we", "us", or "our") uses cookies on our website <strong>shreetradingacademy.com</strong> 
              (the "Service"). This policy explains what cookies are, how we use them, and your choices regarding cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit our website. 
              They help the website remember information about your visit, which can make it easier to visit again and make 
              the site more useful to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function properly (e.g., user authentication, 
                course progress tracking)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your preferences (e.g., language settings, font size)
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics)
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant ads (e.g., Facebook Pixel)
              </li>
              <li>
                <strong>Performance Cookies:</strong> Improve website performance and user experience
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">session_id</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Maintain user session during website use</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Session</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_ga</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguish users</td>
                    <td className="px-6 py-4 text-sm text-gray-500">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_gid</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguish users</td>
                    <td className="px-6 py-4 text-sm text-gray-500">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cookie_consent</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Remembers your cookie preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-500">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Cookie Choices</h2>
            <p className="mb-4">
              You have the right to accept or reject cookies. When you first visit our website, you will see a cookie 
              consent banner where you can choose which categories of cookies to accept.
            </p>
            <p className="mb-4">
              You can also manage cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Microsoft Edge</a></li>
            </ul>
            <p>
              Note: Disabling essential cookies may affect the functionality of our website and your ability to access certain features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Changes to This Policy</h2>
            <p className="mb-4">
              We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new 
              Cookies Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Cookies Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: <a href="mailto:privacy@shreetradingacademy.com" className="text-indigo-600 hover:underline">privacy@shreetradingacademy.com</a></li>
              <li>Phone: +91 XXXXXXXXXX</li>
              <li>Address: [Your Registered Office Address]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;