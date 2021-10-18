import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Incept.js</h1>
      <Link to="/about">About</Link>
    </div>
  )
}