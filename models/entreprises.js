const mongoose = require('mongoose');

const coordSchema = mongoose.Schema({
  longitude: Number,
  latitude: Number,
})

const AdressEntrepriseSchema = mongoose.Schema({
  coordinate: coordSchema,
  numero: String,
  //String si jamais 31bis par exemple
  rue: String,
  ville: String,
  codePostal: Number
})


const dirigeantSchema = mongoose.Schema({
  nom: String,
  prenom: String,
  telephone: Number,
})

const offresSchema = mongoose.Schema({
  1: String,
  2: String,
  3: String,
})

const entrepriseSchema = mongoose.Schema({
  name: String,
  description: String,
  siteWeb: String,
  email: String,
  password: String,
  token: String,
  siret: Number,
  uri: String,
  adresse: AdressEntrepriseSchema,
  dirigeant: dirigeantSchema,
  offres: offresSchema,
});

const Entreprise = mongoose.model('entreprises', entrepriseSchema);

module.exports = Entreprise;
