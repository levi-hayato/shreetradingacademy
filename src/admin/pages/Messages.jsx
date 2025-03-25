import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        setMessages(messagesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages: ", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMessages = [...messages].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredMessages = sortedMessages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleSort(e.target.value)}
                value={sortConfig.key}
              >
                <option value="timestamp">Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={() => handleSort(sortConfig.key)}
              >
                {sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(message.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                          <FiUser size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{message.name}</h3>
                          <p className="text-sm text-gray-500">{message.email}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMessage === message.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4"
                      >
                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                <FiMail size={18} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{message.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                <FiPhone size={18} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{message.contact}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full mt-1">
                              <FiMessageSquare size={18} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Message</p>
                              <p className="font-medium whitespace-pre-line">{message.message}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={() => {
                                window.location.href = `mailto:${message.email}`;
                              }}
                            >
                              Reply via Email
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;