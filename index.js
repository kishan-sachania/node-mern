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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//support json formate
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handle cors and cookies
app.use(cookieParser());

// Configure helmet to work with cookies
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use("/auth", userRoute);
app.use("/todos", auth, todoRoute);



//mongo URL
const dbURL =
  "mongodb+srv://admin:Test%40123@cluster0.g0fel.mongodb.net/Node_demo?retryWrites=true&w=majority&appName=Cluster0";

//connect mongoDB
mongoose
  .connect(dbURL)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
