const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  roomName: { type: String, default: "" },
  roomMembers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        default: "",
      },
      socketId: {
        type: String,
        default: "",
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  chats: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        default: "",
      },
      text: {
        type: String,
        default: "",
      },
    },
  ],
});

const Room = mongoose.model("room", RoomSchema);

module.exports = Room;
