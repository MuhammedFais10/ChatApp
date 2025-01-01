import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
//import { fetchAllUsers } from "../Services/user.Services";
import * as userService from "../Services/user.Services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state


  console.log("AuthProvider user::", user);
  console.log("selectconv::", selectedConversation);
 console.log("AuthProvider fetchedUsers::", fetchedUsers);
 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      setUser(storedUser); // ✅ Restore only valid user with a token
    }
    setLoading(false);
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
    if (user?.token) {
      getUsers();
    }
  }, [user]);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

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
    toast.success("Logout Successful");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
       fetchedUsers,
        getUsers,
        login,
        register,
        logout,
        checkAuth,
        selectedConversation,
        setSelectedConversation,
        loading, // ✅ Pass loading state to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
