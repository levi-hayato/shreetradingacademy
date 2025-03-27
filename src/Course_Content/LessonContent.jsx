import VideoPlayer from './VideoPlayer';
import QuizComponent from './QuizComponent';
import { useState } from 'react';

const LessonContent = ({ title, content }) => {
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const handleQuizSubmit = (isCorrect) => {
    setQuizSubmitted(true);
    setQuizScore(isCorrect ? 100 : 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        
        <div className="mb-6">
          <VideoPlayer url={content.videoUrl} />
        </div>
        
        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 mb-6">{content.description}</p>
          
          {content.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Quiz</h3>
          {!quizSubmitted ? (
            <QuizComponent 
              question={content.quiz.question} 
              options={content.quiz.options} 
              correctAnswer={content.quiz.correctAnswer} 
              onSubmit={handleQuizSubmit}
            />
          ) : (
            <div className={`p-4 rounded-md ${quizScore === 100 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {quizScore === 100 ? (
                <p>✅ Correct! You've earned 1 point for this lesson.</p>
              ) : (
                <p>❌ Incorrect. Review the material and try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonContent;