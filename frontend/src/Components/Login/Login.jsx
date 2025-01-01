import React from "react";
import "./login.css"
import logo from "../../Icons/live-chat.png"
import { Button, TextField } from "@mui/material";
import {Link} from "react-router-dom"

function Login() {
 
  return (
    <div className="login-container">
      <div className= "image-container" >
        <img src={logo} alt="" className="image-logo"/>
      </div>
      <div className="login-box">
        <p className="login-text">Login to your Account</p>
        <TextField id="standard-basic" label="Enter User Name" variant="outlined" />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Button variant="outlined">LOGIN</Button>
    <p> Don't have an Account? <Link to="signUp">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
