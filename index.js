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

//handle cors and cookies
app.use(cookieParser());

// Updated CORS configuration for Railway deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from your frontend domain and localhost for development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default
      'http://localhost:5174', // Vite alternative port
      
    ];
    
    // Allow requests with no origin (mobile apps, etc.) OR if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Configure helmet to work with cookies
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Add middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    origin: req.headers.origin,
    cookies: req.cookies,
    userAgent: req.headers['user-agent']
  });
  next();
});

app.use("/auth", userRoute);
app.use("/todos", auth, todoRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

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
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });