import React from 'react'
import { AnimatePresence , motion} from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { NavbarMenu } from '../mockdata/Menuitems'

const ResponsiveMenu = ({ open }) => {
  return (
    <AnimatePresence mode='wait'>
      {
        open && (
          <motion.div
            initial={{ opacity: 0 , y: -100 }}
            animate={{ opacity: 1 , y: 0}}
            exit={{ opacity: 0 , y: -100}}
            transition={{ duration: 0.4 }}
            ClassName="absolute top-20 left-0 w-full h-screen bg-black/60 z-20"
          >
            <div className='text-xl font-semibold uppercase bg-btn text-white py-10 m-6 rounded-3xl '>
              <ul className='flex flex-col justify-center items-center gap-4'>
              {
                                NavbarMenu.map((item) => {
                                    return (

                                        <li key={item.id}>
                                            <NavLink className='inline-block py-1 hover:text-btn duration-900' to={item.link}>{item.title}</NavLink>
                                        </li>

                                    )
                                })
                            }
              </ul>
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}

export default ResponsiveMenu