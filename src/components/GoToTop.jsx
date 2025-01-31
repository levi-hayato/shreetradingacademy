import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const GoToTop = () => {
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

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className="fixed bottom-20 right-20 z-50 w-14 h-14 bg-btn text-white rounded-full flex justify-center items-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors duration-300"
          onClick={goToBtn}
        >
          <FaArrowUp className="animate-bounce" />
        </div>
      )}
    </>
  );
};

export default GoToTop;