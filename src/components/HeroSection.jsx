import React, { useState, useEffect } from "react";
import heroimage from '../assets/hero.png';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const HeroSection = () => {
    const [showCookies, setShowCookies] = useState(true);

     const [isVisible, setIsVisible] = useState(false);
    
      const goToBtn = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      };
    
      const listenToScroll = () => {
        const heightToHidden = 250;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
        if (winScroll > heightToHidden) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

    // Check if cookies are already accepted/rejected
    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (cookiesAccepted) {
            setShowCookies(false);
        }
        window.addEventListener('scroll', listenToScroll);
        return () => window.removeEventListener('scroll', listenToScroll);
    }, []);

    // Handle Cookie Acceptance
    const handleAcceptCookies = () => {
        localStorage.setItem("cookiesAccepted", "true"); // Store user preference
        setShowCookies(false);
    };

    // Handle Cookie Rejection
    const handleRejectCookies = () => {
        localStorage.setItem("cookiesAccepted", "false"); // Store rejection (optional)
        setShowCookies(false);
    };

    const navigate = useNavigate();

    return (
        <section className="w-full mx-20 md:px-50 p-20">
             <Helmet>
                                <title>Home - Shree Trading Academy</title>
                                <meta name="description" content="Learn how Shree Trading Academy uses cookies to enhance your experience on our trading education platform." />
                              </Helmet>
            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
                {/* Left Side Content */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Put <span className="text-btn">people</span> first
                    </h1>
                    <p className="text-gray-600 mt-4">
                        Fast, user-friendly and engaging – turn HR into people and culture and streamline your daily operations with your own branded app.
                    </p>

                    {/* Email Input and Button */}
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-2 border rounded-lg p-2 shadow-md w-full max-w-md">
                        <input
                            type="email"
                            placeholder="Enter work email"
                            className="flex-1 w-40 px-4 py-2 border-none focus:outline-none"
                        />
                        <button className="bg-btn font-bold text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-black transition">
                            Get Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex md:flex-col p-8 m-0 rounded-lg w-fit justify-start">
                        <div className="text-center w-full flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-gray-700">Average daily activity</h2>
                                <p className="text-2xl font-bold text-gray-900 mt-1">75.2%</p>
                            </div>
                            <div className="w-[2px] bg-gray-500 mx-8 h-14"></div>
                            <div>
                                <h2 className="font-semibold text-gray-700">Average daily users</h2>
                                <p className="text-2xl font-bold text-gray-900 mt-1">~20k</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Illustration */}
                <div className="md:w-1/2 mt-10 md:mt-0 w-full flex justify-end items-center">
                    <img src={heroimage} alt="App Mockup" className="w-auto" />
                </div>
            </div>

            {/* Cookies Section */}
            {showCookies && (
                <div className="w-full flex flex-col lg:flex-row justify-between rounded-2xl bg-btn my-12 p-8 text-white">
                    <div>
                        <h3 className="font-bold">Accept all cookies</h3>
                        <p>We use cookies to enhance your experience. Learn more in our <Link to={'/cookiespolicy'}>Cookies Policy</Link></p>
                    </div>
                    <div className="font-extrabold">
                        <button
                            onClick={handleAcceptCookies}
                            className="bg-white font-bold text-black px-6 m-1 py-2 rounded-lg hover:bg-black hover:text-white transition"
                        >
                            Accept
                        </button>
                        <button
                            onClick={handleRejectCookies}
                            className="bg-white font-bold text-black px-6 m-1 py-2 rounded-lg hover:bg-black hover:text-white transition"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}

            {showCookies && isVisible && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="w-[70%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-500 ease-in-out">
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl overflow-hidden my-4 p-6 text-white border border-white/10 backdrop-blur-sm">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                    <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-purple-400/10"></div>
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-indigo-400/10"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold tracking-tight">Your Privacy Matters</h3>
                            <p className="text-sm opacity-90 mt-1">
                              We use cookies to enhance your experience. By continuing, you agree to our 
                              <Link to={'/cookiespolicy'} className="ml-1 underline hover:no-underline font-medium">Cookies Policy</Link>.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleRejectCookies}
                          className="relative overflow-hidden px-6 py-2.5 rounded-lg font-bold text-white bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 group"
                        >
                          <span className="relative z-10">Reject</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                        
                        <button
                          onClick={handleAcceptCookies}
                          className="relative overflow-hidden px-6 py-2.5 rounded-lg font-bold text-white bg-white/10 hover:bg-white/90 hover:text-indigo-600 transition-all duration-300 shadow-md group"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            Accept All
                            <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Close button */}
                    <button 
                      onClick={handleRejectCookies}
                      className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
        </section>
    );
};

export default HeroSection;
