import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiChevronRight, FiChevronLeft, FiCheck 
} from 'react-icons/fi';
import BasicInfoStep from './BasicInfoStep';
import ChaptersStep from './ChaptersStep';
import LessonsStep from './LessonsStep';
import ReviewStep from './ReviewStep';

const CourseFormStepper = ({ courseData, setCourseData, isSubmitting, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <BasicInfoStep courseData={courseData} setCourseData={setCourseData} />;
      case 2:
        return <ChaptersStep courseData={courseData} setCourseData={setCourseData} />;
      case 3:
        return <LessonsStep courseData={courseData} setCourseData={setCourseData} />;
      case 4:
        return <ReviewStep courseData={courseData} onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step ? 'bg-indigo-600 text-white' : 
                currentStep > step ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > step ? <FiCheck /> : step}
              </div>
              <span className={`text-xs mt-2 ${
                currentStep === step ? 'text-indigo-600 font-medium' : 
                currentStep > step ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Chapters'}
                {step === 3 && 'Lessons'}
                {step === 4 && 'Review'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300" 
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>
      
      {/* Form Content */}
      <form onSubmit={onSubmit} >
        {renderStep()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FiChevronLeft className="mr-2" /> Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next <FiChevronRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Course'}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default CourseFormStepper;