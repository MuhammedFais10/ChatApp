import express from "express";
import dotenv from "dotenv";
import { dbconnect } from "./config/Database.connection.js";
import userRouter from "./Router/UserRouter.js";

const app = express();
dbconnect();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Helksdhksj");
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`server connected ${port}`);
});
