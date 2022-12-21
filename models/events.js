const mongoose = require('mongoose');
// const Benevole = require('./benevoles');

const coordSchema = mongoose.Schema({
  longitude: Number,
  latitude: Number,
})

const adressEventSchema = mongoose.Schema({
    coordinate: coordSchema,
    numero: String,
    //String si jamais 31bis par exemple
    rue: String,
    ville: String,
    codePostal: Number
})

// const benevoleSchema = mongoose.Schema({
//   benevoles:[],
// }) => Il faut mettre ObjectId dans bénévole


const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  dateDebut: Date,
  dateFin: Date,
  duree: Number,
  uri: String,
  adresse: adressEventSchema,
  // utilisation de l'id des bénévoles et de l'asso souhaité pour avoir un tableau d'id qui sera populate quand on cherchera les bénévoles et ainsi voir toutes les infos nécéssaire
  assoCreator: {type: mongoose.Schema.Types.ObjectId, ref: 'associations'},
  benevoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'benevoles' }],
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
