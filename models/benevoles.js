const mongoose = require('mongoose');

const mesEventSchema = mongoose.Schema({
  mesEvent: [],
});

const benevoleSchema = mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  token: String,
  dateNaissance: Date,
  heuresCumulees: Number,
  echelon: String,
  mesEvent: mesEventSchema,
  // events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],

});


const Benevole = mongoose.model('benevoles', benevoleSchema);

module.exports = Benevole;
