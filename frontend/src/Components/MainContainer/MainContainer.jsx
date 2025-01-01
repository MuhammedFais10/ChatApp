import React from "react";
import "./mainContainer.css";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";



function MainContainer() {

  return (
    
    <div className="main-container">
           <SideBar 
      
      /> 

      <Outlet />
    </div>
  );
}

export default MainContainer;
