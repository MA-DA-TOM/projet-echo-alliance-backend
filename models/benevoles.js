const mongoose = require('mongoose');

const benevoleSchema = mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  token: String,
  dateNaissance: Date,
});

const Benevole = mongoose.model('benevoles', benevoleSchema);

module.exports = Benevole;
