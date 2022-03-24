import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (  
    <div>
        <h1 className="text-3xl font-bold underline">Welcome to Thumstack Spoon</h1>
        <div className='mt-5 flex  justify-center'>
        <Link to="/place-order" 
        className=' bg-green-200 hover:bg-green-500 hover:text-white text-green-500 text-center py-2 px-4 rounded'>Enter the restaurant</Link>
        </div>
    </div>
  ) 
}
