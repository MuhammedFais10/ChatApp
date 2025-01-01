import React from 'react'
import "./welcom.css"
import logo from "../../Icons/live-chat.png"


function Welcome() {
  return (
    <div className='welcome-container'>
      <img className='welcome-logo' src={logo} alt='Logo'/>
      <p className='welcome-text'>View and text directly to 
        people in the Rooms.</p>
    </div>
  )
}

export default Welcome