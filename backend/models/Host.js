const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  username:{
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Host = mongoose.model('host', hostSchema);

module.exports = Host;
