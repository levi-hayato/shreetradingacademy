import React from 'react'

const Card = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl font-bold mt-2">{value}</p>
      </div>
    );
  };
  

export default Card