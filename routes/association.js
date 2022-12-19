var express = require('express');
var router = express.Router();

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const { checkBody } = require('../modules/checkBody');
require('../models/connection');
const Association = require('../models/associations');


router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, [
    'name', 'description', 'email', 'password', 'RNA', 'longitude', 'latitude', 'numero', 'rue', 'ville', 'codePostal',
  ])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Association.findOne({ email: req.body.email, RNA: req.body.RNA }).then(data => {
    if (data === null) {

      const token = uid2(32);

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newAsso = new Association({
        name: req.body.name,
        description: req.body.description,
        siteWeb: req.body.siteWeb,
        email: req.body.email,
        password: hash,
        token: token,
        RNA: req.body.RNA,
        adresse: {
          coordinate: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
          },
          numero: req.body.numero,
          rue: req.body.rue,
          ville: req.body.ville,
          codePostal: req.body.codePostal,
        }
      });

      newAsso.save().then((data) => {
        res.json({ result: true, data: data });
      });
    } else {
      // Asso already exists in database
      res.json({ result: false, error: 'Association already exists' });
    };
  });
});


//Connexion association
router.post('/connexion', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Association.findOne({ email: req.body.email })
    .populate("assoEvents")
    .then(data => {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true, data: {
            ID: data.id,
            name: data.name,
            description: data.description,
            siteWeb: data.siteWeb,
            email: data.email,
            token: data.token,
            RNA: data.RNA,
            adresse: data.adresse,
            assoEvents: data.assoEvents,
          }
        });
      } else {
        res.json({ result: false });
      }
    });
});


// ajouter un evenement
router.post("/addEvent", (req, res) => {
  Association.updateOne(
    {
      email: req.body.email,
    },
    {
      $push: {
        assoEvents: req.body.assoEvents,
      },
    }
  ).then((data) => {
    res.json(data)
  })
})


// Supprimer un événement de sa liste en cas de suppression de l'événement
router.get('/deleteEvent', (req, res) => {
  Association.updateOne({ email: req.body.email },
    {
      $pull: {
        assoEvents: req.body.assoEvents
      }
    }
  ).then(data => { res.json({ data }); }
  )
});


//Liste événements d'une asso
router.get('/assoData', (req, res) => {

  Association.find({ email: req.body.email })
    .populate("assoEvents")
    .then(data => {
      res.json({ result: true, data: data });
    });
});


module.exports = router;
