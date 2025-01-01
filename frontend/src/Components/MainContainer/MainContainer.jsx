import React, { useState } from "react";
import "./mainContainer.css";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";


function MainContainer() {
  const [conv, setConv] = useState([
    {
      name: "Test#1",
      lastMessage: "Last Message",
      timeStamp: "today",
    },
    {
      name: "Test#2",
      lastMessage: "Last Message",
      timeStamp: "today",
    },
    {
      name: "Test#3",
      lastMessage: "Last Message",
      timeStamp: "today",
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(conv[0]); // Default to the first chat

  return (
    
    <div className="main-container">
      <SideBar props={conv} onSelectChat={(chat) => setSelectedChat(chat)} />
      <Outlet />
    </div>
  );
}

export default MainContainer;
