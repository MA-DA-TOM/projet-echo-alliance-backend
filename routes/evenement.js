var express = require('express');
var router = express.Router();

const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Event = require('../models/events');

// creation d'un événement
router.post('/', (req, res) => {
  if (!checkBody(req.body, ['name', 'description', 'dateDebut', 'dateFin', 'longitude', 'latitude', 'numero', 'rue', 'ville', 'codePostal','assoCreator'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // const { name, description, dateDebut, dateFin, longitude, latitude, numero, rue, ville, codePostal } = req.body;
  const newEvent = new Event({
    name: req.body.name,
    description: req.body.description,
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
    adresse: {
      coordinate: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      numero: req.body.numero,
      rue: req.body.rue,
      ville: req.body.ville,
      codePostal: req.body.codePostal,
    },
    assoCreator: req.body.assoCreator
  });

  newEvent.save().then((data) => {
    res.json({ result: true, data: data });
  });
});


//Récupérer tous les événements
router.get('/allEvent', (req, res) => {
  Event.find()
  .populate("assoCreator")
  .populate("bénévoles")
  .then(data => {
    res.json({ result: true, data: data });
  });
});


//Récupérer un événement par son nom
router.get('/event', (req, res) => {
  Event.find({ _id: req.body.id })
  .populate("assoCreator")
  .populate("bénévoles")
  .then( data => {
    res.json({ result: true, data: data });
  });
});


//Supprimer un événement
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

//ajouter un bénévole à un événement
router.post('/addBenevole', (req, res) => {
  Event.updateOne({ name: req.body.name },
    {
      $push: {
        bénévoles: req.body.benevoles
        }
    }
  ).then(data => { res.json({ data }); }
  )
});

//Supprimer un bénévole d'un événement
router.get('/deleteBenevole', (req, res) => {
  Event.updateOne({ _id: req.body.id },
    {
      $pull: {
        bénévoles: req.body.benevoles
      }
    }
  ).then(data => { res.json({ result: true, data: data }); }
  )
});



module.exports = router;
