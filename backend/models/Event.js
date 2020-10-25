const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Host',
  },
  game: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
    //required: true,
  },
  time: {
    type: Date,
    // required: true,
  },
  entryFee: String,
  prizepool: Number,
  teamsize: Number,
  title: String,
  gamelink: String,
  hostedBy: {
    type: String,
    required: true,
  },
  hostedById: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  registeredteaminfo: [
    {
      teammembersinfo: [
        {
          user: {
            type: Schema.Types.ObjectId,
          },
          email: {
            type: String,
          },
          name: {
            type: String,
          },
          username: {
            type: String,
          },
          teamLeader: {
            type: String,
          },
          contact: {
            type: Number,
          },
        },
      ],
    },
  ],
  registeredplayerinfo: [
    {
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      contact: {
        type: Number,
      },
      username: {
        type: String,
      },
    },
  ],
  contact: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('event', eventSchema);

module.exports = Event;
