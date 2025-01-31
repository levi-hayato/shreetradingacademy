import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Error from "./pages/Error"
import Gallery from "./pages/Gallery"
import Courses from "./pages/Courses"
import Contact from "./pages/Contact"
import Footer from "./components/Footer"
import GoToTop from "./components/GoToTop"

function App() {

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
      <GoToTop/>
      <Footer/>
  </BrowserRouter>
  )
}

export default App
