import React, { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import Services from './Services'
import Gallery from './Gallery'
import Loader from '../components/Loader'

const Home = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading time (e.g., fetching data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Loader will disappear after 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (


    <div className='w-full h-full flex flex-col justify-center items-center dark:bg-gray-300 m-auto p-auto'>
      {isLoading ? <div className='w-[90%] h-[90%] flex justify-center items-center'>
        <Loader />
      </div> :
        <>
          <HeroSection />
          <Services />
          <Gallery />
        </>
      }
    </div>

  )
}

export default Home