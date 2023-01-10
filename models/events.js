const mongoose = require('mongoose');
// const Benevole = require('./benevoles');

const coordSchema = mongoose.Schema({
  longitude: Number,
  latitude: Number,
})

const adressEventSchema = mongoose.Schema({
    coordinate: coordSchema,
    number: String,
    //String si jamais 31bis par exemple
    street: String,
    city: String,
    zipCode: Number
})

const eventSchema = mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  uri: String,
  adress: adressEventSchema,
  // utilisation de l'id des bénévoles et de l'asso souhaité pour avoir un tableau d'id qui sera populate quand on cherchera les bénévoles et ainsi voir toutes les infos nécéssaire
  assoCreator: {type: mongoose.Schema.Types.ObjectId, ref: 'associations'},
  benevoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'benevoles' }],
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
