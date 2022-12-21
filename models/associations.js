const mongoose = require('mongoose');

const coordSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
})

const adressAssoSchema = mongoose.Schema({
    coordinate : coordSchema,
    numero: String,
    //String si jamais 31bis par exemple
    rue: String,
    ville: String,
    codePostal: Number,
})

const associationSchema = mongoose.Schema({
  name: String,
  description: String,
  siteWeb: String,
  email: String,
  password: String,
  token: String, 
  RNA: String,
  uri: String,
  adresse: [adressAssoSchema],
  //Clé étrangère d'events pour trouver les events créé par l'asso
  assoEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
});

const Association = mongoose.model('associations', associationSchema);

module.exports = Association;
