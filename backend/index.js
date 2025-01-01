import express from "express";
import dotenv from "dotenv";
import { dbconnect } from "./config/Database.connection.js";
import userRouter from "./Router/UserRouter.js";
import cors from "cors";
import ChatRouter from "./Router/ChatRouter.js";
import MessageRouter from "./Router/MessageRouter.js";
import { Server } from "socket.io";

const app = express();
dbconnect();
dotenv.config();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Helksdhksj");
});

app.use("/users", userRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

const server = app.listen(port, () => {
  console.log(`server connected on ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

// const server = app.listen(port, () => {
//   console.log(`server connected ${port}`);
// });

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
//   pingTimeout: 60000,
// });

io.on("connection", (socket) => {
  // socket.on("setup", (user) => {
  //   socket.join(user.data._id);
  //   socket.emit("connected");
  // });

  socket.on("setup", (user) => {
    console.log("User received in setup:", user);
    if (!user || !user._id) {
      console.error("Invalid user data received:", user);
      return;
    }
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageStatus) => {
    let chat = newMessageStatus.chat;
    if (!chat?.users) {
      return console.log("chat.users not defined ");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;

      socket.in(user._id).emit("message received", newMessageStatus);
    });
  });
});
