import React from 'react'
import "./welcom.css"
import logo from "../../Icons/live-chat.png"
import { useAuthContext } from '../hooks/AuthProvider'


function Welcome() {
  const {user} = useAuthContext()
  return (
    <div className='welcome-container'>
      <img className='welcome-logo' src={logo} alt='Logo'/>
      <p className='welcome-text'>View and text directly to 
        people in the Rooms.</p>
        <p style={{ color: "red" }}>{user.name}</p>
    </div>
  )
}

export default Welcome