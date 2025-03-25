import { useState, useEffect } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "../../firebase/firebase";
import { FaTrash, FaFileExcel, FaFilePdf, FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { useRef } from 'react';

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef();

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Delete student function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  // Filter & search logic
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCourse === "" || student.course === selectedCourse)
  );

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "StudentsData.xlsx");
  };

  // Export to PDF
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        th { background-color: #f3f4f6 !important; }
      }
    `,
    documentTitle: "Students Data"
  });

  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(students.map(student => student.course))].filter(Boolean);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎓 Students Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={exportToExcel}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Export to Excel"
          >
            <FaFileExcel size={18} />
          </button>
          <button 
            onClick={handlePrint}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Export to PDF"
          >
            <FaFilePdf size={18} />
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex-1 md:max-w-xs">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            onChange={(e) => setSelectedCourse(e.target.value)}
            value={selectedCourse}
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table ref={tableRef} className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                       <img src={student.photo} alt="" className="rounded-full" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        {student.studentId && (
                          <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.course === 'Web Development' ? 'bg-green-100 text-green-800' : 
                        student.course === 'Data Science' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}`}>
                      {student.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.contact || student.mobile || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete student"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
}