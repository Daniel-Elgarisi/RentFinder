require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

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

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("Received token:", token);

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
  console.log(
    `User connected with socket ID: ${socket.id}, user ID: ${
      socket.user ? socket.user.userId : "unknown"
    }`
  );

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    io.to(roomId).emit(
      "notification",
      `User ${socket.id} has joined the room.`
    );
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    console.log(
      `Message received in room ${roomId} from user ${socket.id}: ${message}`
    );
    io.to(roomId).emit("message", {
      text: message,
      sender: socket.user.firstName,
      timestamp: new Date().toISOString(),
    });
    console.log(`Message from ${socket.user.firstName}: ${message}`);
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

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});
