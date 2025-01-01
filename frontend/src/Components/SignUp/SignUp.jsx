import React, { useState } from "react";
//import { register } from "../Services/user.Services";
import logo from "../../Icons/live-chat.png";
import { Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthProvider";

function SignUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
 
  const {loading, register } = useAuthContext();

  const navigate = useNavigate();
  console.log(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    setError("");
    try {
      await register(data); // ✅ Pass data to register function
      navigate("/"); // ✅ Redirect after successful signup
      setLoading(false);
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed");
    }
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

      <div className="image-container">
        <img src={logo} alt="" className="image-logo" />
      </div>
      <div className="login-box">
        <p className="login-text"> Create your Account</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Display error message */}
        <TextField
          name="name"
          type="text"
          onChange={handleChange}
          id="standard-basic"
          label="Enter User Name"
          variant="outlined"
        />
        <TextField
          name="email"
          onChange={handleChange}
          id="outlined-Email-input"
          label="Enter Email Address"
          type="email"
          // autoComplete="current-password"
        />
        <TextField
          onChange={handleChange}
          id="outlined-password-input"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <Button type="submit" onClick={handleSubmit} variant="outlined">
          SIGNUP
        </Button>
        <p>
          Already have an Account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
