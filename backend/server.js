const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const connectDB = require("./config/db");
const User = require("./models/User");
const app = express();

// Implementing cors
app.use(cors());

// connect to database
connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./routes/signup")(app);
require("./routes/login")(app);
require("./routes/profile")(app);
require("./routes/room")(app);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Listen to Port to 3000");
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Hey i am socket.io and it seems that i am connected");

  socket.on("joined", ({ name, room }, callback) => {
    socket.join(room);

    socket.emit("message", {
      user: "admin",
      text: `${name}, welcome to room ${room}.`,
    });

    socket.broadcast
      .to(room)
      .emit("message", { user: "admin", text: `${name} has joined!` });

    // io.to(user.room).emit("roomData", {
    //   room: user.room,
    //   users: getUsersInRoom(user.room),
    // });

    // callback();
  });

  socket.on("sendMessage", ({ user, name, text, room }, callback) => {
    io.to(room).emit("message", { name, message: text });

    // callback();
  });

  // socket.join("joined", (callback) => {});

  socket.on("disconnect", () => {
    console.log("User have left");
  });
});
