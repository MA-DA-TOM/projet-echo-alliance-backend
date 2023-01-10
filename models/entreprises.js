const mongoose = require('mongoose');

const coordSchema = mongoose.Schema({
  longitude: Number,
  latitude: Number,
})

const AdressEntrepriseSchema = mongoose.Schema({
  coordinate: coordSchema,
  number: String,
  //String si jamais 31bis par exemple
  street: String,
  city: String,
  zipCode: Number
})


const dirigeantSchema = mongoose.Schema({
  lastName: String,
  firstName: String,
  phone: Number,
})

const offresSchema = mongoose.Schema({
  first: String,
  second: String,
  third: String,
})

const entrepriseSchema = mongoose.Schema({
  name: String,
  description: String,
  webSite: String,
  email: String,
  password: String,
  token: String,
  siret: Number,
  uri: String,
  adress: AdressEntrepriseSchema,
  leader: dirigeantSchema,
  offers: offresSchema,
});

const Entreprise = mongoose.model('entreprises', entrepriseSchema);

module.exports = Entreprise;
