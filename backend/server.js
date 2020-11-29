const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");
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

// io.use((socket, next) => {
//   // Verificaitn of ttoken
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(
//       socket.handshake.query.token,
//       keys.jwtSecret,
//       function (err, decoded) {
//         if (err) return next(new Error("Authentication error"));
//         socket.decoded.user = decoded.user;
//         next();
//       }
//     );
//   } else {
//     next(new Error("Authentication error"));
//   }
// });
io.on("connection", (socket) => {
  console.log("Hey i am socket.io and it seems that i am connected");

  socket.on("joined", ({ user, name, room }, callback) => {
    socket.join(room);

    socket.emit("message", {
      user,
      name,
      text: `${name}, welcome to room ${room}.`,
    });

    socket.broadcast
      .to(room)
      .emit("message", { user, name, text: `${name} has joined!` });

    // io.to(user.room).emit("roomData", {
    //   room: user.room,
    //   users: getUsersInRoom(user.room),
    // });

    // callback();
  });

  socket.on(
    "sendMessage",
    async ({ user, name, text, room, roomId }, callback) => {
      io.to(room).emit("message", { user, name, text });
      try {
        let chatRoom = await Room.findOne({
          _id: roomId,
        });

        chatRoom.chats.push({ user, name, text });

        await chatRoom.save();
      } catch (error) {
        callback(error);
      }
    }
  );

  // socket.join("joined", (callback) => {});

  socket.on("disconnect", () => {
    console.log("User have left");
  });
});
