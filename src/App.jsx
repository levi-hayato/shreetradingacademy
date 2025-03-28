import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Error from "./pages/Error";
import Gallery from "./pages/Gallery";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import GoToTop from "./components/GoToTop";
import Dashboard from "./admin/Dashboard";
import Login from "./pages/Login";
import Sidebar, { SidebarItem } from "./admin/components/Sidebar";
import FooterContainer from "./components/FooterContainer";
import { FaChild, FaCog, FaHome, FaMoneyBill } from "react-icons/fa";
import { FaChartBar, FaMoneyBill1, FaPersonCircleCheck, FaUsers } from "react-icons/fa6";
import Sales from "./admin/pages/Sales";
import StudentRegistration from "./student/pages/StudentRegistration";
import StudentDashboard from "./student/StudentDashboard";
import { UserProvider } from "./context/UserContext";
import Users from "./admin/pages/Users";
import AdminRoute from "./admin/routes/AdminRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AddCourse from "./admin/pages/AddCourse";
import { AlertProvider } from "./context/AlertContext";
import CourseDetails from "./pages/CourseDetails";
import { BsMessenger } from "react-icons/bs";
import Payments from "./admin/pages/Payments";
import MessagesPage from "./admin/pages/Messages";
import StudentsTable from "./admin/components/StudentsTable";
import AdminsTable from "./admin/components/AdminsTable";
import SettingsPage from "./admin/pages/SettingPage";
import ProfilePage from "./student/pages/ProfilePage";
import Layout from "./student/components/Layout";
import ProfileUpdatePage from "./student/pages/UpdatePage";
import StudentPaymentPage from "./student/pages/StdPayment";
import StudentCoursesPage from "./student/pages/StudentCoursesPage";
import Certificates from "./student/pages/Certificates";
import CookiesPolicy from "./components/Cookies Policy";
import OfflinePurchases from "./admin/pages/OfflinePurchases";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import CourseContent from "./lms/pages/CourseContent";
import InstructorDashboard from "./lms/pages/InstructorDashboard";




function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AlertProvider>
          <UserProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/register" element={<StudentRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/update" element={<ProfileUpdatePage />} />
              <Route path="/cookiespolicy" element={<CookiesPolicy />} />
              <Route path="/content" element={<CourseContent />} />
              <Route path="/add" element={<InstructorDashboard />} />
           
              <Route element={<Layout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/payments" element={<StudentPaymentPage />} />
                <Route path="/student/courses" element={<StudentCoursesPage />} />
                <Route path="/student/certificates" element={<Certificates />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route
                path="/dash/*"
                element={
                  <AdminRoute>
                    <div className="flex h-screen bg-gray-100">
                      <Sidebar>
                        <SidebarItem icon={<FaHome />} text="Home" to={'/dash'} />
                        <SidebarItem icon={<FaChartBar />} text="Sales" to={'/dash/sales'} />
                        <SidebarItem
                          icon={<FaUsers />}
                          text="Manage"
                          dropdownItems={[
                            { text: "Courses", to: "/dash/manage", icon: <FaUsers /> },
                            { text: "Admins", to: "/dash/admins", icon: <FaPersonCircleCheck /> },
                            { text: "Students", to: "/dash/students", icon: <FaChild /> },
                          ]}
                        />
                        <SidebarItem icon={<FaMoneyBill1 />} text="Payments" to={'/dash/payments'} alert />
                        <SidebarItem icon={<FaMoneyBill />} text="Offline" to={'/dash/offline'} alert />
                        <SidebarItem icon={<BsMessenger />} text="Messages" to={'/dash/message'} alert />
                        <SidebarItem icon={<FaCog />} text="Settings" to={'/dash/settings'} />
                      </Sidebar>
                      <div className="flex-1 p-0 overflow-y-auto">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/sales" element={<Sales />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/payments" element={<Payments />} />
                          <Route path="/manage" element={<AddCourse />} />
                          <Route path="/message" element={<MessagesPage />} />
                          <Route path="/students" element={<StudentsTable />} />
                          <Route path="/admins" element={<AdminsTable />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/offline" element={<OfflinePurchases />} />
                        </Routes>
                      </div>
                    </div>
                  </AdminRoute>
                }
              />

              <Route path="*" element={<Error />} />
            </Routes>
            <GoToTop />
            <FooterContainer />
          </UserProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;