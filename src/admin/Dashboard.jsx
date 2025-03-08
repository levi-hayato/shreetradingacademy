import React from 'react'
import Card from './components/Card'
import { FaBell } from 'react-icons/fa6'
import { FiLogOut } from 'react-icons/fi'
import { handleLogout } from '../firebase/authContext'
import StudentsTable from './components/StudentsTable'
import Sales from './pages/Sales'
import { useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <div className='pb-30 m3'>
    <div className='flex justify-between'>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <div className='flex'>
    <button onClick={() =>{navigate("/")}} className=' bg-white border-1 border-white rounded-2xl w-8 flex justify-center items-center hover:bg-btn transition duration-300 hover:text-white p-1 '><FaHome/></button>
    <button className=' bg-white border-1 border-white rounded-2xl w-8 flex justify-center items-center hover:bg-btn transition duration-300 hover:text-white p-1 '><FaBell/></button>
    <button onClick={() =>{
      handleLogout()
    }} className=' bg-white border-1 border-white rounded-2xl w-8 flex justify-center items-center hover:bg-btn transition duration-300 hover:text-white p-1 mx-3'><FiLogOut/></button>

    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <Card title="Total Sales" value="$25,000" />
      <Card title="New Users" value="1,250" />
      <Card title="Total Courses" value="30" />
      <Card title="Active Users" value="8,400" />
    </div>
   <Sales/>
<div>
  <StudentsTable/>
</div>
  </div>
  )
}

export default Dashboard