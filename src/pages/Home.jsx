import React from 'react'
import HeroSection from '../components/HeroSection'
import Services from './Services'

const Home = () => {
  return (
   <div className='w-full h-full flex flex-col justify-center items-center dark:bg-gray-300 m-auto p-auto'>
     <HeroSection/>
     <Services/>
   </div>
  )
}

export default Home