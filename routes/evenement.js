var express = require('express');
var router = express.Router();

const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Event = require('../models/events');

// creation d'un événement (pour asso)
router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['name', 'description', 'longitude', 'latitude', 'startDate', 'endDate', 'number', 'street', 'city', 'zipCode','assoCreator'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // const { name, description, dateDebut, dateFin, longitude, latitude, numero, rue, ville, codePostal } = req.body;
  const newEvent = new Event({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    duration: req.body.duration,
    adress: {
      coordinate: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      number: req.body.number,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
    },
    assoCreator: req.body.assoCreator,
    benevoles: null
  });

  newEvent.save().then((data) => {
    res.json({ result: true, data: data });
  });
});


//Récupérer tous les événements (pour map/search x3)
router.get('/allEvent', (req, res) => {
  Event.find()
  .populate("assoCreator")
  .populate("benevoles")
  .then(data => {
    res.json({ result: true, data: data });
  });
});


//Récupérer un événement par son nom (pour map/search x3)
router.get('/event', (req, res) => {
  Event.find({ _id: req.body.id })
  .populate("assoCreator")
  .populate("benevoles")
  .then( data => {
    res.json({ result: true, data: data });
  });
});


//Supprimer un événement (pour association)
router.get('/delete', (req, res) => {
  // const { _id } = req.body;

  Event.deleteOne({ _id: req.body.id }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Event not found' });
    }
  });
});

//ajouter un bénévole à un événement (pour benevole)
router.post('/addBenevole', (req, res) => {
  Event.updateOne({ name: req.body.name },
    {
      $push: {
        benevoles: req.body.benevoles
        }
    }
  ).then(data => { res.json({ data }); }
  )
});

//Supprimer un bénévole d'un événement (pour benevole)
router.get('/deleteBenevole', (req, res) => {
  Event.updateOne({ _id: req.body.id },
    {
      $pull: {
        benevoles: req.body.benevoles
      }
    }
  ).then(data => { res.json({ result: true, data: data }); }
  )
});



module.exports = router;
