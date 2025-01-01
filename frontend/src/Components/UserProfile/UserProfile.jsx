import React, { useState } from "react";
import { useAuthContext } from "../hooks/AuthProvider";
import "./userprofile.css";
import { motion } from "framer-motion"; // ✅ Fixed import
import axios from "axios";
import { useSelector } from "react-redux";

function UserProfile() {
  const { user, setUser } = useAuthContext();
  const [file, setFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(!user?.profilePic);
  const lightTheme = useSelector((store) => store.themeKey);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/users/uploadProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Profile picture uploaded successfully!");
      console.log("Updated Profile Data:", response.data);

      const updatedUser = {
        ...user,
        profilePic: response.data.profilePic,
      };

      setUser(updatedUser); // ✅ Update state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Save updated user in localStorage

      setShowFileInput(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile picture.");
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/removeProfilePic",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Profile picture removed successfully!");

      const updatedUser = {
        ...user,
        profilePic: response.data.profilePic,
      };

      setUser(updatedUser); // ✅ Update state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Save updated user

    } catch (error) {
      console.error("Failed to remove profile picture:", error);
      alert("Failed to remove profile picture.");
    }
  };

  return (
    <div className="user-profile-container">
      <h1 className="con-title">{user.name}</h1>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1 }}
        className={`list-item ${lightTheme ? "" : "dark"}`}
      >
        <img
          src={`http://localhost:5000${user.profilePic}`}
          alt="Profile"
          className="profile-image"
        />
      </motion.div>

      {showFileInput ? (
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            Choose File
          </label>
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
          <button onClick={handleRemoveProfilePic} className="remove-button">
          Remove Profile Picture
        </button>
        </div>
      ) : (
        <button onClick={() => setShowFileInput(true)} className="change-button">
          Change Profile Picture
        </button>

      )}
    </div>
  );
}

export default UserProfile;
