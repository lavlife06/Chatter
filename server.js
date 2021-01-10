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

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Listen to Port to 5000");
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

  console.log(io.sockets.adapter.rooms);

  socket.on("joined", ({ name }, callback) => {
    console.log(`my name ${name}, my socketId:${socket.id}`);
    // callback({ wlcmsg: `Welcome ${name} to LavChatApp` });
  });

  socket.on("leaveRoom", ({ user, name, room }) => {
    console.log(io.sockets.adapter.rooms);
    // console.log(socket.rooms);
    console.log("leaveroom");
    socket.broadcast
      .to(room)
      .emit("message", { user, name, text: `${name} has left the room!` });

    socket.leave(room);
  });

  socket.on("leavePriRoom", ({ roomId }) => {
    console.log(io.sockets.adapter.rooms);
    // console.log(socket.rooms);
    console.log("leaveroom");

    socket.leave(roomId);
  });

  socket.on("joinedRoom", ({ user, name, room }, callback) => {
    console.log(io.sockets.adapter.rooms);
    // console.log(socket.rooms);
    socket.join(room);
    socket.emit("message", {
      user,
      name,
      text: `${name}, welcome to room ${room}.`,
    });

    socket.broadcast
      .to(room)
      .emit("message", { user, name, text: `${name} has joined!` });
    console.log("joinroom");
  });

  socket.on("joinedPriRoom", ({ roomId }, callback) => {
    console.log(io.sockets.adapter.rooms);
    socket.join(roomId);
    console.log("joinroom");
    // user.push(socketId);
  });

  socket.on(
    "sendGrpMessage",
    async ({ user, name, text, room, roomId }, callback) => {
      io.to(room).emit("message", { user, name, text });
      try {
        let chatRoom = await Room.findOne({
          _id: roomId,
        });

        chatRoom.roomMembers.forEach(async (member) => {
          if (user != member.user) {
            let profile = await Profile.findOne({ user: member.user });
            io.to(profile.socketId).emit("newMessage", {
              room: chatRoom,
              user,
              name,
              text,
            });
            console.log(profile.socketId);
            console.log(profile.name);
          }
        });

        chatRoom.chats.push({ user, name, text });

        await chatRoom.save();
      } catch (error) {
        callback(error);
      }
    }
  );

  socket.on(
    "sendPriMessage",
    async ({ user, name, text, roomId }, callback) => {
      console.log(roomId);
      io.to(roomId).emit("message", { user, name, text });

      try {
        let chatRoom = await Room.findOne({
          _id: roomId,
        });

        chatRoom.roomMembers.forEach(async (member) => {
          if (user != member.user) {
            let profile = await Profile.findOne({ user: member.user });
            console.log(profile.socketId);
            console.log(profile.name);
            io.to(profile.socketId).emit("newMessage", {
              room: chatRoom,
              user,
              name,
              text,
            });
          }
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

  socket.on("createPriChatRoom", async ({ user, roomMembers }, callback) => {
    //  Creating Room
    console.log(roomMembers);
    try {
      let room = new Room({
        user,
        roomMembers,
      });

      await room.save();

      let theRoomMembers = [...roomMembers];

      roomMembers.forEach(async (memberDetail, index) => {
        let roomId = room._id;

        try {
          let memberProfile = await Profile.findOne({
            user: memberDetail.user,
          });

          if (index == 0) {
            memberProfile.myPrivateChatRooms.push({
              roomId,
              user: theRoomMembers[1].user,
              name: theRoomMembers[1].name,
            });
          } else {
            memberProfile.myPrivateChatRooms.push({
              roomId,
              user: theRoomMembers[0].user,
              name: theRoomMembers[0].name,
            });
          }

          await memberProfile.save();

          if (index == 0) {
            io.to(memberProfile.socketId).emit("addNewPriChatRoom", {
              room,
              roomName: theRoomMembers[1].name,
            });
          } else {
            io.to(memberProfile.socketId).emit("addNewPriChatRoom", {
              room,
              roomName: theRoomMembers[0].name,
            });
          }

          console.log(
            `event createdPriChatRoom emmited to ${memberProfile.name}`
          );
          console.log(memberProfile.socketId);
        } catch (err) {
          console.error(err.message);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("getRoomById", async ({ roomId }, callback) => {
    try {
      const room = await Room.findOne({ _id: roomId });
      socket.emit("getRoomById", { room });
    } catch (error) {
      callback(error);
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.connected);
    console.log("User have left");
    console.log(io.sockets.adapter.rooms);
  });
});
