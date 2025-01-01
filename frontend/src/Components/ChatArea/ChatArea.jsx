import React, { useEffect, useState } from "react";
import "./chatArea.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageOthers from "../MessageOthers/MessageOthers";
import MessageSelf from "../MessageSelf/MessageSelf";
import { useSelector } from "react-redux";
import { useAuthContext } from "../hooks/AuthProvider";
import { data, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";


const ENDPOINT = "http://localhost:5000"
let socket;
function ChatArea() {
  const { fetchedUsers, user } = useAuthContext();
  const [messageContent, setMessageContent] = useState("");
  const dyparams = useParams();
  const [chat_id, chat_user] = dyparams._id.split("&");
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const lightTheme = useSelector((store) => store.themeKey);
  const [socketConnectionStatus,setSocketConnectionStatus] = useState(false)
  const users = fetchedUsers[0];

  console.log("chat Area::", user);
  console.log("chat Area USers:::", users);
  console.log("Message Content:", messageContent);
  console.log("Chat ID:", chat_id);
  console.log("User Token:", user.token);
  if (!user) {
    return <div>Loading...</div>; // Show a loading state if user is not available
  }

  const sendMessage = () => {

   // if (!messageContent.trim()) return; // Prevent sending empty messages
    axios
    .post(
      "http://localhost:5000/message/",
      {
        content: messageContent, // Ensure this is expected by the backend
        chatId: chat_id, // Ensure this is expected by the backend
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure token is valid
        },
      }
    )
    .then((response) => {
      console.log("Message Sent", response.data);  // Check if the message data is correct
      
      const newMessage = {
        ...response.data,
        sender: { _id: user._id, name: user.name },
      };
  

      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageContent("");
  
      // Emit socket event only after successful message send
      socket.emit("new message", newMessage);
    })
    .catch((error) => {
      console.error("Error sending message", error);
    });
  };
  
  //fetch chat
  useEffect(() => {
    if (!user.token) return;
    axios
      .get(`http://localhost:5000/message/${chat_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(({ data }) => {
        setAllMessages(data);
        socket.emit("join chat", chat_id);
      })
      .catch((error) => console.error("Error fetching messages", error));
      setAllMessagesCopy(allMessages)
  }, []);

  //connect to socket
  // useEffect(() => {
  //   socket = io(ENDPOINT, { transports: ["websocket"] });
  
  //   socket.emit("setup", user);  // Ensure 'user' is defined
  //   socket.on("connect", () => {
  //     console.log("Socket connected");
  //     setSocketConnectionStatus(true);
  //   });
  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user]);
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



  // useEffect(()=>{
  //   socket = io(ENDPOINT)
  //   socket.emit("setup", userData)
  //   socket.on("connection", ()=>{
  //     setSocketConnectionStatus(!setSocketConnectionStatus)
  //   })
  // },[])

  // useEffect(() => {
  //   socket.on("message received", (newMessage) => {
  //     if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
  //       setAllMessages((prevMessages) => [...prevMessages, newMessage]);
  //     }
  //   });
  // }, [allMessagesCopy]);


  useEffect(() => {
    socket.on("message received", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    return () => {
      socket.off("message received"); // Clean up listener
    };
  }, []);
  return (
    <div className="chatArea-container">
      <div className={`ChatArea-Header ${lightTheme ? "" : "dark"}`}>
        <p className="con-icon">{users.name[0]}</p>
        <div className="header-text">
          <p className="con-title">{chat_user}</p>
          {/* <p className="con-titleStamp">Today</p> */}
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
            const sender = message.sender;
            const self_id = user._id;
            return sender._id === self_id ?(
              <MessageSelf props={message} key={index} />
            ) : (
              <MessageOthers props1={message} key={index} />
            )
          })}
      </div>
      <div className={`text-input-area ${lightTheme ? "" : "dark"}`}>
        <input
          placeholder="Type a Message"
          className={`search-box ${lightTheme ? "" : "dark"}`}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              sendMessage();
              setMessageContent("");
            }
          }}
        />
        <IconButton
          onClick={() => {
            sendMessage();
          }}
        >
          <SendIcon className={`icon ${lightTheme ? "" : "dark"}`} />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
