import express from "express";
import handler from "express-async-handler";
import userModel from "../models/userModel.js";
import { protect } from "../config/JWT.config.js";
import Chat from "../models/chatModels.js";
import Message from "../models/messageModel.js";

const router = express.Router();

//allMessages
router.get(
  "/:chatId",
  protect,
  handler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name email")
        .populate("receiver")

        .populate("chat");
      res.json(messages);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

//sendMessages
router.post(
  "/",
  protect,
  handler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      // Create the message and wait for it to be saved
      let message = await Message.create(newMessage);

      // Now populate the necessary fields
      message = await message.populate("sender", "name");
      message = await message.populate("chat");
      message = await message.populate("receiver"); // Fixing typo from 'reciver' to 'receiver'

      // Populate chat users if necessary
      message = await userModel.populate(message, {
        path: "chat.users",
        select: "name email",
      });

      // Update the chat with the latest message
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

      // Send the populated message as a response
      res.json(message);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  })
);

export default router;
