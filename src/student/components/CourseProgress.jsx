const CourseProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  export default CourseProgressBar;