import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    profilePic: { type: String,
       default: "/uploads/default.png" },
  },
  {
    timeStamp: true,
  }
);
// Password hashing before saving the user
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userModel);

export default User;
