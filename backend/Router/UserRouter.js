import express from "express";
import handler from "express-async-handler";
import userModel from "../models/userModel.js";

const router = express.Router();

router.post(
  "/login",
  handler(async (req, res) => {
    const { email, password } = req.body;
  })
);

router.post(
  "/register",
  handler(async (req, res) => {
    const { name, email, password } = req.body;
    // to check for all the fields
    if (!name || !email || !password) {
      res.send(400);
      throw Error("All necessary input are not filled");
    }
    // user Already Exist
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(400);
      throw Error("User Already Exist");
    }
    // user name already taken
    const userNameExist = await userModel.findOne({ name });
    if (userNameExist) {
      res.status(400);
      throw Error("User Name is Already Exist");
    }
    const newUser = await userModel.create({ name, email, password });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        isAdminUser: newUser.isAdminUSer,
      });
    } else {
      res.status(500);
      throw new Error("Failed to create the user");
    }
  })
);

export default router;
