import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { ServicesData } from '../mockdata/ServicesData'
import { motion } from 'framer-motion'

const Services = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <section className="relative py-16 md:px-40 overflow-hidden">
     
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-50/30 z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-100/20 blur-xl z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Enhanced heading with animation */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className='text-4xl font-extrabold text-gray-900 uppercase mb-4 relative inline-block'>
            <span className="relative">
              Our Services
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-indigo-500 transition-all duration-500 group-hover:w-20"></span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover comprehensive trading education programs tailored for all skill levels
          </p>
        </motion.div>

        {/* Services grid with animations */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className='grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6'
        >
          {ServicesData.map((items) => (
            <motion.div 
              key={items.id}
              variants={item}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer h-96 rounded-2xl flex flex-col justify-center hover:bg-btn hover:text-white transition-all duration-500 bg-white shadow-xl hover:shadow-2xl p-8 space-y-4 overflow-hidden"
            >
              {/* Floating number badge */}
              <div
                style={{ borderRadius: "23% 77% 15% 85% / 72% 25% 75% 28%" }}
                className="w-24 h-24 bg-btn group-hover:bg-white group-hover:text-btn text-white rounded-full absolute -right-5 -top-7 transition-all duration-500"
              >
                <p className="absolute font-bold bottom-6 left-7 text-2xl">{items.id}</p>
              </div>

              {/* Icon with pulse animation on hover */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-indigo-100/30 rounded-full scale-0 group-hover:scale-100 transition-all duration-500"></div>
                <FontAwesomeIcon 
                  icon={items.icon} 
                  className='relative z-10 text-4xl text-btn group-hover:text-white transition-colors duration-300' 
                />
              </div>

              <h1 className="font-bold text-2xl">{items.title}</h1>
              <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-300">
                {items.summary}
              </p>

              {/* Learn more link that appears on hover */}
              <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="flex items-center text-sm font-semibold">
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>

              {/* Subtle border animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-2xl transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Services