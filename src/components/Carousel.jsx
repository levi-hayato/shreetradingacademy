import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from '../assets/img1.jpg'

const Carousel = () => {
  const slides = [
    {
      id: 1,
      img: img1,
      text: "🌿 Explore the beauty of nature",
    },
    {
      id: 2,
      img: img1,
      text: "💻 Technology makes everything possible",
    },
    {
      id: 3,
      img: img1,
      text: "🌆 The city lights at night",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Debugging: Log URLs to check if they are correct
  useEffect(() => {
    console.log("Current image URL:", slides[currentIndex].img);
  }, [currentIndex]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="relative w-[90%] max-w-4xl h-[500px] overflow-hidden rounded-lg shadow-lg">
        <AnimatePresence>
          <motion.div
            key={slides[currentIndex].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <img
              src={slides[currentIndex].img}
              alt="Slide"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                console.error("Error loading image:", e.target.src);
                e.target.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
              }}
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <h2 className="text-white text-2xl font-bold text-center px-6">
                {slides[currentIndex].text}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600 transition"
        >
          ❮
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600 transition"
        >
          ❯
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-gray-500"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
