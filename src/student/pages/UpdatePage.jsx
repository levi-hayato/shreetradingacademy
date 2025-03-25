import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaGraduationCap, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileUpdatePage = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    course: '',
    batch: '',
    photo: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        address: user.address || '',
        course: user.course || '',
        batch: user.batch || '',
        photo: null
      });
      if (user.photo) {
        setPreviewImage(user.photo);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-gray-500 text-4xl" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white text-indigo-600 rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </label>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 w-full">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-indigo-100 text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-indigo-400 bg-opacity-20 text-white placeholder-indigo-200 border border-indigo-300 focus:ring-2 focus:ring-white focus:border-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <FormSection
              icon={<FaUser className="text-indigo-600" />}
              title="Personal Information"
              fields={[
                { id: 'dob', label: 'Date of Birth', type: 'date', value: formData.dob, onChange: handleChange },
                { 
                  id: 'gender', 
                  label: 'Gender', 
                  type: 'select', 
                  value: formData.gender, 
                  onChange: handleChange,
                  options: ['Male', 'Female', 'Other', 'Prefer not to say']
                },
              ]}
            />

            <FormSection
              icon={<FaEnvelope className="text-indigo-600" />}
              title="Contact Information"
              fields={[
                { id: 'email', label: 'Email', type: 'email', value: formData.email, onChange: handleChange },
                { id: 'phone', label: 'Phone', type: 'tel', value: formData.phone, onChange: handleChange },
                { id: 'address', label: 'Address', type: 'textarea', value: formData.address, onChange: handleChange },
              ]}
            />

            <FormSection
              icon={<FaGraduationCap className="text-indigo-600" />}
              title="Academic Information"
              fields={[
                { id: 'course', label: 'Course', type: 'text', value: formData.course, onChange: handleChange },
                { id: 'batch', label: 'Batch', type: 'text', value: formData.batch, onChange: handleChange },
              ]}
            />

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormSection = ({ icon, title, fields }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index}>
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.id}
              name={field.id}
              value={field.value}
              onChange={field.onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.id}
              name={field.id}
              value={field.value}
              onChange={field.onChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              name={field.id}
              value={field.value}
              onChange={field.onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ProfileUpdatePage;