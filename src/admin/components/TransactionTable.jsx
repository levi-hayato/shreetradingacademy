import { FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Status colors mapping (keep your existing one)
const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800'
};

const TransactionsTable = ({ filteredPayments, loading }) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const exportToCSV = () => {
    const headers = [
      'Transaction ID',
      'Customer Name',
      'Customer Email',
      'Course Name',
      'Date',
      'Amount',
      'Status'
    ];
    
    const data = filteredPayments.map(payment => ({
      'Transaction ID': payment.transactionId,
      'Customer Name': payment.name,
      'Customer Email': payment.email,
      'Course Name': payment.courseName,
      'Date': payment.date.toLocaleDateString(),
      'Amount': `₹${payment.price.toLocaleString()}`,
      'Status': 'Completed'
    }));

    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += Object.values(row).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    setExportDropdownOpen(false);
  };

  const exportToExcel = () => {
    const data = filteredPayments.map(payment => ({
      'Transaction ID': payment.transactionId,
      'Customer Name': payment.name,
      'Customer Email': payment.email,
      'Course Name': payment.courseName,
      'Date': payment.date.toLocaleDateString(),
      'Amount': payment.price,
      'Status': 'Completed'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    
    // Generate Excel file
    XLSX.writeFile(workbook, `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExportDropdownOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
        
        {/* Export Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            <FiDownload size={16} />
            <span>Export</span>
          </button>
          
          {exportDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
            >
              <div className="py-1">
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportToExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Course</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.slice(0, 10).map((payment) => (
                <motion.tr 
                  key={payment.transactionId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="border-b border-gray-100"
                >
                  <td className="py-4 text-sm font-medium text-gray-900">
                    {payment.transactionId}
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-medium">{payment.name}</p>
                      <p className="text-xs text-gray-500">{payment.email}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-700">
                    {payment.courseName}
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {payment.date.toLocaleDateString()}
                  </td>
                  <td className="py-4 text-sm font-medium text-right">
                    ₹{payment.price.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS.completed}`}>
                      Completed
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;