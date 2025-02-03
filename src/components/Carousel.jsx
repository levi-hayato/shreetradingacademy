import React, { useState, useEffect } from "react";
import img1 from 'https://desk-on-fire-store.com/assets/assets/gallery/img1.jpg'
import img2 from 'https://desk-on-fire-store.com/assets/assets/gallery/img2.jpg'
import img3 from 'https://desk-on-fire-store.com/assets/assets/gallery/img3.jpg'

const Carousel = () => {
  const slides = [
    {
      id: 1,
      img: img1,
      text: "Explore the beauty of nature",
    },
    {
      id: 2,
      img: img2,
      text: "Technology makes everything possible",
    },
    {
      id: 3,
      img: img3,
      text: "The city lights at night",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="h-screen w-[90%] flex items-center justify-center">
    <div className="relative w-full h-auto mx-auto mt-2 mb-30 overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <img
              src={slide.img}
              alt="Slide"
              className="w-full h-screen object-cover rounded-lg"
            />
            {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h2 className="text-white text-xl font-bold">{slide.text}</h2>
            </div> */}
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
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
