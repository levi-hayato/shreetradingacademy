import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../../firebase/firebase";  // Make sure this path is correct
import CourseFormStepper from '../components/instructor/CourseFormStepper';
import { useParams } from 'react-router-dom';

const InstructorDashboard = () => {
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    instructor: '',
    thumbnail: '',
    chapters: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a reference to the 'courseData' collection
      const coursesCollection = collection(db, 'courseData');
      
      // Add a new document with the course data
      const docRef = await addDoc(coursesCollection, {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("Document written with ID: ", docRef.id);
      alert('Course published successfully!');
      
      // Reset form
      setCourseData({
        title: '',
        description: '',
        instructor: '',
        thumbnail: '',
        chapters: []
      });
      
    } catch (error) {
      console.error('Error adding course: ', error);
      alert(`Error publishing course: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mb-20">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h1>
          
          <CourseFormStepper 
            courseData={courseData}
            setCourseData={setCourseData}
            isSubmitting={isSubmitting}
            onSubmit={handleAddCourse}
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;