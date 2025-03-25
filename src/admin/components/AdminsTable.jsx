import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FaUserShield, FaEnvelope, FaPhone, FaUserCircle, FaPlus, FaCloudUploadAlt, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import uploadToCloudinary from "../../utils/uploadToCloudinary";

const AdminsTable = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    photo: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Fetch admins from Firestore
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "admins"));
        const adminsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching admins: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort admins
  const sortedAdmins = [...admins].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter admins based on search term
  const filteredAdmins = sortedAdmins.filter(admin => 
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.match(/image.(jpeg|jpg|png|gif)$/)) {
      setUploadError("Please select a valid image file (JPEG, JPG, PNG, GIF)");
      return;
    }

    setImageFile(file);
    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setNewAdmin({...newAdmin, photo: imageUrl});
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle create admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newAdmin.name || !newAdmin.email) {
      setUploadError("Name and Email are required fields");
      return;
    }

    try {
      await addDoc(collection(db, "admins"), {
        ...newAdmin,
        createdAt: new Date()
      });
      
      // Reset form and close modal
      setShowCreateForm(false);
      setNewAdmin({
        name: "",
        email: "",
        phone: "",
        role: "admin",
        photo: ""
      });
      setImageFile(null);
      setUploadError(null);
      
      // Refresh the admin list
      const querySnapshot = await getDocs(collection(db, "admins"));
      const adminsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error creating admin: ", error);
      setUploadError("Failed to create admin. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaUserShield className="text-blue-600" />
              Admin Management
            </h1>
            <p className="text-gray-600">Manage your system administrators</p>
          </div>
          
          <button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            <span>Create Admin</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FaEnvelope />
                      <span className="hidden md:inline">Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FaPhone />
                      <span className="hidden md:inline">Phone</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredAdmins.map((admin) => (
                      <motion.tr 
                        key={admin.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                              {admin.photo ? (
                                <img src={admin.photo} alt={admin.name} className="h-full w-full object-cover" />
                              ) : (
                                <FaUserCircle className="text-blue-600 text-xl" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                              <div className="text-sm text-gray-500">{admin.role || 'admin'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' : 
                              admin.role === 'Content Admin' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {admin.role || 'admin'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status bar */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredAdmins.length} of {admins.length} admins
          </div>
        )}
      </div>

      {/* Create Admin Popup Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Create New Admin</h2>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setUploadError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {uploadError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    {newAdmin.photo ? (
                      <img 
                        src={newAdmin.photo} 
                        alt="Profile Preview" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserCircle className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png, image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profile-upload"
                      disabled={isUploading}
                    />
                    <div className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <FaCloudUploadAlt />
                      <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Content Admin">Content Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setUploadError(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isUploading}
                  >
                    {isUploading ? "Processing..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminsTable;