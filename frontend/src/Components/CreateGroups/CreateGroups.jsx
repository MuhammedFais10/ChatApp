import React, { useState } from "react";
import "./createGroup.css";
import { IconButton } from "@mui/material";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
//import { useSelector } from 'react-redux';
import { useAuthContext } from "../hooks/AuthProvider";

import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";

function CreateGroups() {
  const { fetchedUsers, user } = useAuthContext();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]); 
console.log("selectedUSers",selectedUsers);

  
  // const lightTheme= useSelector((store)=>store.themeKey)
  const nav = useNavigate();
  

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId); // Deselect user
      } else {
        return [...prevSelected, userId]; // Select user
      }
    });
  };

  const createGroup = () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Please enter a group name and select at least one user.");
      return;
    }

    const token = user?.token || localStorage.getItem("userToken");
    try {
      api.post(
        "/chat/createGroupChat",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers), // Fix: Convert array to JSON string

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Fix: Explicitly set content type
          },
        }
      )

      console.log("Group Created:");
      nav("/app/groups");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className={`createGroupe-container `}>
      <input
        className="search-box"
        placeholder="Enter Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />


        {/* Display list of users to select */}
        <div className="user-selection">
        {fetchedUsers.map((user) => (
          <div key={user._id} className="user-item">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)} // Check if the user is selected
              onChange={() => toggleUserSelection(user._id)} // Toggle selection
            />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
      <IconButton onClick={createGroup}>
        <DoneOutlineRoundedIcon />
      </IconButton>
    </div>
  );
}

export default CreateGroups;
