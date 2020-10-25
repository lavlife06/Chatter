const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Host',
  },
  email: {
    type: String,
    unique: true,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    unique: true,
    default: '',
  },
  myhostedevents: [
    {
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
        // required: true,
      },
      // time: {
      //   type: Date,
      // },
      entryFee: String,
      prizepool: Number,
      teamsize: Number,
      title: String,
      gamelink: String,
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
              number: {
                type: String,
              },
              username: {
                type: String,
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
          number: {
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
    },
  ],
  
  contact: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const HostProfile = mongoose.model('hostProfile', hostProfileSchema);

module.exports = HostProfile;
