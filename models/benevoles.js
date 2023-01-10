const mongoose = require('mongoose');

const benevoleSchema = mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  token: String,
  birthdate: Date,
  hours: Number,
  level: Number,
  uri: String,
  myEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],

});


const Benevole = mongoose.model('benevoles', benevoleSchema);

module.exports = Benevole;
