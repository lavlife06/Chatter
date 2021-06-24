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
console.log(PORT);
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

    // console.log(io.sockets.adapter.rooms);

    // function getConnectedSockets() {
    //     return Object.values(io.of("/").connected);
    // }

    // getConnectedSockets().forEach(function (s) {
    //     s.disconnect(true);
    // });

    socket.on("joined", ({ name }, callback) => {
        console.log(io.sockets.adapter.rooms);
        console.log(`my name ${name},${socket.id}`);
    });

    socket.on("leaveRoom", ({ user, name, room }) => {
        socket.broadcast.to(room).emit("message", {
            user,
            name,
            text: `${name} has left the room!`,
        });

        socket.leave(room);
    });

    socket.on("leavePriRoom", ({ roomIds }) => {
        // console.log(io.sockets.adapter.rooms);
        // // console.log(socket.rooms);
        // console.log("leaveroom");

        socket.leave(roomIds[0].roomid);
        socket.leave(roomIds[1].roomid);
    });

    socket.on("joinedRoom", ({ user, name, room, roomId }, callback) => {
        console.log(io.sockets.adapter.rooms);
        // console.log(socket.rooms);
        socket.join(roomId);
        socket.emit("message", {
            user,
            name,
            text: `${name}, welcome to room ${room}.`,
        });

        socket.broadcast
            .to(room)
            .emit("message", { user, name, text: `${name} has joined!` });
        // console.log("joinroom");
    });

    socket.on("joinedPriRoom", ({ roomIds }, callback) => {
        console.log(io.sockets.adapter.rooms);
        socket.join(roomIds[0].roomid);
        socket.join(roomIds[1].roomid);
        // console.log("joinroom");
        // user.push(socketId);
    });

    socket.on(
        "sendGrpMessage",
        async ({ user, name, text, room }, callback) => {
            io.to(room).emit("message", { user, name, text });
            try {
                let chatRoom = await Room.findOne({
                    _id: room,
                });

                chatRoom.roomMembers.forEach(async (member) => {
                    if (user != member.user) {
                        let profile = await Profile.findOne({
                            user: member.user,
                        });
                        io.to(profile.socketId).emit("newMessage", {
                            room,
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
        async ({ user, name, text, roomIds }, callback) => {
            console.log(io.sockets.adapter.rooms, "rooms");

            console.log("room0", roomIds[0].roomid, "room1", roomIds[1].roomid);

            io.to(roomIds[0].roomid).emit("message", { user, name, text });
            // io.to(roomIds[1].roomid).emit("message", { user, name, text });

            try {
                let chatRoom0 = await Room.findOne({
                    _id: roomIds[0].roomid,
                });

                let chatRoom1 = await Room.findOne({
                    _id: roomIds[1].roomid,
                });

                chatRoom0.roomMembers.forEach(async (member) => {
                    if (user != member.user) {
                        let profile = await Profile.findOne({
                            user: member.user,
                        });
                        console.log(profile.socketId, profile.name);
                        let roomid;
                        let roomname;
                        if (user == roomIds[0].user) {
                            roomid = chatRoom1._id;
                            roomname = chatRoom0.roomName;
                        } else {
                            roomid = chatRoom0._id;
                            roomname = chatRoom1.roomName;
                        }
                        console.log(
                            roomid,
                            roomname,
                            "room to which newmessage is emitted"
                        );
                        io.to(profile.socketId).emit("newMessage", {
                            room: roomid,
                            user,
                            name,
                            text,
                        });
                    }
                });

                chatRoom0.chats.push({ user, name, text });
                chatRoom1.chats.push({ user, name, text });

                await chatRoom0.save();
                await chatRoom1.save();
            } catch (error) {
                callback(error);
            }
        }
    );

    socket.on(
        "createGrpChatRoom",
        async ({ user, roomName, roomMembers }, callback) => {
            //  Creating Room
            console.log(io.sockets.adapter.rooms);
            try {
                let room = new Room({
                    user,
                    roomName,
                    roomMembers,
                    roomtype: "group",
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

                        io.to(memberProfile.socketId).emit(
                            "addNewGrpChatRoom",
                            { room }
                        );
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
        console.log(io.sockets.adapter.rooms);

        //  Creating Room
        console.log(roomMembers);
        try {
            let room1 = new Room({
                roomtype: "private",
                user: roomMembers[0].user,
                roomName: roomMembers[1].name,
                roomMembers,
            });

            let room2 = new Room({
                roomtype: "private",
                user: roomMembers[1].user,
                roomName: roomMembers[0].name,
                roomMembers,
            });

            await room1.save();
            await room2.save();

            let roomIds = [
                { roomid: room1._id, user: room1.user },
                { roomid: room2._id, user: room2.user },
            ];

            room1.roomIds = roomIds;
            room2.roomIds = roomIds;

            await room1.save();
            await room2.save();

            let theRoomMembers = [...roomMembers];

            roomMembers.forEach(async (memberDetail, index) => {
                try {
                    let memberProfile = await Profile.findOne({
                        user: memberDetail.user,
                    });

                    if (!index) {
                        memberProfile.myPrivateChatRooms.push({
                            user: theRoomMembers[1].user,
                            roomId: room1._id,
                            roomName: theRoomMembers[1].name,
                        });
                        memberProfile.myRooms.push({
                            roomId: room1._id,
                            roomName: theRoomMembers[1].name,
                        });
                    } else {
                        memberProfile.myPrivateChatRooms.push({
                            user: theRoomMembers[0].user,
                            roomId: room2._id,
                            roomName: theRoomMembers[0].name,
                        });
                        memberProfile.myRooms.push({
                            roomId: room2._id,
                            roomName: theRoomMembers[0].name,
                        });
                    }

                    await memberProfile.save();

                    if (!index) {
                        io.to(memberProfile.socketId).emit(
                            "addNewPriChatRoom",
                            {
                                room: room1,
                                myprivaterooms:
                                    memberProfile.myPrivateChatRooms,
                            }
                        );
                    } else {
                        io.to(memberProfile.socketId).emit(
                            "addNewPriChatRoom",
                            {
                                room: room2,
                                myprivaterooms:
                                    memberProfile.myPrivateChatRooms,
                            }
                        );
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
