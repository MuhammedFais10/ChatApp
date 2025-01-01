import React from "react";
import "./conversation.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthProvider";

function ConversationItem({ conversation }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
 
console.log("CONVERSTIO.jsx",conversation);

  
  if (!conversation || !user ) {
    console.warn("Conversation or user data is missing", { conversation, user });
    return null; // Prevent rendering if missing data
  }

  // Determine chat name
  let chatName = conversation.isGroupChat
    ? conversation.chatName
    : conversation.users?.find((u) => u._id !== user._id)?.name || "Unknown";
console.log("Chatname",chatName);

  return (
    <div
    className="conversation-container"
    onClick={() => navigate(`/chat/${conversation._id}`)}

  >
    <p className="con-icon">{conversation.chatName?.[0] || "?"}</p>
    <p className="con-title">{chatName}</p>
    <p className="con-lastMessage">
      {conversation.latestMessage?.content || "No previous messages, Click here to start a new Chat"}
    </p>
  </div>
  );
}

export default ConversationItem;
