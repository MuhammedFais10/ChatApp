import React, { useState } from "react";
import "./login.css"
import logo from "../../Icons/live-chat.png"
import { Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import {Link, useNavigate,useSearchParams} from "react-router-dom"
//import { login } from "../Services/user.Services";
import { useAuthContext } from "../hooks/AuthProvider";


function Login() {

  const [data , setData] = useState({
    email:"",
    password:"",
  })
  console.log(data);
    const [error, setError] = useState("");
  
  const {loading, login} = useAuthContext()

  const [searchParams] = useSearchParams(); // ✅ Extract URL params
  const returnUrl = searchParams.get("returnUrl") || "/"; // ✅ Default if not present

const navigate= useNavigate()

const handleChange = (e) => {
  const { name, value } = e.target;
  setData({ ...data, [name]: value }); 
};

 const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
    
      await  login(data.email, data.password); // ✅ Pass email and password separately
      navigate(returnUrl); // ✅ Redirect to `returnUrl` or default
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials");
    }

    // finally {
    //   setLoading(false); // Ensure loading state is turned off
    // }

  };

  return (
    <div className="login-container">
       <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading} // Backdrop visibility is tied to `loading` state
            >
              <CircularProgress color="inherit" />
            </Backdrop>
      <div className= "image-container" >
        <img src={logo} alt="" className="image-logo"/>
      </div>
      <div className="login-box">
        <p className="login-text">Login to your Account</p>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        <TextField
        onChange={handleChange}
        id="standard-basic" label="Enter User Email" variant="outlined" 
        type="email" name="email" />
        <TextField
         onChange={handleChange}
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          name="password"
        />
        <Button onClick={handleSubmit} variant="outlined">LOGIN</Button>
    <p> Don't have an Account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
