import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { FaArrowRight, FaChartLine, FaUserGraduate, FaCertificate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 });
      await controls.start({ 
        rotate: [0, 10, -10, 0],
        transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
      });
    };
    sequence();
  }, [controls]);

  return (
    <div className="relative p-0 m-0 w-full md:px-30 overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Animated Background Shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating shapes */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              transition: { duration: 15, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-indigo-500 filter blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              transition: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-3/4 left-3/4 w-24 h-24 rounded-full bg-purple-500 filter blur-xl"
          />
          <motion.div
            animate={{
              x: [0, 120, 0],
              y: [0, -30, 0],
              transition: { duration: 18, repeat: Infinity, ease: "linear" }
            }}
            className="absolute top-2/3 left-1/3 w-20 h-20 rounded-full bg-indigo-600 filter blur-xl"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Master The Stock Market With <span className="text-btn">Expert Guidance</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg">
                Join India's most trusted trading education platform and transform your financial future with our proven strategies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-btn hover:bg-purple-600 text-white-900 font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all"
                  onClick={() => {
                    navigate('/courses');
                  }}
                >
                  Enroll Now <FaArrowRight />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-900 font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all"
                  onClick={() => {
                    navigate('/contact');
                  }}
                >
                  Free Demo Class
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Animated Cards */}
<div className="grid grid-cols-2 gap-4 z-10">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-white/20 backdrop-filter backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="text-btn mb-4">
      <FaChartLine size={32} />
    </div>
    <h3 className="text-xl font-bold mb-2">Live Market Analysis</h3>
    <p className="text-white/90">Real-time trading sessions with experts</p>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="bg-white/20 backdrop-filter backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="text-btn mb-4">
      <FaUserGraduate size={32} />
    </div>
    <h3 className="text-xl font-bold mb-2">1-on-1 Mentorship</h3>
    <p className="text-white/90">Personalized guidance from industry veterans</p>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.6 }}
    className="bg-white/20 backdrop-filter backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="text-btn mb-4">
      <FaCertificate size={32} />
    </div>
    <h3 className="text-xl font-bold mb-2">Certification Program</h3>
    <p className="text-white/90">Recognized industry credentials</p>
  </motion.div>

  <motion.div
    animate={controls}
    initial={{ opacity: 0, y: 50 }}
    className="bg-white backdrop-filter backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col justify-center items-center border-2 border-white/20 hover:shadow-2xl transition-all"
  >
    <h3 className="text-xl font-bold mb-2 text-center text-[#1a202c]">Limited Time Offer</h3>
    <p className="text-[#2d3748] text-center mb-4">Enroll today and get 20% off</p>
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="bg-[#6254f3] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md"
    >
      Claim Offer
    </motion.div>
  </motion.div>
</div>
        </div>
      </div>

      {/* Animated Trading Chart Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-0 left-0 w-full h-32"
      >
        <svg viewBox="0 0 1200 120" className="w-full h-full">
          <path
            d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,53.3C1248,53,1344,75,1392,85.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="white"
          ></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroSection;