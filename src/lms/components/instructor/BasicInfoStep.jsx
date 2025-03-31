import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiChevronDown, 
  FiX, 
  FiCheck, 
  FiImage, 
  FiDollarSign, 
  FiClock, 
  FiPlus, 
  FiTrash2,
  FiAlertCircle
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import uploadToCloudinary from '../../../utils/uploadToCloudinary';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ courseData, setCourseData }) => {

  const [bannerPreview, setBannerPreview] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState(null);

  // Generate a random 6-digit course ID
  const generateCourseId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };



  useEffect(() => {
    if (courseData.banner) setBannerPreview(courseData.banner);
    if (courseData.features) setFeatures(courseData.features);
  }, [courseData.banner, courseData.features]);



  const validateImage = (file) => {
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return false;
    }
    return true;
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateImage(file)) return;

    setIsUploadingBanner(true);
    setError(null);
    
    try {
      const imageUrl = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });
      
      if (imageUrl) {
        setCourseData({...courseData, banner: imageUrl});
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
      setError('Banner upload failed. Please try again.');
    } finally {
      setIsUploadingBanner(false);
      setUploadProgress(0);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) {
      setError('Feature cannot be empty');
      return;
    }
    
    if (features.includes(newFeature.trim())) {
      setError('This feature already exists');
      return;
    }

    const updatedFeatures = [...features, newFeature.trim()];
    setFeatures(updatedFeatures);
    setCourseData({
      ...courseData,
      features: updatedFeatures
    });
    setNewFeature('');
    setError(null);
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
    setCourseData({
      ...courseData,
      features: updatedFeatures
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addFeature();
    }
  };

  const clearSelection = () => {
    setCourseData({
      ...courseData,
      name: '',
      instructor: '',
      description: '',
      banner: '',
      duration: 1,
      price: 0,
      features: []
    });
    setFeatures([]);
    setBannerPreview('');
    setError(null);
  };

  const saveCourse = async () => {
    try {
      // Generate auto fields
      const autoFields = {
        courseId: generateCourseId(),
        createdAt: serverTimestamp(),
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        status: 'draft'
      };

      // Combine with form data
      const courseToSave = {
        ...courseData,
        ...autoFields
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'courses'), courseToSave);
      console.log('Course saved with ID: ', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving course: ', error);
      setError('Failed to save course');
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Course Information</h3>
        <p className="text-gray-500 mt-1">Fill in the basic details about your course</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
       
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Course Details</h4>
          
          {/* Course Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              value={courseData.name}
              onChange={(e) => setCourseData({...courseData, name: e.target.value})}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
              placeholder="e.g. Advanced Stock Trading"
            />
          </div>

          {/* Instructor Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
            <input
              type="text"
              value={courseData.instructor}
              onChange={(e) => setCourseData({...courseData, instructor: e.target.value})}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
              placeholder="Your name"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 min-h-[120px]"
              required
              placeholder="What will students learn in this course?"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {courseData.description.length}/500 characters
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Duration (Months)</label>
            <select
              value={courseData.duration || 1}
              onChange={(e) => setCourseData({...courseData, duration: parseInt(e.target.value)})}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month} month{month !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Price (₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                value={courseData.price || ''}
                onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value) || 0})}
                className="w-full pl-10 p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Features - Multiple Inputs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Features</label>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const updatedFeatures = [...features];
                      updatedFeatures[index] = e.target.value;
                      setFeatures(updatedFeatures);
                      setCourseData({...courseData, features: updatedFeatures});
                    }}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-3 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Add new feature (press Enter)"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <FiPlus className="mr-1" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Banner</label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Preview */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className={`relative w-full h-40 rounded-lg border-2 border-dashed ${
                  bannerPreview ? 'border-transparent' : 'border-gray-300'
                } overflow-hidden bg-gray-50 flex items-center justify-center`}>
                  {bannerPreview ? (
                    <>
                      <img 
                        src={bannerPreview} 
                        alt="Course banner" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCourseData({...courseData, banner: ''});
                          setBannerPreview('');
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <FiImage className="h-10 w-10 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <div className="flex  items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={courseData.banner}
                      onChange={(e) => {
                        setCourseData({...courseData, banner: e.target.value});
                        setBannerPreview(e.target.value);
                      }}
                      className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Paste image URL"
                    />
                  </div>
                  <div className="relative">
                    <label className="inline-flex items-center px-4 py-3.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                      <FiUpload className="mr-2" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {isUploadingBanner ? (
                    <div className="space-y-1">
                      <span className="flex items-center text-indigo-600">
                        <span className="inline-block h-2 w-2 mr-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        Uploading banner to Cloudinary... {uploadProgress}%
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    'Recommended size: 1920x1080 pixels (16:9 aspect ratio)'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </motion.div>
  );
};

BasicInfoStep.propTypes = {
  courseData: PropTypes.shape({
    name: PropTypes.string,
    instructor: PropTypes.string,
    description: PropTypes.string,
    banner: PropTypes.string,
    duration: PropTypes.number,
    price: PropTypes.number,
    courseID: PropTypes.number,
    features: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  setCourseData: PropTypes.func.isRequired
};

export default BasicInfoStep;