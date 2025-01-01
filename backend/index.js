import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { dbconnect } from "./config/Database.connection.js";
import userRouter from "./Router/UserRouter.js";
//import cors from "cors";
import ChatRouter from "./Router/ChatRouter.js";
import MessageRouter from "./Router/MessageRouter.js";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";
const app = express();
dbconnect();

const port = process.env.PORT || 5000;

// middlewares

const allowedOrigins = [
  "http://localhost:5173", // Local frontend (for development)
  "https://chatapp-7b70.onrender.com", // Production frontend
];

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);
app.use(express.json()); // ✅ This allows parsing JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Allows form data parsing
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicFolder = path.join(__dirname, "public");
app.use(express.static(publicFolder));

app.use("/uploads", express.static("uploads"));
app.use("/users", userRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

// Handle SPA routing for the frontend
app.get("*", (req, res) => {
  const indexFilePath = path.join(publicFolder, "index.html");
  res.sendFile(indexFilePath);
});

const server = app.listen(port, () => {
  console.log(`server connected on ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    console.log("User received in setup:", user);
    if (!user || typeof user !== "object" || !user._id) {
      console.error("Invalid user data received:", user);
      return;
    }
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // socket.on("new message", (newMessageStatus) => {
  //   let chat = newMessageStatus.chat;
  //   if (!chat?.users) {
  //     return console.log("chat.users not defined ");
  //   }

  //   chat.users.forEach((user) => {
  //     if (user._id == newMessageStatus.sender._id) return;

  //     socket.in(user._id).emit("message received", newMessageStatus);
  //   });
  // });
  socket.on("new message", (newMessageStatus) => {
    if (!newMessageStatus?.chat?.users) {
      return console.log("Invalid message received: ", newMessageStatus);
    }

    newMessageStatus.chat.users.forEach((user) => {
      if (user._id === newMessageStatus.sender._id) return;

      if (io.sockets.adapter.rooms.get(user._id)) {
        socket.to(user._id).emit("message received", newMessageStatus);
      } else {
        console.log(`User ${user._id} is offline, consider storing message`);
      }
    });
  });
});
