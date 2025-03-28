import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

const ResourceCard = ({ title, type, icon, size }) => {
  return (
    <motion.div 
      className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-all bg-white hover:shadow-md"
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start">
        <div className="bg-indigo-50 p-3 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{type}</p>
          <div className="mt-1 flex justify-between items-center">
            <span className="text-xs text-gray-400">{size}</span>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
              <FiDownload className="ml-4" /> Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;