import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaRupeeSign, FaReceipt, FaUser, FaBook, FaCalendarAlt, FaSearch, FaFileDownload } from "react-icons/fa";
import { FiFilter, FiX } from "react-icons/fi";
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
  const [activeFilters, setActiveFilters] = useState(0);

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
    let filterCount = 0;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(p.date.toMillis()).toLocaleDateString().includes(searchQuery)
      );
      filterCount++;
    }

    if (selectedCourse) {
      filtered = filtered.filter((p) => p.courseName === selectedCourse.value);
      filterCount++;
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (p) => new Date(p.date.toMillis()).toISOString().split("T")[0] === dateFilter
      );
      filterCount++;
    }

    setFilteredPayments(filtered);
    setActiveFilters(filterCount);
  }, [searchQuery, selectedCourse, dateFilter, payments]);

  const generatePDF = (payment) => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Payment Receipt - ${payment.transactionId}`,
      subject: 'Payment Confirmation',
      author: 'Shree Trading Academy',
      keywords: 'receipt, payment, shree trading academy',
      creator: 'Shree Trading Academy'
    });
  
    // Add solid color header with academy branding
    doc.setFillColor(79, 70, 229);  // Indigo
    doc.rect(0, 0, 220, 40, 'F');
    
    // Academy name and logo area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(160, 5, 50, 30, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text("SHREE TRADING", 165, 15);
    doc.text("ACADEMY", 165, 22);
    
    // Header text
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("PAYMENT RECEIPT", 20, 25);
    
    // Decorative elements
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 80, 32);
    
    // Main content container
    doc.setFillColor(245, 247, 250);  // Light gray background
    doc.roundedRect(10, 45, 190, 100, 5, 5, 'F');
    
    // Payment details header
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);  // Dark gray
    doc.text("Payment Details", 20, 60);
    
    // Payment details content
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);  // Medium gray
    
    const details = [
      { label: "Receipt No:", value: payment.transactionId },
      { label: "Issued Date:", value: new Date().toLocaleDateString('en-IN') },
      { label: "Student Name:", value: payment.name },
      { label: "Email:", value: payment.email },
      { label: "Course:", value: payment.courseName },
      { label: "Amount Paid:", value: `₹${payment.price}` },
      { label: "Payment Date:", value: new Date(payment.date.toMillis()).toLocaleDateString('en-IN') },
    ];
    
    let yPosition = 70;
    details.forEach(item => {
      doc.setFont(undefined, 'bold');
      doc.text(item.label, 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(item.value, 70, yPosition);
      yPosition += 7;
    });
    
    // Payment summary box
    doc.setFillColor(236, 239, 252); // Very light indigo
    doc.roundedRect(120, 70, 70, 40, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text("Payment Summary", 125, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`Course Fee: ₹${payment.price}`, 125, 90);
    doc.text(`Amount Paid: ₹${payment.price}`, 125, 97);
    doc.text(`Balance Due: ₹0`, 125, 104);
    
    // Footer with academy details
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.3);
    doc.line(10, 150, 200, 150);
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("This is an official receipt from Shree Trading Academy", 20, 160);
    
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text("Shree Trading Academy", 20, 170);
    doc.setFontSize(8);
    doc.text("123 Business Street, Mumbai, Maharashtra 400001", 20, 175);
    doc.text("Phone: +91 98765 43210 | Email: info@shreetradingacademy.com", 20, 180);
    doc.text("GSTIN: 22AAAAA0000A1Z5 | PAN: AAAAA0000A", 20, 185);
    
    // Add watermark using text
    doc.setFontSize(40);
    doc.setTextColor(229, 231, 235); // Very light gray
    doc.text("SHREE TRADING", 40, 120, { angle: 45 });
    
    // Add page border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287);
    
    // Save the PDF
    doc.save(`ShreeTrading_Receipt_${payment.transactionId}.pdf`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCourse(null);
    setDateFilter("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-2">
      {/* <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 relative inline-block">
          <span className="relative z-10">Payment Records</span>
          <span className="absolute bottom-0 left-0 w-full h-2 bg-indigo-200 z-0 opacity-50"></span>
        </h1>
        <p className="text-lg text-gray-600">View and manage all payment transactions</p>
      </div> */}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative flex-grow max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, UID or date..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select
              className="flex-grow min-w-[200px]"
              options={[...new Set(payments.map((p) => p.courseName))].map((course) => ({
                value: course,
                label: course,
              }))}
              placeholder="Filter by Course"
              isClearable
              onChange={setSelectedCourse}
              value={selectedCourse}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '44px',
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: '#9ca3af'
                  },
                  boxShadow: 'none'
                })
              }}
            />

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <FiFilter className="mr-1" />
                {activeFilters} active filter{activeFilters > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiX className="mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-50 mb-6">
            <FaReceipt className="h-12 w-12 text-indigo-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-500 mb-6">
            {activeFilters > 0
              ? "Try adjusting your search or filter criteria"
              : "No payment records available yet"}
          </p>
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <FaReceipt className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{payment.name}</div>
                      <div className="text-sm text-gray-500">{payment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                          <FaBook className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{payment.courseName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaRupeeSign className="text-green-500 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">{payment.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(payment.date.toMillis()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => generatePDF(payment)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        <FaFileDownload className="mr-1.5 h-3 w-3" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
                <span className="font-medium">{payments.length}</span> payments
              </p>
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="ml-3 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}