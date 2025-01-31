import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faSchool, faGraduationCap, faTools, faPersonBooth, faPersonChalkboard, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { ServicesData } from '../mockdata/ServicesData'

const Services = () => {

  return (

    <>
      <h1 className='text-black text-2xl w-full flex flex-col items-center justify-start font-extrabold uppercase relative after:block after:w-20 after:h-1 hover:after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-20 after:mt-1 after:mb-2 overflow-y-hidden'>Services</h1>
      <div className='grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-2 px-4 md:px-30 p-5 mx-30 w-[90%] items-center justify-center  overflow-y-hidden'>

        {
          ServicesData.map((items) => {
            return (
              <div key={items.id}
                class="w-auto cursor-pointer h-80 rounded-xl group flex flex-col justify-center hover:bg-btn hover:text-white transition duration-700 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-10 space-y-3 relative overflow-hidden"
              >
                <div
                  style={{ borderRadius: "23% 77% 15% 85% / 72% 25% 75% 28%" }}
                  class="w-24 h-24 bg-btn group-hover:bg-white  group-hover:text-btn text-white rounded-full absolute -right-5 -top-7">
                  <p class="absolute font-semibold bottom-6 left-7 text-2xl">{items.id}</p>
                </div>
                <div class="fill-violet-500 w-12">

                  <FontAwesomeIcon icon={items.icon} className='text-4xl text-btn group-hover:text-white' />

                </div>
                <h1 class="font-bold text-xl">{items.title}</h1>
                <p class="text-sm leading-6">
                  {items.summary}
                </p>
              </div>
            )
          })
        }

      </div>
    </>

  )
}

export default Services

