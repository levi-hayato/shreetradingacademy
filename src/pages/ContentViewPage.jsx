import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiArrowLeft } from 'react-icons/fi';
import { db, collection, getDocs } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const ContentViewPage = () => {
  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'editorContent'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setContentItems(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching content: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-indigo-700 p-2 rounded-lg transition-colors"
            >
              <FiArrowLeft /> Back
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FiFileText /> Saved Content
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
          
          {/* Content List */}
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : contentItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No content found. Upload some content first!
              </div>
            ) : (
              <div className="space-y-6">
                {contentItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-2" />
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div 
                      className="p-6 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentViewPage;