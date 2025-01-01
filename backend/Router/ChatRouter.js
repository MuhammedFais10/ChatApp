import express from "express";
import handler from "express-async-handler";
import userModel from "../models/userModel.js";
import { protect } from "../config/JWT.config.js";
import Chat from "../models/chatModels.js";

const router = express.Router();

//accessChat
// router.post(
//   "/",
//   protect,
//   handler(async (req, res) => {
//     const { userId } = req.body;

//     if (!userId) {
//       console.log("UserId params not sent with request");
//       return res.sendStatus(400);
//     }

//     var isChat = await Chat.find({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: req.user._id } } },
//         { users: { $elemMatch: { $eq: userId } } },
//       ],
//     })
//       .populate("users", "-password")
//       .populate("latestMessage");

//     isChat = await userModel.populate(isChat, {
//       path: "latestMessage.sender",
//       select: "name email",
//     });
//     if (isChat.length > 0) {
//       res.send(isChat[0]);
//     } else {
//       var chatData = {
//         chatName: "sender ",
//          isGroupChat: "false",
//        // isGroupChat: false,
//         users: [req.user._id, userId],
//       };
//       try {
//         // const createdChat = await Chat.create(chatData);
//         // console.log("Created chat:", createdChat);
//         const FullChat = await Chat.findOne({ _id: chatData._id }).populate(
//           "users",
//           "-password"
//         );
//         res.status(200).json(FullChat);
//         console.log(chatData);
//       } catch (err) {
//         res.status(400);
//         throw new Error(err.message);
//       }
//     }
//   })
// );
router.post(
  "/",
  protect,
  handler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId params not sent with request");
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Checking for existing chat between:", req.user._id, userId);

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      console.log("Existing chat found:", isChat[0]);
      return res.status(200).json(isChat[0]);
    } else {
      console.log("No existing chat. Creating a new one...");

      const chatData = {
        chatName: "sender",
        isGroupChat: false, // Fix: Remove quotes
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        console.log("Created chat:", createdChat);

        const FullChat = await Chat.findById(createdChat._id).populate(
          "users",
          "-password"
        );

        if (!FullChat) {
          console.error("Error: FullChat is null");
          return res
            .status(500)
            .json({ error: "Failed to fetch created chat" });
        }

        console.log("Returning chat:", FullChat);
        return res.status(200).json(FullChat);
      } catch (err) {
        console.error("Error creating chat:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  })
);

// fetchChat
router.get(
  "/",
  protect,
  handler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updateAt: -1 })
        .then(async (results) => {
          results = await userModel.populate(results, {
            path: "latestMessage.sender",
            select: "name email",
          });
          res.status(200).send(results);
        });
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

router.get(
  "/fetchGroups",
  protect,
  handler(async (req, res) => {
    try {
      const allGroups = await Chat.where("isGroupChat")
        .equals(true)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).send(allGroups);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

// router.post(
//   "/createGroupChat",
//   protect,
//   handler(async (req, res) => {
//     if (!req.body.users || !req.body.name) {
//       return res.status(400).send({ message: "Data is insufficient" });
//     }
//     var users = JSON.parse(req.body.users);
//     console.log("chatRouter/CreateGroup : ", req);
//     users.push(req.user);

//     try {
//       const groupChat = await Chat.create({
//         chatName: req.body.name,
//         users: users,
//         isGroupChat: true,
//         groupAdmin: req.user,
//       });
//       const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");
//       res.status(200).json(fullGroupChat);
//     } catch (err) {
//       res.status(400);
//       throw new Error(err.message);
//     }
//   })
// );

router.post(
  "/createGroupChat",
  protect,
  handler(async (req, res) => {
    console.log("Request Body:", req.body); // Debugging

    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Data is insufficient" });
    }

    var users = JSON.parse(req.body.users);
    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(fullGroupChat);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  })
);

router.put(
  "/groupExit",
  protect,
  handler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Check if the requester is in the group
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } }, // Remove userId from users array
      { new: true } // Return the updated document
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  })
);

router.put(
  "/addSelfToGroup",
  protect,
  handler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(400);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  })
);

export default router;
