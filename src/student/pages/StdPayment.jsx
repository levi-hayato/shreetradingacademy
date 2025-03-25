import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaFileInvoice, FaDownload, FaRupeeSign, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudentPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Query payments collection by student's email
          const paymentsRef = collection(db, 'payments');
          const q = query(paymentsRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          const paymentData = [];
          querySnapshot.forEach((doc) => {
            paymentData.push({ id: doc.id, ...doc.data() });
          });

          setPayments(paymentData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching payments:', err);
          setError('Failed to load payment data');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const generateReceipt = async (payment) => {
    // Create a temporary div to render the receipt
    const receiptDiv = document.createElement('div');
    receiptDiv.style.width = '400px';
    receiptDiv.style.padding = '20px';
    receiptDiv.style.backgroundColor = '#ffffff';
    receiptDiv.style.border = '1px solid #e2e8f0';
    receiptDiv.style.borderRadius = '8px';
    receiptDiv.style.fontFamily = 'Arial, sans-serif';
    
    receiptDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4f46e5; margin-bottom: 5px;">Payment Receipt</h2>
        <p style="color: #64748b; font-size: 14px;">Transaction ID: ${payment.transactionId}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Student Name:</span>
          <span>${payment.name}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Email:</span>
          <span>${payment.email}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Course:</span>
          <span>${payment.courseName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Date:</span>
          <span>${formatDate(payment.date)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: bold;">Amount:</span>
          <span>₹${payment.price}</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 12px;">
        <p>Thank you for your payment!</p>
        <p>This is an auto-generated receipt.</p>
      </div>
    `;

    document.body.appendChild(receiptDiv);

    try {
      // Convert the div to canvas then to PDF
      const canvas = await html2canvas(receiptDiv);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`payment_receipt_${payment.transactionId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      document.body.removeChild(receiptDiv);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <FaFileInvoice className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No Payment Records Found</h2>
          <p className="text-gray-600 mt-2">You don't have any payment history yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FaIdCard className="text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                        <div className="text-sm text-gray-500">{payment.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.courseName}</div>
                    <div className="text-sm text-gray-500">Course ID: {payment.courseId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{payment.price}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">{formatDate(payment.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => generateReceipt(payment)}
                      className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <FaDownload className="mr-2" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentPage;