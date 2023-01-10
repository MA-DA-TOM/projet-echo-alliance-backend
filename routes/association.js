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
        webSite: req.body.siteWeb,
        email: req.body.email,
        password: hash,
        token: token,
        RNA: req.body.RNA,
        adress: {
          coordinate: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
          },
          number: req.body.numero,
          street: req.body.rue,
          city: req.body.ville,
          zipCode: req.body.codePostal,
        }
      });

      newAsso.save().then(() => {
        res.json({ result: true });
      });
    } else {
      // Asso already exists in database
      res.json({ result: false, error: 'account already exist' });
    };
  });
});


//Connexion association (association)
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
            webSite: data.webSite,
            email: data.email,
            token: data.token,
            RNA: data.RNA,
            adress: data.adress,
            assoEvents: data.assoEvents,
          }
        });
      } else {
        res.json({ result: false });
      }
    });
});


// ajouter un evenement dans sa liste en cas de creation d'un evenement (association)
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


// Supprimer un événement de sa liste en cas de suppression de l'événement (association)
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


//Liste événements d'une asso (x3)
router.get('/assoData/:email', (req, res) => {

  Association.findOne({email: req.params.email})
    .populate("assoEvents")
    .then(data => {
      res.json({ result: true, data: data.assoEvents });
    });
});


module.exports = router;
