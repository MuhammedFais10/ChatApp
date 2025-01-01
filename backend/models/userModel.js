import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timeStamp: true,
  }
);

const User = mongoose.model("User", userModel);

export default User;
