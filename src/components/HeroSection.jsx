import React, { useState, useEffect } from "react";
import heroimage from '../assets/hero.png';

const HeroSection = () => {
    const [showCookies, setShowCookies] = useState(true);

    // Check if cookies are already accepted/rejected
    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (cookiesAccepted) {
            setShowCookies(false);
        }
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

    return (
        <section className="w-full mx-20 md:px-50 p-20">
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
                        <p>We use cookies to enhance your experience. Learn more in our <a href="/cookies-policy" className="underline">Cookies Policy</a></p>
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
        </section>
    );
};

export default HeroSection;
