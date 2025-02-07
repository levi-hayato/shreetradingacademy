import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Error from "./pages/Error"
import Gallery from "./pages/Gallery"
import Courses from "./pages/Courses"
import Contact from "./pages/Contact"
import GoToTop from "./components/GoToTop"
import Dashboard from "./admin/Dashboard"
import Login from "./pages/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import Sidebar, { SidebarItem } from "./admin/components/Sidebar"
import FooterContainer from "./components/FooterContainer"
import { FaCog, FaHome } from "react-icons/fa"
import { FaChartBar, FaUsers } from "react-icons/fa6"
import Sales from "./admin/pages/Sales"
import StudentRegistration from "./student/pages/StudentRegistration"
import StudentDashboard from "./student/StudentDashboard"
import { UserProvider } from "./context/UserContext"
import Users from "./admin/pages/Users"

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/log" element={<Login />} />

          <Route
            path="/dash/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-100">
                  <Sidebar>
                    <SidebarItem icon={<FaHome />} text="Home" to={'/dash'} />
                    <SidebarItem icon={<FaChartBar />} text="Sales" to={'/dash/sales'} />
                    <SidebarItem icon={<FaUsers />} text="Users" dropdownItems={[
                      { text: "All Users", to: "/users/all" , icon : <FaChartBar/> },
                      { text: "Admins", to: "/users/admins" , icon : <FaChartBar/>  },
                      { text: "Students", to: "/users/students" , icon : <FaChartBar/>},
                    ]} to={'/dash/users'} />
                    <SidebarItem icon={<FaCog />} text="Settings" to={'/settings'} alert />
                  </Sidebar>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/users" element={<Users />} />
                    </Routes>
                  </div>

                </div>


              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Error />} />
        </Routes>
        <GoToTop />
        <FooterContainer />
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
