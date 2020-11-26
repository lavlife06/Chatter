const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  numoffollowers: { type: Number },
  numoffollowing: { type: Number },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  myRooms: [
    {
      roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
      roomName: String,
    },
  ],
  // profileviewers: {
  //   type: String,
  // },
  // numofviewers:{
  // type: Number
  // },
  // location: {
  //   type: String,
  // },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
