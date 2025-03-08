import { useState, useEffect } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "../../firebase/firebase";
import { FaTrash } from "react-icons/fa";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    };

    fetchStudents();
  }, []);

  // Delete student function
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
    setStudents(students.filter((student) => student.id !== id));
  };

  // Filter & search logic
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCourse === "" || student.course === selectedCourse)
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">🎓 Students List</h2>

      {/* Search & Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded w-1/2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Cybersecurity">Cybersecurity</option>
        </select>
      </div>

      {/* Students Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className=" p-2">Name</th>
            <th className=" p-2">Email</th>
            <th className=" p-2">Course</th>
            <th className=" p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} className="text-start">
              <td className=" p-2">{student.name}</td>
              <td className=" p-2">{student.email}</td>
              <td className=" p-2">{student.course}</td>
              <td className=" p-2 text-center">
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(student.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No data message */}
      {filteredStudents.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No students found.</p>
      )}
    </div>
  );
}
