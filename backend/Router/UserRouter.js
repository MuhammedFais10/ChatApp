import express from "express";
import handler from "express-async-handler";
import userModel from "../models/userModel.js";
import { generateToken, protect } from "../config/JWT.config.js";

const router = express.Router();

router.get(
  "/fetchAllUsers",
  protect,
  handler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.user._id } });
    res.status(200).send(users);
  })
);

//Login
router.post(
  "/login",
  handler(async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    // Await the user document
    const user = await userModel.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
    //  if (!password ===  user.matchPassword(password) ){
    //   return res
    //   .status(401)
    //   .json({ message: "Email and Password are required" });
    //  }
  })
);

//SignUP
router.post(
  "/register",
  handler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All necessary input fields are not filled." });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res
        .status(401)
        .json({ message: "User with this email ID already exists." });
    }

    const userNameExist = await userModel.findOne({ name });
    if (userNameExist) {
      return res.status(402).json({ message: "Username is already taken." });
    }

    try {
      const newUser = await userModel.create({ name, email, password });
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser._id),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create the user." });
    }
  })
);

// router.get("/validate", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract the token

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Token missing, authorization failed" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
//     const user = await User.findById(decoded.id); // Fetch user details

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user); // Return valid user details
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// });

export default router;
