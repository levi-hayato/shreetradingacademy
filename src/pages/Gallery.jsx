import { useState, useEffect } from "react";
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners"; // For the loader

const Gallery = () => {
  // Sample Images (Replace with your actual image URLs)
  const images = [
    "https://desk-on-fire-store.com/assets/assets/gallery/img1.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img2.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img3.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img4.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img5.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img6.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img7.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img8.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img9.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img10.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img11.jpg",
    "https://desk-on-fire-store.com/assets/assets/gallery/img12.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state
  const [currentIndex, setCurrentIndex] = useState(0); // Track current image index

  // Simulate image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate 2 seconds loading time
    return () => clearTimeout(timer);
  }, []);

  // Handle next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setSelectedImage(images[(currentIndex + 1) % images.length]);
  };

  // Handle previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mb-20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Photo Gallery</h2>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
              onClick={() => {
                setSelectedImage(img);
                setCurrentIndex(index);
              }}
            >
              <img
                src={img}
                alt={`Gallery ${index}`}
                className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaExpand className="text-white text-3xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>

            {/* Previous Button */}
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300"
              onClick={handlePrev}
            >
              <FaChevronLeft />
            </button>

            {/* Next Button */}
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300"
              onClick={handleNext}
            >
              <FaChevronRight />
            </button>

            {/* Selected Image */}
            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;