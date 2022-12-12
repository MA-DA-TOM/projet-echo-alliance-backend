const mongoose = require('mongoose');

const adressEventSchema = mongoose.Schema({
    longitude: String,
    latitude: String,
    numero: String,
    //String si jamais 31bis par exemple
    rue: String,
    ville: String,
    codePostal: Number
})


const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  horaire: Date,
  adresse: adressEventSchema,
  benevole: [{ type: mongoose.Schema.Types.ObjectId, ref: 'benevoles' }],
  association: [{ type: mongoose.Schema.Types.ObjectId, ref: 'associations' }],
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
