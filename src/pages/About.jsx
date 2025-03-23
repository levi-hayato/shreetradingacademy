import React from "react";
import { FaUsers, FaLightbulb, FaRocket } from "react-icons/fa"; // React Icons

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Floating Shapes Background */}
      <div className="absolute inset-0 z-0">
        {/* Circle */}
        <div className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-20 animate-float1 -top-16 -left-16"></div>
        {/* Triangle */}
        <div className="absolute w-48 h-48 bg-blue-200 opacity-20 animate-float2 top-1/4 right-16 transform rotate-45"></div>
        {/* Square */}
        <div className="absolute w-56 h-56 bg-pink-200 opacity-20 animate-float3 bottom-16 left-1/4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 uppercase mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            We are a team of passionate individuals dedicated to creating amazing experiences.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div className="text-center">
              <FaUsers className="text-5xl text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Team</h2>
              <p className="text-gray-600">
                A diverse and talented team working together to achieve great things.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div className="text-center">
              <FaLightbulb className="text-5xl text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Vision</h2>
              <p className="text-gray-600">
                To innovate and inspire through creativity and technology.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div className="text-center">
              <FaRocket className="text-5xl text-pink-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h2>
              <p className="text-gray-600">
                To deliver exceptional solutions that make a difference.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2020, we started as a small team with a big dream. Over the years, we've grown
            into a dynamic company that values innovation, collaboration, and customer satisfaction.
            Our journey has been filled with challenges and triumphs, but through it all, we've
            remained committed to our core values.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;