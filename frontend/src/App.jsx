import React from "react";
import "./App.css";
import MainContainer from "./Components/MainContainer/MainContainer";
import Login from "./Components/Login/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import Welcome from "./Components/WelcomeBoard/Welcome";
import ChatArea from "./Components/ChatArea/ChatArea";
import CreateGroups from "./Components/CreateGroups/CreateGroups";
import Users from "./Components/Users/Users";
import Groups from "./Components/Groups/Groups";
//import User_Groups from "./Components/User_Groups/User_Groups";
import SignUp from "./Components/SignUp/SignUp";
import { useAuthContext } from "./Components/hooks/AuthProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import UserProfile from "./Components/UserProfile/UserProfile";
function App() {
 
  const { user,loading } = useAuthContext();

  const ProtectedRoute = ({ children }) => {
    
  
    if (loading) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };

  return (
    <>
     {/* Backdrop for loading state */}
     <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className="App"
        style={{ height: "100vh", width: "100vw", display: "flex" }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainContainer />
              </ProtectedRoute>
            }
          >
            {/* <Route path="/" element={<Welcome />} /> */}
            <Route path="/userprofile" element={<UserProfile/>} />
            <Route index element={<Welcome />} />
            <Route path="/chat/:_id" element={<ChatArea />} />
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
