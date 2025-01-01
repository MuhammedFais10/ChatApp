import React, { useState } from "react";
import "./users.css";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../Icons/live-chat.png";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { useAuthContext } from "../hooks/AuthProvider";

import axios from "axios";
import api from "../../axiosConfig";
//import { useNavigate } from "react-router-dom";

function Users() {
  const {fetchedUsers,updateSelectedConversation ,user} = useAuthContext();
  const [conversation, setConversation]= useState()
  console.log("USers PAge::", fetchedUsers);
  console.log("USers PAge updateSelectedConversation::", updateSelectedConversation);

  const lightTheme = useSelector((store) => store.themeKey);

 
 

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        key="list-container"
        className="list-container"
      >
        <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
          <img
            src={logo}
            alt="Live Chat Logo"
            style={{ height: "2rem", width: "2rem", marginleft: "10px" }}
          />
          <p className="ug-title">Online Users</p>
        </div>

        <div className={`ug-search ${lightTheme ? "" : "dark"}`}>
          <IconButton>
            <SearchIcon className={`icon ${lightTheme ? "" : "dark"}`} />
          </IconButton>
          <input
            className={`search-box ${lightTheme ? "" : "dark"}`}
            placeholder="Search"
          />
        </div>

        <div className="ug-list">
          {fetchedUsers.map((users, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              className={`list-item ${lightTheme ? "" : "dark"}`}
              onClick={() => {
                api
                  .post(
                    "/chat/",
                    { userId: users._id },
                    {
                      headers: { Authorization: `Bearer ${user?.token}` },
                    }
                  )
                  .then((res) => {
                    console.log("Full API Response:", res);
                    console.log("Received Conversation Data:", res.data);
              
                    if (!res.data) {
                      console.error("API returned null or undefined. Check backend response.");
                      return;
                    }
              
                    setConversation(res.data);
                    updateSelectedConversation(res.data); // ✅ Store in AuthContext
                  })
                  .catch((error) => console.error("Chat access error:", error));
              }}
              
              
            >
              <p className="ug-con-icon">{users.name.charAt(0).toUpperCase()}</p>
              <p className="con-title">{users.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;
