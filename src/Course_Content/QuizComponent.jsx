import { useState } from 'react';

const QuizComponent = ({ question, options, correctAnswer, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption === correctAnswer);
    }
  };

  return (
    <div>
      <p className="text-gray-800 mb-4">{question}</p>
      
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <div 
            key={index}
            onClick={() => setSelectedOption(index)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selectedOption === index 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-400'
              }`}>
                {selectedOption === index && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null}
        className={`px-4 py-2 rounded-md text-white ${
          selectedOption === null 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizComponent;