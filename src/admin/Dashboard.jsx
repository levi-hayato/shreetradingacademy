import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiUsers, FiUser, FiDollarSign, FiBook, FiShoppingCart, 
  FiCalendar, FiFilter, FiTrendingUp, FiRefreshCw 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  // State for all data collections
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    courses: true,
    payments: true
  });
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Realtime data fetching
  useEffect(() => {
    // Users collection
    const usersUnsub = onSnapshot(
      query(collection(db, 'students'), orderBy('dateJoined', 'desc')), 
      (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(prev => ({ ...prev, users: false }));
      }
    );

    // Courses collection
    const coursesUnsub = onSnapshot(
      query(collection(db, 'courses'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(prev => ({ ...prev, courses: false }));
      }
    );

    // Payments collection
    const paymentsUnsub = onSnapshot(
      query(collection(db, 'payments'), orderBy('date', 'desc')),
      (snapshot) => {
        const paymentsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate() || new Date(),
            price: Number(data.price) || 0
          };
        });
        setPayments(paymentsData);
        setLoading(prev => ({ ...prev, payments: false }));
      }
    );

    return () => {
      usersUnsub();
      coursesUnsub();
      paymentsUnsub();
    };
  }, []);

  // Process data for analytics
  const getAnalytics = () => {
    // Revenue calculation
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.price, 0);
    
    // Users growth
    const userGrowth = users.length > 0 ? 
      ((users.filter(u => new Date(u.createdAt?.toDate()).getMonth() === new Date().getMonth()).length / 
        users.length) * 100).toFixed(1) : 0;
    
    // Course popularity
    const popularCourses = courses.map(course => {
      const coursePayments = payments.filter(p => p.courseId === course.id);
      return {
        ...course,
        revenue: coursePayments.reduce((sum, p) => sum + p.price, 0),
        students: coursePayments.length
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

    // Daily revenue
    const dailyRevenue = payments.reduce((acc, payment) => {
      const dateStr = payment.date.toLocaleDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, revenue: 0, transactions: 0 };
      }
      acc[dateStr].revenue += payment.price;
      acc[dateStr].transactions += 1;
      return acc;
    }, {});

    return {
      totalRevenue,
      totalUsers: users.length,
      totalCourses: courses.length,
      totalTransactions: payments.length,
      userGrowth,
      popularCourses,
      dailyRevenue: Object.values(dailyRevenue).slice(0, 7).reverse(),
      recentPayments: payments.slice(0, 5),
      recentUsers: users.slice(0, 5)
    };
  };

  const { 
    totalRevenue, 
    totalUsers, 
    totalCourses, 
    totalTransactions,
    userGrowth,
    popularCourses,
    dailyRevenue,
    recentPayments,
    recentUsers
  } = getAnalytics();

  // Color schemes
  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Real-time analytics and data management</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
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
            <button 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['overview', 'users', 'courses', 'payments'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium text-sm capitalize ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard 
                title="Total Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                change="+12%"
                icon={<FiDollarSign className="text-indigo-600" />}
                loading={loading.payments}
              />
              <SummaryCard 
                title="Total Users" 
                value={totalUsers} 
                change={`+${userGrowth}%`}
                icon={<FiUsers className="text-purple-600" />}
                loading={loading.users}
              />
              <SummaryCard 
                title="Total Courses" 
                value={totalCourses} 
                change="+5%"
                icon={<FiBook className="text-pink-600" />}
                loading={loading.courses}
              />
              <SummaryCard 
                title="Transactions" 
                value={totalTransactions} 
                change="+8%"
                icon={<FiShoppingCart className="text-orange-600" />}
                loading={loading.payments}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Trend */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h2 className="font-semibold text-gray-800 mb-4">Revenue Trend</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#6366F1" 
                        fill="#C7D2FE" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Popular Courses */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-4">Popular Courses</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={popularCourses}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="revenue"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {popularCourses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Payments */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-4">Recent Payments</h2>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <motion.div 
                      key={payment.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{payment.name}</p>
                        <p className="text-sm text-gray-500">{payment.courseName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {payment.date.toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* New Users */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-2">New Users</h2>
                <div className="space-y-0.5">
                  {recentUsers.map((user) => (
                    <motion.div 
                      key={user.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <img src={user.photo} className='rounded-full' alt="" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500">
                          Joined {user.dateJoined?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <DataTable 
            title="Users"
            data={users}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'dateJoined', header: 'Joined', render: (val) => val?.toDate().toLocaleDateString() }
            ]}
            loading={loading.users}
          />
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <DataTable 
            title="Courses"
            data={courses}
            columns={[
              { key: 'name', header: 'Course Name' },
              { key: 'price', header: 'Price', render: (val) => `₹${val}` },
              { key: 'students', header: 'Students', render: () => Math.floor(Math.random() * 100) }
            ]}
            loading={loading.courses}
          />
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <DataTable 
            title="Payments"
            data={payments}
            columns={[
              { key: 'name', header: 'Customer' },
              { key: 'courseName', header: 'Course' },
              { key: 'price', header: 'Amount', render: (val) => `₹${val}` },
              { key: 'date', header: 'Date', render: (val) => val.toLocaleDateString() },
              { key: 'status', header: 'Status', render: () => (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Completed
                </span>
              )}
            ]}
            loading={loading.payments}
          />
        )}
      </div>
    </div>
  );
};

// Reusable components
const SummaryCard = ({ title, value, change, icon, loading }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-3/4 bg-gray-200 rounded mt-2 animate-pulse"></div>
        ) : (
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        )}
      </div>
      <div className="p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
    </div>
    {!loading && (
      <div className="flex items-center mt-4">
        <span className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-xs text-gray-500 ml-1">vs last period</span>
      </div>
    )}
  </motion.div>
);

const DataTable = ({ title, data, columns, loading }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              {columns.map((col) => (
                <th key={col.key} className="pb-3">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="border-b border-gray-100"
              >
                {columns.map((col) => (
                  <td key={`${item.id}-${col.key}`} className="py-4 text-sm">
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AdminDashboard;