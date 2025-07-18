require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const todoRoute = require("./routes/todo-route");
const userRoute = require("./routes/user-routes");
const { auth } = require("./controllers/UserController/userController");
const cookieParser = require("cookie-parser");
const app = express();

//support json formate
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handle cors
app.use(cookieParser());
app.use(
  cors({
    origin: (o, cb) => cb(null, o),
    credentials: true,
  })
);
app.use(helmet());

app.use("/auth", userRoute);
app.use("/todos", auth, todoRoute);

//mongo URL
const dbURL =
  "mongodb+srv://admin:Test%40123@cluster0.g0fel.mongodb.net/Node_demo?retryWrites=true&w=majority&appName=Cluster0";

//connect mongoDB
mongoose
  .connect(dbURL)
  .then(() => {
    app.listen(3000, () => {
      console.log("server listening on 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
