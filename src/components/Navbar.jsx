import { NavLink } from "react-router-dom"
import { NavbarMenu } from "../mockdata/Menuitems"
import { MdMenu } from "react-icons/md"
import { useState } from "react"
import ResponsiveMenu from "./ResponsiveMenu"
import { BsPerson } from "react-icons/bs"
import { FaX } from "react-icons/fa6"

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <>
            <nav className="font-poppins w-full px-8 bg-bg dark:bg-gray-600">
                <div className="container  flex justify-between items-center">

                    {/* logo Section  */}
                    <div className="w-60 lg-auto">
                        <img className="w-30 size-14" src="https://desk-on-fire-store.com/assets/logo.png" alt="" />
                    </div>

                    {/* menu Section  */}
                    <div className="hidden lg:block">
                        <ul className="flex items-center gap-3 text-gray-600 dark:text-white uppercase font-semibold">
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



                  

                    {/* mobile hamburger menu Section  */}
                    <div className="flex items-center">
                          {/* icon Section  */}
                    <div className="flex justify-end">
                        <button className="text-2xl border border-gray-400 dark:text-white  hover:bg-btn hover:text-white hidden lg:flex rounded-full p-1.5 duration-200">
                            <BsPerson />
                        </button>




                    </div>
                        <button onClick={() => setOpenSearch(!openSearch)} className="text-2xl hidden md:flex hover:text-white rounded-full p-1 duration-200">
                            {
                                // openSearch ? <CiSearch /> : 
                                <div className="px-3">

                                    <form className="flex items-center max-w-lg mx-auto">
                                        <label className="sr-only" for="voice-search">Search</label>
                                        <div className="relative w-full">
                                            <div
                                                class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                                            >
                                                <svg
                                                    viewBox="0 0 21 21"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                >
                                                    <path
                                                        d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                                                        stroke-width="2"
                                                        stroke-linejoin="round"
                                                        stroke-linecap="round"
                                                        stroke="currentColor"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <input
                                                required=""
                                                placeholder="Search..."
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                id="voice-search"
                                                type="text"
                                            />
                                            <button
                                                className="absolute cursor-pointer inset-y-0 end-0 flex items-center pe-3"
                                                type="button"
                                            >
                                               <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                                className="w-4 h-4 me-2"
                                            >
                                                <path
                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                    stroke-width="2"
                                                    stroke-linejoin="round"
                                                    stroke-linecap="round"
                                                    stroke="currentColor"
                                                ></path></svg>
                                            </button>
                                        </div>
                                      
                                    </form>


                                </div>
                            }
                        </button>

                        {
                            open ? <FaX className="text-2xl lg:hidden dark:text-white" onClick={() => setOpen(!open)} /> : <MdMenu className="text-3xl lg:hidden dark:text-white" onClick={() => setOpen(!open)} />
                        }
                    </div>
                </div>
            </nav>

            {/* mobile sidebar section  */}
            <ResponsiveMenu open={open} />
        </>
    )

}

export default Navbar