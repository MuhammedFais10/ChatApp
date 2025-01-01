import React, { useState } from "react";
import "./App.css";
import MainContainer from "./Components/MainContainer/MainContainer";
import Login from "./Components/Login/Login";
import { Route, Routes } from "react-router-dom";
import Welcome from "./Components/WelcomeBoard/Welcome";
import ChatArea from "./Components/ChatArea/ChatArea";
import CreateGroups from "./Components/CreateGroups/CreateGroups";
import Users from "./Components/Users/Users";
import Groups from "./Components/Groups/Groups";
//import User_Groups from "./Components/User_Groups/User_Groups";
import SignUp from "./Components/SignUp/SignUp"

function App() {
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
    <>
      <div
        className="App"
        style={{ height: "100vh", width: "100vw", display: "flex" }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="app" element={<MainContainer />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="chat" element={<ChatArea data={selectedChat} />} />
            <Route path="users" element={<Users />} />
            <Route path="groups" element={<Groups />} />
            {/* <Route path="users-group" element={<User_Groups/>} /> */}
            <Route path="create-groups" element={<CreateGroups />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
