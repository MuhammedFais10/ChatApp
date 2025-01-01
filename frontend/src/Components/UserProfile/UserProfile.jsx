import React, { useState } from "react";
import { useAuthContext } from "../hooks/AuthProvider";
import "./userprofile.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import api,{API_BASE_URL} from "../../axiosConfig";  // ✅ Import API Base URL

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
      const response = await api.post(
        "/users/uploadProfilePic",
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

      setUser({ ...updatedUser }); // ✅ Ensure React re-renders
      localStorage.setItem("user", JSON.stringify(updatedUser)); 

      setShowFileInput(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile picture.");
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const response = await api.post(
        "/users/removeProfilePic",
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

      setUser({ ...updatedUser }); // ✅ Ensure React detects the change
      localStorage.setItem("user", JSON.stringify(updatedUser));

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
          src={`${API_BASE_URL}${user.profilePic}`} // ✅ Corrected
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
