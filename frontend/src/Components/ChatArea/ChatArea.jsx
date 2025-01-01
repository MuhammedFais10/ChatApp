import React, { useEffect, useState } from "react";
import "./chatArea.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageOthers from "../MessageOthers/MessageOthers";
import MessageSelf from "../MessageSelf/MessageSelf";
import { useSelector } from "react-redux";
import { useAuthContext } from "../hooks/AuthProvider";
import { useParams, Navigate } from "react-router-dom";
import io from "socket.io-client";

import api from "../../axiosConfig";

const ENDPOINT = "http://localhost:5000 "||"https://chatapp-tqwn.onrender.com";
let socket;

function ChatArea() {
  const { fetchedUsers, user } = useAuthContext();
  const [messageContent, setMessageContent] = useState("");
  const [conversation, setConversation] = useState([]);
  const [chatName, setChatName] = useState("Loading..."); // ✅ Fixed
  const { _id } = useParams();
  const chat_id = _id; 
  const [allMessages, setAllMessages] = useState([]);
  
  const lightTheme = useSelector((store) => store.themeKey);

  console.log("Chat ID being used:", chat_id);
  
  useEffect(() => {
    if (!user?.token) {
      console.error("No token found, user might not be authenticated");
      return <Navigate to="/login" replace />;
    }

    // ✅ Fetch all conversations
    api
      .get("/chat/", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log("Fetched Conversations:", response.data);
        setConversation(response.data);

        // ✅ Find the correct chat by `chat_id`
        const chat = response.data.find((c) => c._id === chat_id);
        if (chat) {
          setChatName(chat.isGroupChat ? chat.chatName : chat.users.find((u) => u._id !== user._id)?.name || "Unknown");
        } else {
          setChatName("Chat Not Found");
        }
      })
      .catch((error) => console.error("Error fetching chats:", error));
  }, [chat_id, user]);



  useEffect(() => {
    if (!user.token) return;
    
    // ✅ Fetch Messages
    api
      .get(`/message/${chat_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(({ data }) => {
        console.log("Fetched Messages:", data);  // ✅ Debugging log
        setAllMessages(data || []);  // ✅ Ensure data is set
        socket.emit("join chat", chat_id);
      })
      .catch((error) => console.error("Error fetching chat messages:", error));
  }, [chat_id, user.token]);

useEffect(() => {
    if (!user.token) return;
    
    // ✅ Fetch Messages
    api
      .get(`/message/${chat_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(({ data }) => {
        console.log("Fetched Messages:", data);  // ✅ Debugging log
        setAllMessages(data || []);  // ✅ Ensure data is set
        socket.emit("join chat", chat_id);
      })
      .catch((error) => console.error("Error fetching chat messages:", error));
  }, [chat_id, user.token]);


  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  const sendMessage = () => {
    api
      .post(
        "/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log("Message Sent", response.data);
        const newMessage = {
          ...response.data,
          sender: { _id: user._id, name: user.name },
        };

        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageContent("");

        socket.emit("new message", newMessage);
      })
      .catch((error) => {
        console.error("Error sending message", error);
      });
  };

  return (
    <div className="chatArea-container">
      <div className={`ChatArea-Header ${lightTheme ? "" : "dark"}`}>
        <p className="con-icon">{chatName?.[0] || "?"}</p>
        <div className="header-text">
          <p className="con-title">{chatName || "Chat"}</p>  {/* ✅ Chat name here */}
        </div>
        <IconButton>
          <DeleteIcon className={`icon ${lightTheme ? "" : "dark"}`} />
        </IconButton>
      </div>
      <div className={`messages-container ${lightTheme ? "" : "dark"}`}>
        {allMessages
          .slice(0)
          .reverse()
          .map((message, index) => {
            console.log("Rendering Message:", message); 
            const sender = message.sender;
            return sender._id === user._id ? (
              <MessageSelf props={message} key={index} />
            ) : (
              <MessageOthers props1={message} key={index} />
            );
          })}
      </div>
      <div className={`text-input-area ${lightTheme ? "" : "dark"}`}>
        <input
          placeholder="Type a Message"
          className={`search-box ${lightTheme ? "" : "dark"}`}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
              setMessageContent("");
            }
          }}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon className={`icon ${lightTheme ? "" : "dark"}`} />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
