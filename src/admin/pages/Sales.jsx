import React from 'react'
import SalesChart from '../components/SalesChart'
import RevenuePieChart from '../components/RevenuePieChart'
import UserBarChart from '../components/UserBarChart'
import SalesLineChart from '../components/SalesLineChart'

const Sales = () => {
  return (
   <div className='mt-4 font-bold'>

     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-1 pb-5'>
       <SalesChart/>
         <RevenuePieChart/>
         <UserBarChart/>
    </div>
    {/* <div>
      <SalesLineChart/>
    </div> */}
   </div>
  )
}

export default Sales