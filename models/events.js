const mongoose = require('mongoose');
const Benevole = require('./benevoles');

const adressEventSchema = mongoose.Schema({
    longitude: Number,
    latitude: Number,
    numero: String,
    //String si jamais 31bis par exemple
    rue: String,
    ville: String,
    codePostal: Number
})

const benevoleSchema = mongoose.Schema({
  benevoles:[],
})


const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  dateDebut: Date,
  dateFin: Date,
  duree: Number,
  adresse: adressEventSchema,
  bénévole: benevoleSchema,
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
