const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");
const Profile = require("./models/Profile");
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

  socket.on("joined", ({ name }, callback) => {
    console.log(`my name ${name}, my socketId:${socket.id}`);
    callback({ wlcmsg: `Welcome ${name} to LavChatApp` });
  });

  socket.on("leaveRoom", ({ user, name, room }) => {
    socket.broadcast
      .to(room)
      .emit("message", { user, name, text: `${name} has left the room!` });

    socket.leave(room);
  });

  socket.on("joinedRoom", ({ user, name, room }, callback) => {
    socket.join(room);

    socket.emit("message", {
      user,
      name,
      text: `${name}, welcome to room ${room}.`,
    });

    socket.broadcast
      .to(room)
      .emit("message", { user, name, text: `${name} has joined!` });
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

  socket.on(
    "createGrpChatRoom",
    async ({ user, roomName, roomMembers }, callback) => {
      //  Creating Room
      console.log(roomMembers);
      console.log(roomName);
      try {
        let room = new Room({
          user,
          roomName,
          roomMembers,
        });
        await room.save();

        roomMembers.forEach(async (memberDetail) => {
          let roomId = room._id;
          try {
            let memberProfile = await Profile.findOne({
              user: memberDetail.user,
            });

            memberProfile.myRooms.push({ roomId, roomName });

            await memberProfile.save();

            io.to(memberProfile.socketId).emit("addNewGrpChatRoom", { room });
            console.log(
              `event createdGrpChatRoom emmited to ${memberProfile.name}`
            );
            console.log(memberProfile.socketId);
          } catch (err) {
            // callback(err);
            console.error(err.message);
          }
        });
      } catch (err) {
        // callback(err);
        console.error(err.message);
      }
    }
  );

  socket.on("getRoomById", async ({ roomId }, callback) => {
    try {
      const room = await Room.findOne({ _id: roomId });
      socket.emit("getRoomById", { room });
    } catch (error) {
      callback(error);
    }
  });

  // socket.on("tjoined", ({ name, user }, callback) => {
  //   callback({ wlcmsg: `Welcome ${name} to LavChatApp` });
  // });

  // socket.on("tjoinedRoom", ({ user, name }, callback) => {
  //   console.log(`my name ${name},my socketId: ${socket.id}`);
  //   socket.emit("message", {
  //     user,
  //     name,
  //     text: `${name}, welcome to GroupChat.`,
  //   });

  //   socket.broadcast.emit("message", {
  //     user,
  //     name,
  //     text: `${name} has joined!`,
  //   });
  // });

  // socket.on("tsendMessage", ({ user, name, text }, callback) => {
  //   io.emit("message", { user, name, text });
  // });

  // socket.on("bhaicreateroom", async ({ room, withGuy }) => {
  //   let theGuy = await Profile.findOne({
  //     name: withGuy,
  //   });
  //   io.to(theGuy.socketId).emit("tcreateroom", { room });
  //   // io.emit("message", { user, name, text: "bhai room kyu nahi ban raha" });
  // });

  socket.on("disconnect", () => {
    socket.off();
    console.log("User have left");
  });
});
