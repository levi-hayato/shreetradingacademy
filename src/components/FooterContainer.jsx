import React from 'react'
import Footer from './Footer'
import { useLocation } from 'react-router-dom';

const FooterContainer = () => {

    const location = useLocation();

    // Define routes where Navbar should be hidden
    const hideNavbarRoutes = ["/dash" , "/dash/sales"];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
  <div>
     {!shouldHideNavbar && <Footer/>}
  </div>
  )
}

export default FooterContainer