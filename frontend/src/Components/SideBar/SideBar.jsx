import React, { useEffect, useState } from "react";
import "./sideBar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import ConversationItem from "../ConversationItem/ConversationITem";
import { useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Features/ThemeSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthContext } from "../hooks/AuthProvider";
import axios from "axios";

function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, selectedConversation } = useAuthContext();
  const lightTheme = useSelector((store) => store.themeKey);
  const { logout } = useAuthContext();

  const [conversation, setConversation] = useState([]);
  useEffect(() => {
    console.log("Token:", user?.token); // Check token value
    console.log("Selected Conversation IN SideBAr:", selectedConversation);
    if (!user?.token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    axios
      .get("http://localhost:5000/chat/", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log("Fetched Conversations:", response.data);
        setConversation(response.data);
      })
      .catch((error) => console.error("Error fetching chats:", error));
  }, [user]);
  console.log("Selected Conversation:", selectedConversation);
  console.log("Conversations:", conversation);
  return (
    <div className="sidebar-container">
      <div className={`sb-header ${lightTheme ? "" : "dark"}`}>
        <div>
          <IconButton>
            <AccountCircleIcon className={`icon ${lightTheme ? "" : "dark"}`} />
          </IconButton>
        </div>
        <div>
          <IconButton>
            <PersonAddAlt1Icon
              onClick={() => {
                navigate("users");
              }}
              className={`icon ${lightTheme ? "" : "dark"}`}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("groups");
            }}
          >
            <GroupAddIcon className={`icon ${lightTheme ? "" : "dark"}`} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("create-groups");
            }}
          >
            <AddCircleIcon className={`icon ${lightTheme ? "" : "dark"}`} />
          </IconButton>

          <IconButton
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {lightTheme ? (
              <NightlightRoundIcon
                className={`icon ${lightTheme ? "" : "dark"}`}
              />
            ) : (
              <LightModeIcon className={`icon ${lightTheme ? "" : "dark"}`} />
            )}
          </IconButton>
          <IconButton>
            <LogoutIcon
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className={`icon ${lightTheme ? "" : "dark"}`}
            />
          </IconButton>
        </div>
      </div>
      <div className={`sb-search ${lightTheme ? "" : "dark"}`}>
        <IconButton>
          <SearchIcon className={`icon ${lightTheme ? "" : "dark"}`} />
        </IconButton>
        <input
          className={`search-box ${lightTheme ? "" : "dark"}`}
          placeholder="Search"
        />
      </div>
      <div className={`sb-conversation ${lightTheme ? "" : "dark"}`}>
        {/* {conversation.map((conv, index) => (
          <ConversationITem key={index} conversation={conv} />
        ))} */}{" "}
        {selectedConversation && (
          <ConversationItem conversation={selectedConversation} />
        )}
      </div>
    </div>
  );
}

export default SideBar;
