import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaRupeeSign, FaReceipt, FaUser, FaBook, FaCalendarAlt, FaSearch } from "react-icons/fa";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        const paymentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedPayments = paymentsData.sort((a, b) => b.date.toMillis() - a.date.toMillis());
        setPayments(sortedPayments);
        setFilteredPayments(sortedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
      setLoading(false);
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(p.date.toMillis()).toLocaleDateString().includes(searchQuery)
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter((p) => p.courseName === selectedCourse.value);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (p) => new Date(p.date.toMillis()).toISOString().split("T")[0] === dateFilter
      );
    }

    setFilteredPayments(filtered);
  }, [searchQuery, selectedCourse, dateFilter, payments]);

  const generatePDF = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 40);
    doc.text(`Name: ${payment.name}`, 20, 50);
    doc.text(`Email: ${payment.email}`, 20, 60);
    doc.text(`Course: ${payment.courseName}`, 20, 70);
    doc.text(`Amount: ₹${payment.price}`, 20, 80);
    doc.text(`Date: ${new Date(payment.date.toMillis()).toLocaleDateString()}`, 20, 90);

    doc.save(`Receipt_${payment.transactionId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-black text-3xl text-center font-extrabold uppercase relative after:block after:w-20 after:h-1 after:bg-indigo-500 after:mt-1 after:mx-auto mb-8">
        Payments
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Name, UID, Email, Date"
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80 focus:ring focus:ring-indigo-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          className="w-full md:w-60"
          options={[...new Set(payments.map((p) => p.courseName))].map((course) => ({
            value: course,
            label: course,
          }))}
          placeholder="Filter by Course"
          isClearable
          onChange={setSelectedCourse}
        />

        <input
          type="date"
          className="border rounded-lg p-2 focus:ring focus:ring-indigo-300"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {filteredPayments.length === 0 ? (
        <div className="flex flex-col items-center text-gray-600 text-lg py-20 animate-pulse">
          <p className="text-xl font-semibold">No payments found.</p>
          <div className="w-12 h-12 border-4 border-dashed border-gray-400 rounded-full animate-spin mt-4"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-indigo-600 text-white text-left uppercase text-sm">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-100 transition-all">
                  <td className="p-4 flex items-center gap-2"><FaReceipt className="text-indigo-500" /> {payment.transactionId}</td>
                  <td className="p-4 flex items-center gap-2"><FaUser className="text-blue-500" /> {payment.name} <span className="text-gray-500 text-xs">({payment.email})</span></td>
                  <td className="p-4 flex items-center gap-2"><FaBook className="text-green-500" /> {payment.courseName}</td>
                  <td className="p-4 font-bold flex items-center gap-1"><FaRupeeSign className="text-green-500" /> {payment.price}</td>
                  <td className="p-4 flex items-center gap-2"><FaCalendarAlt className="text-yellow-500" /> {new Date(payment.date.toMillis()).toLocaleDateString()}</td>
                  <td className="p-4 text-center"><button onClick={() => generatePDF(payment)} className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition flex items-center gap-1"><FaReceipt /> Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
