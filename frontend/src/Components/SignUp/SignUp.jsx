import React from "react";

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
        <p className="login-text"> Create your Account</p>
        <TextField id="standard-basic" label="Enter User Name" variant="outlined" />
        <TextField
          id="outlined-password-input"
          label="Enter Email Address"
          type="email"
          // autoComplete="current-password"
        />
           <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Button variant="outlined">SIGNUP</Button>
    <p>Already have an Account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

export default Login;
