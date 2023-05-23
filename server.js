require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const userRoute = require("./routes/user.route.js");
const reviewRoute = require("./routes/review.route.js");
const orderRoute = require("./routes/order.route.js");
const messageRoute = require("./routes/message.route.js");
const offerRoute = require("./routes/offer.route.js");
const conversationRoute = require("./routes/conversation.route.js");
const cookieParser = require("cookie-parser");
const buyerOffersRoute = require("./routes/buyerOffers.js");
const sellerBidsRoute = require("./routes/sellerBids.js");

// const authRoute = require("./routes/auth.route.js");

//connect db
mongoose.set("strictQuery", true);

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use("/api/buyerOffers", buyerOffersRoute);
app.use("/api/sellerBids", sellerBidsRoute);
app.use("/api/users", userRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoute);
app.use("/api/messages", messageRoute);
app.use("/api/offers", offerRoute);
app.use("/api/conversations", conversationRoute);

//Error handler (should be last piece of middleare)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//   console.log(`User connected`, socket.id);

//   socket.on("join_room", (data)=>{
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room ${data}`);
//   })

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   })
//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });

// io.on("connection", (socket) => {
//   console.log("A client connected");

//   // Emit the current count of connected clients to all clients
//   io.emit("userCount", io.engine.clientsCount);

//   // Listen for client disconnections
//   socket.on("disconnect", () => {
//     console.log("A client disconnected");

//     // Emit the updated count of connected clients to all clients
//     io.emit("userCount", io.engine.clientsCount);
//   });
// });

const connectedBrowsers = new Map();

io.on("connection", (socket) => {
  console.log("A client connected");

  // Get the user agent string from the socket handshake
  const userAgent = socket.handshake.headers["user-agent"];

  // Store the connection timestamp for the client
  connectedBrowsers.set(userAgent, Date.now());

  // Emit the updated count of connected unique browsers to all clients
  io.emit("userCount", connectedBrowsers.size);

  // Listen for client disconnections
  socket.on("disconnect", () => {
    console.log("A client disconnected");

    // Retrieve the connection time for the client
    const connectionTime = connectedBrowsers.get(userAgent);

    // Remove the user agent from the map of connected browsers
    connectedBrowsers.delete(userAgent);

    // Emit the updated count of connected unique browsers to all clients
    io.emit("userCount", connectedBrowsers.size);

    // Calculate the duration of the online session
    const onlineDuration = Math.round(
      (Date.now() - connectionTime) / (1000 * 60)
    ); // in minutes
    io.emit("lastSeen", onlineDuration);
    console.log(`Client was online for ${onlineDuration} minutes ago.`);
  });
});

io.on("connection", (socket) => {
  // Listen for bid event
  socket.on("placeBid", (data) => {
    const { userId, bidAmount, buyerOfferId } = data;
    // Example logic to process the bid
    console.log(`Received bid from user ${userId}: $${bidAmount} for ${buyerOfferId}`);
    // Send notification to another client
    const message = `New bid of $${bidAmount} from user ${userId}`;
    const targetUserId = "123"; // ID of the account to receive the notification
    sendNotification(targetUserId, message);
  });
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
