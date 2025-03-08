import { useState } from "react";
import { FaExpand, FaTimes } from "react-icons/fa";

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Photo Gallery</h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
            onClick={() => setSelectedImage(img)}
          >
            <img src={img} alt={`Gallery ${index}`} className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaExpand className="text-white text-3xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
            <img src={selectedImage} alt="Full View" className="w-full max-h-[80vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
