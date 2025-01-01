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
import api from "../../axiosConfig";

function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lightTheme = useSelector((store) => store.themeKey);
  const { user, logout } = useAuthContext();

  const [conversation, setConversation] = useState([]);


  

  useEffect(() => {
    if (!user?.token) {
      console.error("No token found");
      return;
    }
  
    api.get("/chat/", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    .then((response) => {
      setConversation(response.data);
    })
    .catch((error) => console.error("Error fetching chats:", error));
  }, [user]);
  

  // console.log("Conversations:", conversation);
  return (
    <div className="sidebar-container">
      <div className={`sb-header ${lightTheme ? "" : "dark"}`}>
        <div>
          <IconButton>
            <AccountCircleIcon
              onClick={() => {
                navigate("/userprofile");
              }}
            className={`icon ${lightTheme ? "" : "dark"}`} />
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
 
  {conversation.length > 0 ? (
    conversation.map((conv, index) => (
      <ConversationItem key={index} conversation={conv} />
    ))
  ) : (
    <p>No conversations available</p>
  )}
</div>
    </div>
  );
}

export default SideBar;
