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
import { FaChild, FaCog, FaHome } from "react-icons/fa";
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

function App() {
  return (
    <BrowserRouter>
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
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/log" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* 🔹 Restrict /dash to Admins Only */}
          <Route
            path="/dash/*"
            element={
              <AdminRoute>
                <div className="flex h-screen bg-gray-100">
                  <Sidebar>
                    <SidebarItem icon={<FaHome />} text="Home" to={'/dash'} />
                    <SidebarItem icon={<FaChartBar />} text="Sales" to={'/dash/sales'} />
                    <SidebarItem icon={<FaUsers />} text="Manage" dropdownItems={[
                      { text: "Courses", to: "/dash/manage", icon: <FaUsers /> },
                      { text: "Admins", to: "/users/admins", icon: <FaPersonCircleCheck /> },
                      { text: "Students", to: "/users/students", icon: <FaChild /> },
                    ]} />
                    <SidebarItem icon={<FaMoneyBill1 />} text="Payments" to={'/dash/payments'} alert />
                    <SidebarItem icon={<BsMessenger />} text="Messages" to={'/settings'} alert />
                    <SidebarItem icon={<FaCog />} text="Settings" to={'/settings'} alert />
                  </Sidebar>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/manage" element={<AddCourse />} />
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
    </BrowserRouter>
  );
}

export default App;
