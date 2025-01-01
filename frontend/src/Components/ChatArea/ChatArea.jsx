import React from 'react'
import "./chatArea.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from '../MessageOthers/MessageOthers';
import MessageSelf from '../MessageSelf/MessageSelf';
import { useSelector } from 'react-redux';

function ChatArea({ data }) {
  console.log(data);
  const lightTheme= useSelector((store)=>store.themeKey)
  
  return (
    <div className="chatArea-container">
      <div  className={`ChatArea-Header ${lightTheme ? "" : "dark"}`}>
        <p className="con-icon">{data.name[0]}</p>
        <div className="header-text">
          <p className="con-title">{data.name}</p>
          <p className="con-titleStamp">{data.timeStamp}</p>
        </div>
        <IconButton>
          <DeleteIcon className={`icon ${lightTheme ? "" : "dark"}`}  />
        </IconButton>
      </div>
      <div className={`messages-container ${lightTheme ? "" : "dark"}`} >
        <MessageOthers/>
        <MessageSelf/>
        <MessageOthers/>
        <MessageSelf/>
        <MessageOthers/>
        <MessageSelf/>
        <MessageOthers/>
        <MessageSelf/>
        <MessageOthers/>
        <MessageSelf/>
      </div>
      <div className={`text-input-area ${lightTheme ? "" : "dark"}`}>
            <input placeholder='Type a Message' className={`search-box ${lightTheme ? "" : "dark"}`}/>
            <IconButton>
           < SendIcon className={`icon ${lightTheme ? "" : "dark"}`} />
            </IconButton>
      </div>
    </div>
  );
}

export default ChatArea