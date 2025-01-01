import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../Services/user.Services";
import * as userService from "../Services/user.Services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  console.log("AuthProvider user::", user);
  console.log("selectconv::", selectedConversation);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      if (!user) return;
      try {
        const users = await fetchAllUsers();
        setFetchedUsers(users || []);
      } catch (error) {
        toast.error("Failed to load users");
      }
    };
    getUsers();
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // ✅ Show backdrop
      try {
        const userData = await fetchAllUsers();
        setUser(userData);
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false); // ✅ Hide backdrop
      }
    };

    checkAuth();
  }, []);

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

  const login = async (email, password) => {
    try {
      setLoading(true);
      const user = await userService.login(email, password);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login Successful");
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
        login,
        register,
        logout,
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
