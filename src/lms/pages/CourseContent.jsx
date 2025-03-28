import { useState } from 'react';
import CoursePage from './CoursePage';
import InstructorDashboard from './InstructorDashboard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

function App() {
  const [isInstructor, setIsInstructor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isInstructor) {
    return <InstructorDashboard />;
  }

  return <CoursePage setIsInstructor={setIsInstructor} />;
}

export default App;