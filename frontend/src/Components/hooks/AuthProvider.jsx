import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import * as userService from "../Services/user.Services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [selectedConversation, setSelectedConversation] = useState(null);

  console.log("AuthProvider user::", user);
  console.log("AuthProvider fetchedUsers::", fetchedUsers);
 
  console.log("AuthProvider selectedConversation:: ",selectedConversation);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      setUser(storedUser); // ✅ Restore only valid user with a token
    }
    setLoading(false);
  }, [setUser]);

  const updateSelectedConversation = (conversation) => {
    if (!conversation) {
      console.warn("updateSelectedConversation received null, skipping update.");
      return;
    }
  
    console.log("Updating selectedConversation:", conversation);
    setSelectedConversation(conversation);
    localStorage.setItem("selectedConversation", JSON.stringify(conversation));
  };




  useEffect(() => {
    if (!user) return;
    const storedConversation = localStorage.getItem("selectedConversation");
  
    if (storedConversation) {
      try {
        setSelectedConversation(JSON.parse(storedConversation));
      } catch (error) {
        console.error("Error parsing stored conversation:", error);
        localStorage.removeItem("selectedConversation"); // Remove corrupted data
      }
    }
  }, []);


  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await userService.login(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login Successful");
    } catch (err) {
      toast.error(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  const getUsers = async () => {
    if (!user?.token) return;
    try {
      console.log("Fetching users...");
      const users = await userService.fetchAllUsers();
      setFetchedUsers(users || []);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };
  useEffect(() => {
    if (user?.token && fetchedUsers.length === 0) {
      getUsers();
    }
  }, [user,fetchedUsers]);

 
  const checkAuth = async () => {
    setLoading(true);
    try {
      const authenticatedUser = await userService.authCheck(); // Use an actual auth check endpoint
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth check failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // ✅ Update localStorage when the user state changes
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);


  const register = async (data) => {
    try {
      setLoading(true);
      const user = await userService.register(data);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Register Successful");
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

 

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("selectedConversation"); 
    toast.success("Logout Successful");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
       user,
        setUser,
       fetchedUsers,
        getUsers,
        login,
        register,
        logout,
        checkAuth,
        selectedConversation, // ✅ New state
        updateSelectedConversation, // ✅ Function to update state
        loading, // ✅ Pass loading state to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
