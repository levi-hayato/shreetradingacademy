import React from "react";
import { NavLink } from "react-router-dom";

const Resume = 'https://drive.google.com/file/d/1b5kWM4xNih8-3JDu_efI8d5qTwSUDMn9/view?usp=sharing';

const Footer = () => {
  const downloadCV = (url) => {
    const fileName = url.split('/').pop();
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.setAttribute('download', fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <div className="bg-gray-900 mt-20 text-white py-10 px-5 flex flex-col items-center">
      {/* Call-to-Action Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 w-full max-w-screen-lg p-6 bg-gray-800 shadow-lg rounded-lg transform -translate-y-22">
        <div>
        <h3 className="text-xl font-bold">🌟 Let's Get Started 📊</h3>
        <p>Success in trading isn’t about luck; it's about discipline, strategy, and constant learning.</p>
        </div>
        <button 
          onClick={() => downloadCV(Resume)} 
          className="bg-btn text-white font-bold px-6 py-3 rounded-md hover:bg-blue-500 transition duration-100"
        >
          Download Broucher
        </button>
      </div>

      {/* Footer Content */}
      <div className="grid grid-cols-1  md:grid-cols-3 gap-8 w-full max-w-screen-lg mt-5">
        {/* About Me Section */}
        <div>
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-6 h-6 mr-2">
              <path fill="white" d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 256l64 0c44.2 0 80 35.8 80 80 0 8.8-7.2 16-16 16L80 384c-8.8 0-16-7.2-16-16 0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/>
            </svg>
            <h3 className="text-2xl font-bold uppercase">About Us</h3>
          </div>
          <p className="text-gray-100">
          We are dedicated to shaping the future of trading by providing students with the knowledge, skills, and confidence to excel in the financial markets. With a focus on practical, hands-on Welcome ensures that students gain real-world experience and insights. Join us at Welcome, where we empower tomorrow's traders today.
            </p>
        </div>

        {/* Important Links Section */}
        <div>
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-6 h-6 mr-2">
              <path fill="white" d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7z"/>
            </svg>
            <h3 className="text-2xl font-bold uppercase">Important Links</h3>
          </div>
          <div className="flex flex-col space-y-1 uppercase">
            {['Courses','About', 'Services', 'Gallery', 'Contact', 'Send Mail'].map((link, index) => (
              <NavLink 
                key={index} 
                to={link === 'Send Mail' ? 'mailto:shreetrading.live@gmail.com' : `/${link.toLowerCase()}`} 
                className="text-gray-100 hover:text-blue-400 transition duration-100"
              >
                ➤ {link}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Contact Info Section */}
        <div>
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-6 h-6 mr-2">
              <path fill="white" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
            </svg>
            <h3 className="text-2xl font-bold uppercase">Contact Info</h3>
          </div>
          <p className="text-gray-100"><strong>Address : </strong> Shree Trading Academy uttamrao shinde patil complex , Yeola 423401
          </p>
          <p className="text-gray-100"><strong>Email : </strong>shreetrading.live@gmail.com</p>
          <p className="text-gray-100"><strong>Phone : </strong> +91 7498834553</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-full mt-8 text-center">
        <hr className="border-gray-700 mb-4" />
        <p className="text-gray-100">@{new Date().getFullYear()} Shree Trading Academy. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
