const mongoose = require('mongoose');

const AdressEntrepriseSchema = mongoose.Schema({
    longitude: Number,
    latitude: Number,
    numero: String,
    //String si jamais 31bis par exemple
    adresse: String,
    ville: String,
    codePostal: Number
})


const dirigeantSchema = mongoose.Schema({
    nom: String,
    prenom: String,
})

const entrepriseSchema = mongoose.Schema({
  name: String,
  description: String,
  siteWeb: String,
  email: String,
  password: String,
  token: String, 
  siret: Number,
  dirigeant: dirigeantSchema,
  adresse: AdressEntrepriseSchema,
});

const Entreprise = mongoose.model('entreprises', entrepriseSchema);

module.exports = Entreprise;
