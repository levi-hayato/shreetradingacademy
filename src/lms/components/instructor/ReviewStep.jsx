import { motion } from 'framer-motion';

const ReviewStep = ({ courseData, onSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-800">Review & Publish</h3>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Course Details</h4>
          <div className="space-y-2">
            <p><span className="font-medium">Title:</span> {courseData.title}</p>
            <p><span className="font-medium">Instructor:</span> {courseData.instructor}</p>
            <p><span className="font-medium">Description:</span> {courseData.description}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Course Structure</h4>
          <div className="space-y-4">
            {courseData.chapters.map((chapter, index) => (
              <div key={index} className="border-l-2 border-indigo-200 pl-4">
                <p className="font-medium">{chapter.title} <span className="text-sm text-gray-500 ml-2">({chapter.duration})</span></p>
                <div className="mt-2 space-y-2 ml-4">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <p key={lessonIndex} className="text-sm">
                      • {lesson.title} <span className="text-gray-500">({lesson.type}, {lesson.duration})</span>
                    </p>
                  ))}
                  {chapter.lessons.length === 0 && (
                    <p className="text-sm text-gray-400">No lessons added yet</p>
                  )}
                </div>
              </div>
            ))}
            {courseData.chapters.length === 0 && (
              <p className="text-gray-400">No chapters added yet</p>
            )}
          </div>
        </div>
        
        {courseData.thumbnail && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Thumbnail Preview</h4>
            <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img src={courseData.thumbnail} alt="Course thumbnail" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-blue-700">Review all information carefully before publishing. You won't be able to edit after publishing.</p>
      </div>
    </motion.div>
  );
};

export default ReviewStep;