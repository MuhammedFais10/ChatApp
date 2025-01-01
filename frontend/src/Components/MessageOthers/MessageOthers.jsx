import React from 'react'
import "./messageOthers.css"

function MessageOthers({props1}) {
 console.log("message others::",props1);
 if (!props1 || !props1.sender || !props1.sender.name) {
  return null; // Prevent rendering if data is missing
}
  
  return (
    <div className='other-message-container'>
     <div className="conversation-container">
        <p className="con-icon">{props1.sender.name[0]}</p>
        <div className="other-text-content">
          <p className="con-title">{props1.sender.name}</p>
          <p className="con-lastMessage">{props1.content || "No message content"}</p>
          <p className="self-timeStamp">12:00am</p>
        </div>
      </div>
    </div>
  )
}

export default MessageOthers