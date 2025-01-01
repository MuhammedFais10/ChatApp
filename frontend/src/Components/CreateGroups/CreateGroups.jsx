import React from 'react'
import "./createGroup.css"

import { IconButton } from '@mui/material';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import { useSelector } from 'react-redux';

function CreateGroups() {
  const lightTheme= useSelector((store)=>store.themeKey)
  return (
    <div className={`createGroupe-container `}>
 <input className="search-box"  placeholder="Enter Group Name" />
 <IconButton>
  <DoneOutlineRoundedIcon />
 </IconButton>
    </div>
  )
}

export default CreateGroups