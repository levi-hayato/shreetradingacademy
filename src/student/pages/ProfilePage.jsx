import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaEnvelope, FaPhone, FaCalendarAlt, FaGraduationCap, FaRupeeSign } from 'react-icons/fa';
import { db, auth } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // Query students collection where email matches
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get the first matching document
            querySnapshot.forEach((doc) => {
              setProfileData(doc.data());
            });
          } else {
            console.log('No matching student document found');
            // Create minimal profile from auth user
            setProfileData({
              name: user.displayName || '',
              email: user.email,
              photo: user.photoURL || null
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        // Handle case where user is not authenticated or has no email
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => navigate('/update');
  const handleImageError = () => setImageError(true);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not provided';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No profile data found</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-4">
     

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileData?.photo && !imageError ? (
                <img 
                  src={profileData.photo} 
                  alt={`${profileData.name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <FaUser className="text-gray-500 text-3xl sm:text-4xl" />
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">{profileData.name || 'Student Name'}</h2>
              <p className="text-indigo-100 mt-1">ID: {profileData.studentId || 'STD-0000'}</p>
            </div>
          </div>
          <button
          onClick={handleEdit}
          className="flex items-center px-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          aria-label="Edit profile"
        >
          <FaEdit className="mr-2 size-5" />
        
        </button>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          <ProfileDetailCard
            icon={<FaUser className="text-indigo-600" />}
            title="Personal Information"
            items={[
              { label: 'Full Name', value: profileData.name },
              { label: 'Mobile', value: profileData.mobile || 'Not provided' },
              { label: 'Gender', value: profileData.gender || 'Not provided' },
            ]}
          />

          <ProfileDetailCard
            icon={<FaEnvelope className="text-indigo-600" />}
            title="Contact Information"
            items={[
              { label: 'Email', value: profileData.email },
              { label: 'Student ID', value: profileData.studentId || 'Not assigned' },
              { label: 'UID', value: profileData.uid || 'Not available' },
            ]}
          />

          <ProfileDetailCard
            icon={<FaGraduationCap className="text-indigo-600" />}
            title="Academic Information"
            items={[
              { label: 'Course', value: profileData.course || 'Not enrolled' },
              { label: 'Duration', value: profileData.duration || 'Not specified' },
              { label: 'Join Date', value: formatDate(profileData.dateJoined) },
            ]}
          />

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaRupeeSign className="text-indigo-600 mr-2" />
              Fees Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Course Fee:</span>
                <span className="font-medium">
                  {profileData.price ? `₹${profileData.price}` : 'Not specified'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {formatDate(profileData.updatedAt || profileData.dateJoined)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetailCard = ({ icon, title, items }) => (
  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 h-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-gray-600">{item.label}:</span>
          <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
            {item.value || 'Not provided'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfilePage;