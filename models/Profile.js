const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    socketId: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    tag: {
        type: String,
    },
    name: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    myRooms: [
        {
            roomId: {
                type: Schema.Types.ObjectId,
                ref: "Room",
            },
            roomName: String,
        },
    ],
    myPrivateChatRooms: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            roomId: {
                type: Schema.Types.ObjectId,
                ref: "Room",
            },
            roomName: String,
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
