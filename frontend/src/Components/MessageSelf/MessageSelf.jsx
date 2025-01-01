import React from 'react'
import "./messageSelf.css"

function MessageSelf() {
  var props2 = {name:"You", message:"This is sample Self Message"}
  return (
    <div className='self-message-contaner'>
      <div className='messageBox'>
        <p>{props2.message}</p>
     <p className='self-timeStamp'>12:00am</p>
      </div>
    </div>
  )
}

export default MessageSelf