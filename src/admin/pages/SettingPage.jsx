import { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiBellOff,
  FiUser,
  FiLock,
  FiMail,
  FiCreditCard
} from 'react-icons/fi';
import { Switch } from '@headlessui/react';

const SettingsPage = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));
  });

  // Notification states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [browserSupportsNotifications, setBrowserSupportsNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    paymentMethod: 'credit_card'
  });

  // Initialize notification support check
  useEffect(() => {
    setBrowserSupportsNotifications('Notification' in window);
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Handle notification toggle
  const toggleNotifications = async () => {
    if (!browserSupportsNotifications) return;

    if (Notification.permission === 'denied') {
      alert('Please enable notifications in your browser settings first.');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        // Show test notification
        new Notification('Shree Trading Academy', {
          body: 'You will now receive important updates!',
          icon: '/logo.png'
        });
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <FiSettings className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
                      <FiSettings className="mr-2" /> General Settings
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiUser className="mr-2" /> Profile Information
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiLock className="mr-2" /> Password & Security
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiMail className="mr-2" /> Email Preferences
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center">
                      <FiCreditCard className="mr-2" /> Payment Methods
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">General Settings</h2>
              
              {/* Theme Preference */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {darkMode ? (
                    <FiMoon className="text-indigo-600 dark:text-indigo-400 mr-3" />
                  ) : (
                    <FiSun className="text-indigo-600 dark:text-indigo-400 mr-3" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {darkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onChange={setDarkMode}
                  className={`${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {notificationsEnabled ? (
                    <FiBell className="text-indigo-600 dark:text-indigo-400 mr-3" />
                  ) : (
                    <FiBellOff className="text-indigo-600 dark:text-indigo-400 mr-3" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notificationsEnabled ? 'Notifications are enabled' : 'Notifications are disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                  disabled={!browserSupportsNotifications}
                  className={`${
                    notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span
                    className={`${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              {/* Email Preferences Form */}
              <form onSubmit={handleSubmit} className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Email Preferences</h3>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Payment Method
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="credit_card"
                        name="paymentMethod"
                        type="radio"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="credit_card" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="upi"
                        name="paymentMethod"
                        type="radio"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="upi" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        UPI Payment
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="net_banking"
                        name="paymentMethod"
                        type="radio"
                        value="net_banking"
                        checked={formData.paymentMethod === 'net_banking'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="net_banking" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                        Net Banking
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;