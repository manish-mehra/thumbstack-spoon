import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (  
    <div>
        <h1>Welcome to Thumstack Spoon</h1>
        <Link to="/place-order">Enter the restaurant</Link>
    </div>
  ) 
}
