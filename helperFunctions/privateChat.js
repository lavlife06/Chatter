const Room = require("../models/Room");
const Profile = require("../models/Profile");

const sendPrivateMessage = async (roomIds, user, name, text) => {
    try {
        let chatRoom0 = await Room.findOne({
            _id: roomIds[0].roomid,
        });

        let chatRoom1 = await Room.findOne({
            _id: roomIds[1].roomid,
        });

        let roomid;
        let recieverSocketId;

        for (let index = 0; index < chatRoom0.roomMembers.length; index++) {
            const member = chatRoom0.roomMembers[index];

            if (user != member.user) {
                let profile = await Profile.findOne({
                    user: member.user,
                });

                console.log(profile.socketId, profile.name);

                // let roomname;
                if (user == roomIds[0].user) {
                    roomid = chatRoom1._id;
                    // roomname = chatRoom0.roomName;
                } else {
                    roomid = chatRoom0._id;
                    // roomname = chatRoom1.roomName;
                }

                recieverSocketId = profile.socketId;
            }
        }

        chatRoom0.chats.push({ user, name, text });
        chatRoom1.chats.push({ user, name, text });

        await chatRoom0.save();
        await chatRoom1.save();

        return { recieverSocketId, roomid };
    } catch (error) {
        callback(error);
    }
};

const createPrivateChatroom = async (roommembers) => {
    try {
        let room1 = new Room({
            roomtype: "private",
            user: roommembers[0].user,
            roomName: roommembers[1].name,
            roomMembers: roommembers,
        });

        let room2 = new Room({
            roomtype: "private",
            user: roommembers[1].user,
            roomName: roommembers[0].name,
            roomMembers: roommembers,
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

        let theRoomMembers = [...roommembers];

        let user1;
        let user2;

        for (let index = 0; index < roommembers.length; index++) {
            const memberDetail = roommembers[index];

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
                    user1 = {
                        userSocketid: memberProfile.socketId,
                        userRoom: room1,
                        userPrivateChatRooms: memberProfile.myPrivateChatRooms,
                    };
                } else {
                    user2 = {
                        userSocketid: memberProfile.socketId,
                        userRoom: room2,
                        userPrivateChatRooms: memberProfile.myPrivateChatRooms,
                    };
                }
            } catch (err) {
                console.error(err.message, "err frmo in");
            }
        }

        return { user1, user2 };
    } catch (err) {
        console.error(err.message, "err from out");
    }
};

module.exports = { sendPrivateMessage, createPrivateChatroom };
