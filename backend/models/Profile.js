const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  email: String,
  DOB: Date,
  
  myevents: [
    {
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
      contact: Number,
      hostedBy: String,
      hostedById: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // tag: {
  //   type: String,
  // },
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
  // numoffollowers:{type:Number},
  // numoffollowing:{type:Number},
  // followers: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'User',
  //     },
  //   },
  // ],
  // following: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: 'User',
  //     },
  //   },
  // ],
  // achievements: [
  //   {
  //     eventname: {
  //       type: String,
  //     },
  //     eventdescription: {
  //       type: String,
  //     },
  //   },
  // ],
  // profileviewers: {
  //   type: String,
  // },
  // numofviewers:{
  // type: Number
  // },
  // location: {
  //   type: String,
  // },
  gameinterest: {
    type: [String],
  },
  // social: {
  // youtube: {
  //   type: String,
  // },
  // twitter: {
  //   type: String,
  // },
  // facebook: {
  //   type: String,
  // },
  // linkedin: {
  //   type: String,
  // },
  //   instagram: {
  //     type: String,
  //   },
  // },
  // Otherlinks like mineown website link or as origanization i have website to share here
  // platformname can be like mywebsite or other gaming platformnames and its link
  // otherlinks: [
  //   {
  //     platformname: {
  //       type: String,
  //     },
  //     link: {
  //       type: String,
  //     },
  //   },
  // ],
  contact: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
