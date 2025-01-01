import { configureStore } from "@reduxjs/toolkit";
import  themeSliceReducer  from "./ThemeSlice";

export const store = configureStore({
  reducer: {
   themeKey: themeSliceReducer,
   
  },
});
