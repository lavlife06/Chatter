const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");
const Profile = require("./models/Profile");
const {
    sendPrivateMessage,
    createPrivateChatroom,
} = require("./helperFunctions/privateChat");
const app = express();
const path = require("path");

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

io.use((socket, next) => {
    // Verificaitn of ttoken
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
            socket.handshake.query.token,
            keys.jwtSecret,
            function (err, decoded) {
                if (err) return next(new Error("Authentication error"));
                console.log(decoded, "decoded");
                socket.user = decoded.user;
                if (decoded.socketid) {
                    socket.id = decoded.socketid;
                }
                next();
            }
        );
    } else {
        next(new Error("Authentication error"));
    }
}).on("connection", (socket) => {
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

    socket.on("leaveRoom", ({ room }) => {
        socket.leave(room);
    });

    socket.on("leavePriRoom", ({ roomIds }) => {
        socket.leave(roomIds[0].roomid);
        socket.leave(roomIds[1].roomid);
    });

    socket.on("joinedRoom", ({ roomId }, callback) => {
        socket.join(roomId);
    });

    socket.on("joinedPriRoom", ({ roomIds }, callback) => {
        socket.join(roomIds[0].roomid);
        socket.join(roomIds[1].roomid);
    });

    socket.on(
        "sendGrpMessage",
        async ({ user, name, text, room }, callback) => {
            io.to(room).emit("message", { user, name, text });
            try {
                let chatRoom = await Room.findOne({
                    _id: room,
                });

                for (
                    let index = 0;
                    index < chatRoom.roomMembers.length;
                    index++
                ) {
                    const member = chatRoom.roomMembers[index];

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
                        // console.log(profile.socketId);
                        // console.log(profile.name);
                    }
                }

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
            io.to(roomIds[0].roomid).emit("message", { user, name, text });

            let res = await sendPrivateMessage(roomIds, user, name, text);

            io.to(res.recieverSocketId).emit("newMessage", {
                room: res.roomid,
                user,
                name,
                text,
            });
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

                for (let index = 0; index < roomMembers.length; index++) {
                    const memberDetail = roomMembers[index];

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
                }
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

        let usersInfo = await createPrivateChatroom(roomMembers);

        const { user1, user2 } = usersInfo;

        io.to(user1.userSocketid).emit("addNewPriChatRoom", {
            room: user1.userRoom,
            myprivaterooms: user1.userPrivateChatRooms,
        });
        io.to(user2.userSocketid).emit("addNewPriChatRoom", {
            room: user2.userRoom,
            myprivaterooms: user2.userPrivateChatRooms,
        });
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
