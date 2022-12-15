const mongoose = require('mongoose');

const adressAssoSchema = mongoose.Schema({
    longitude: Number,
    latitude: Number,
    numero: String,
    //String si jamais 31bis par exemple
    adresse: String,
    ville: String,
    codePostal: Number
})

const associationSchema = mongoose.Schema({
  name: String,
  description: String,
  siteWeb: String,
  email: String,
  password: String,
  token: String, 
  siret: Number,
  adresse: adressAssoSchema,
});

const Asso = mongoose.model('associations', associationSchema);

module.exports = Asso;
