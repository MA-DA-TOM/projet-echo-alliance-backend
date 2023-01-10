var express = require('express');
var router = express.Router();

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

require('../models/connection');
const Benevole = require('../models/benevoles');
const { checkBody } = require('../modules/checkBody');


router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['name', 'lastName', 'email', 'password',])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }


  //Inscription bénévole
  Benevole.findOne({ email: req.body.email }).then(data => {
    if (data === null) {

      const token = uid2(32);

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newBenevole = new Benevole({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        token: token,
        birthdate: req.body.dateNaissance,
        hours: 0,
        level: 0,
      });

      newBenevole.save().then(() => {
        res.json({ result: true });
      });
    } else {
      // Benevole already exists in database
      res.json({ result: false, error: 'Benevole already exists' });
    }
  });
});


// connexion bénévole (benevole)
router.post('/connexion', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Benevole.findOne({ email: req.body.email })
    .populate("myEvents")
    .then(data => {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({
          result: true, data: {
            ID: data.id,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            token: data.token,
            myEvents: data.myEvents,
            hours: data.hours,
            level: data.level,
          }
        });
      } else {
        res.json({ result: false });
      }
    });
});



// Ajouter un événement à sa liste en cas d'inscription (benevole)
router.post('/addEvents', (req, res) => {
  Benevole.updateOne({ email: req.body.email },
    {
      $push: {
        myEvents: req.body.mesEvent
      }
    }
  ).then(data => { res.json({ data }); }
  )
});


// Supprimer un événement de sa liste /se désinscrire (benevole)
router.get('/deleteEvent', (req, res) => {
  Benevole.updateOne({ email: req.body.email },
    {
      $pull: {
        myEvents: req.body.mesEvent
      }
    }
  ).then(data => { res.json({ data }); }
  )
});


// Récupérer toute la data d'un document 1
router.get('/getMyData', (req, res) => {
  Benevole.findOne({ email: req.body.email }, { password: 0 })
    .populate("myEvents")
    .then(data => {
      res.json({ data });
    });
});


module.exports = router;
