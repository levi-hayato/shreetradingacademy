import { FiDownload, FiFile, FiFileText, FiFilm, FiCheck } from 'react-icons/fi';

const iconMap = {
  pdf: <FiFileText className="text-red-500" />,
  spreadsheet: <FiFile className="text-green-500" />,
  video: <FiFilm className="text-blue-500" />
};

const ResourcesPanel = ({ resources }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Course Resources</h2>
        
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="mr-4">
                  {iconMap[resource.type]}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                  <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                </div>
              </div>
              
              {resource.downloaded ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FiCheck className="mr-1" /> Downloaded
                </span>
              ) : (
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FiDownload className="mr-1.5 h-3.5 w-3.5" /> Download
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPanel;