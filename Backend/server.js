require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

// Middleware for JWT verification
io.use((socket, next) => {
  // Get the token from the query parameters
  const token = socket.handshake.auth.token;

  // Log for debugging
  console.log("Received token:", token);

  // Verify the token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Error:", err);
        return next(new Error("Authentication error"));
      }
      console.log("JWT Decoded:", decoded);
      socket.user = decoded;
      return next();
    });
  } else {
    return next(new Error("Authentication error: No token provided"));
  }
});

// Event handlers
io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("message", {
      text: message,
      sender: socket.id,
      timestamp: new Date().toISOString(),
    });
    console.log(`Message sent to room: ${roomId}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Error handling for debugging
io.on("error", (error) => {
  console.error("Socket.IO server error:", error);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/Photos", express.static(path.join(__dirname, "Photos")));
app.use("/Contracts", express.static(path.join(__dirname, "Contracts")));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/apartments", apartmentRoutes);

// Server listen
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
