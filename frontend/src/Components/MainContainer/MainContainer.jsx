import React from "react";
import "./mainContainer.css";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";



function MainContainer() {
// const {fetchedUsers}=useAuthContext()
// const [conv, setConv] = useState([]);




// useEffect(() => {
//   if (fetchedUsers && fetchedUsers.length > 0) {
//     const conversations = fetchedUsers.map((user) => ({
//       name: user.name,
//       lastMessage: "Last Message",
//       timeStamp: "today",
//     }));
//     setConv(conversations);
//     setSelectedChat(conversations[0]); // Default to the first chat
//   }
// }, [fetchedUsers]);

//   // const [conv, setConv] = useState([
//   //   // {
      
//   //   //   lastMessage: "Last Message",
//   //   //   timeStamp: "today",
//   //   // },
//   //   // {
   
//   //   //   lastMessage: "Last Message",
//   //   //   timeStamp: "today",
//   //   // },
//   //   // {
    
//   //   //   lastMessage: "Last Message",
//   //   //   timeStamp: "today",
//   //   // },
//   //   userData.map((user) => ({
//   //     name: user.name,
//   //     lastMessage: "Last Message",
//   //     timeStamp: "today",
//   //   }))
//   // ]);

//   const [selectedChat, setSelectedChat] = useState(conv[0]); // Default to the first chat

  return (
    
    <div className="main-container">
           <SideBar 
      
      /> 

      <Outlet />
    </div>
  );
}

export default MainContainer;
