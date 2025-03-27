import { FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';

const AssignmentCard = ({ assignment }) => {
  const dueDate = new Date(assignment.due);
  const today = new Date();
  const isOverdue = dueDate < today && !assignment.completed;
  
  return (
    <div className={`p-4 border rounded-lg ${assignment.completed ? 'border-green-200 bg-green-50' : isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
            Due: {dueDate.toLocaleDateString()}
          </div>
        </div>
        
        <div className="ml-4">
          {assignment.completed ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <FiCheckCircle className="mr-1" /> Completed
            </span>
          ) : isOverdue ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <FiClock className="mr-1" /> Overdue
            </span>
          ) : (
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;