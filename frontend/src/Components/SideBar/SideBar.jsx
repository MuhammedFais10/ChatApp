import React from "react";
import "./sideBar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SearchIcon from "@mui/icons-material/Search";
import ConversationITem from "../ConversationItem/ConversationITem";
import { useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Features/ThemeSlice";

function SideBar({ props, onSelectChat }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((store) => store.themeKey);

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
        {props.map((conversation, index) => (
          <ConversationITem
            key={index}
            props={conversation}
            onClick={() => onSelectChat(conversation)}
          />
        ))}
      </div>
      </div>
 
  );
}

export default SideBar;
