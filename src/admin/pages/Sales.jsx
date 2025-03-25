import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiDollarSign, FiShoppingCart, FiUser, FiCalendar, 
  FiFilter, FiTrendingUp, FiDownload, FiSearch 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Sales = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payments from Firestore
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const paymentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to Date if needed
            date: data.date?.toDate() || new Date(),
            // Convert price to number
            price: Number(data.price) || 0
          };
        });
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search term and date range
  const filteredPayments = payments.filter(payment => 
    payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Process data for charts
  const processChartData = () => {
    // Group by date for time series
    const dailyData = payments.reduce((acc, payment) => {
      const dateStr = payment.date.toLocaleDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, amount: 0, count: 0 };
      }
      acc[dateStr].amount += payment.price;
      acc[dateStr].count += 1;
      return acc;
    }, {});

    // Group by course for pie chart
    const courseData = payments.reduce((acc, payment) => {
      const course = payment.courseName || 'Unknown';
      if (!acc[course]) {
        acc[course] = { name: course, value: 0 };
      }
      acc[course].value += payment.price;
      return acc;
    }, {});

    return {
      daily: Object.values(dailyData).slice(0, 7).reverse(),
      byCourse: Object.values(courseData),
      totalRevenue: payments.reduce((sum, payment) => sum + payment.price, 0),
      totalTransactions: payments.length,
      topCourses: Object.entries(courseData)
        .sort((a, b) => b[1].value - a[1].value)
        .slice(0, 3)
        .map(([name, { value }]) => ({ name, value }))
    };
  };

  const { daily, byCourse, totalRevenue, totalTransactions, topCourses } = processChartData();

  // Color palette
  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];
  const STATUS_COLORS = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sales Dashboard</h1>
            <p className="text-gray-600">Track and analyze Sales and transactions</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <FiCalendar className="text-gray-500" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                <option value="week">Last 7 days</option>
                <option value="month">This month</option>
                <option value="quarter">This quarter</option>
                <option value="year">This year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">₹{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FiDollarSign size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-green-500">+12%</span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{totalTransactions}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <FiShoppingCart size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-green-500">+8%</span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Unique Customers</p>
                <h3 className="text-2xl font-bold mt-1">
                  {new Set(payments.map(p => p.email)).size}
                </h3>
              </div>
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                <FiUser size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-green-500">+15%</span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Avg. Transaction</p>
                <h3 className="text-2xl font-bold mt-1">
                  ₹{totalTransactions ? (totalRevenue / totalTransactions).toFixed(2) : '0'}
                </h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <FiTrendingUp size={20} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm text-green-500">+5%</span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Revenue Trend</h2>
              <select className="text-xs bg-gray-100 px-2 py-1 rounded">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366F1" 
                    fill="#C7D2FE" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Course */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Revenue by Course</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCourse}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {byCourse.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
                
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
            <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
              <FiDownload size={16} />
              <span>Export</span>
            </button>
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
      </div>
    </div>
  );
};

export default Sales;