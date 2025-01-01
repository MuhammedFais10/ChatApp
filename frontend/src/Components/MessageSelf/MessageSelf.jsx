import React from 'react'
import "./messageSelf.css"

function MessageSelf({props}) {

 console.log("message self:::",props);



  return (
    <div className='self-message-contaner'>
      <div className='messageBox'>
      <p>{props.content || "No message"}</p>
     
     <p className='self-timeStamp'>12:00am</p>
      </div>
    </div>
  )
}

export default MessageSelf