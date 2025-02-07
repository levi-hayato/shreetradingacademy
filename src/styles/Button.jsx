import React from 'react'

const CustomButton = () => {
  return (
    <button
      className="overflow-hidden w-32 p-1 h-10 bg-btn text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
    >
      Let's join  
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"
      ></span>
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-purple-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"
      ></span>
      <span
        className="absolute w-36 h-32 -top-8 -left-2 bg-purple-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"
      ></span>
      <span
        className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1.2 left-6 z-1000"
        >Explore!</span
      >
    </button>
  )
}

export default CustomButton