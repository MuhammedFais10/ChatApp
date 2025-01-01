import React from "react";
import "./groups.css";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../Icons/live-chat.png";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";

function Groups() {
  const lightTheme = useSelector((store) => store.themeKey);

  return (
    <AnimatePresence>
      <motion.div
      initial={{opacity:0,scale:0}}
      animate={{opacity:1,scale:1}}
      exit={{opacity:0,scale:0}}
      transition={{
        ease:"anticipate",
        duration:"0.3",
      }}
      className="list-container">
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            className={`list-tem ${lightTheme ? "" : "dark"}`}
          >
            <p className="ug-con-icon">T</p>
            <p className="con-title">Test groups</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
