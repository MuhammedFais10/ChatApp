import React, { useEffect, useState } from "react";
import "./groups.css";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../Icons/live-chat.png";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { useAuthContext } from "../hooks/AuthProvider";

import api from "../../axiosConfig";

function Groups() {
  const {  user } = useAuthContext();
  const lightTheme = useSelector((store) => store.themeKey);
  const [groups, setGroups] = useState([]);

  useEffect(() => {

    const token = user?.token || localStorage.getItem("userToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }
    api
      .get("/chat/fetchGroups", {
        headers: {
          Authorization: `Bearer ${token }`,
        },
      })
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);
  
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
        className="list-container"
      >
        <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
          <img
            src={logo}
            style={{ height: "2rem", width: "2rem", marginleft: "10px" }}
          />
          <p className="ug-title">Available Groups</p>
        </div>
        <div className={`ug-search ${lightTheme ? "" : "dark"}`}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            className={`search-box ${lightTheme ? "" : "dark"}`}
            placeholder="Search"
          />
        </div>

        {/* Users List */}
        <div className="ug-list">
          {groups.map((group, index) => {
            const token = user?.token || localStorage.getItem("userToken");
          return (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1 }}
                className={`list-item ${lightTheme ? "" : "dark"}`}
                key={group._id}
                onClick={() => {
                  api
                    .put(
                      "/chat/addSelfToGroup",
                      {
                        chatId: group._id,
                        userId: user._id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token }`,
                        },
                      }
                    )
                    .then(() => {
                      console.log(`Joined group: ${group.chatName}`);
                    })
                    .catch((error) => {
                      console.error("Error joining group:", error);
                    });
                }}
              >
                <p className="ug-con-icon">{group.chatName[0]}</p>
                <p className="con-title">{group.chatName}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
