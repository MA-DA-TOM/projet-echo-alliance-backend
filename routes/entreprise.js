var express = require('express');
var router = express.Router();

const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

require('../models/connection');
const Entreprise = require('../models/entreprises');

//Inscription
router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['name', 'description', 'email', 'password', 'siret', 'longitude', 'latitude', 'numero', 'rue', 'ville', 'codePostal', 'nom', 'prenom'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Entreprise.findOne({ email: req.body.email }).then(data => {
    if (data === null) {

      const token = uid2(32);

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newEntreprise = new Entreprise({
        name: req.body.name,
        description: req.body.description,
        siteWeb: req.body.siteWeb,
        email: req.body.email,
        password: hash,
        token: token,
        siret: req.body.siret,
        adresse: {
          coordinate: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
          },
          numero: req.body.numero,
          adresse: req.body.adresse,
          ville: req.body.ville,
          codePostal: req.body.codePostal,
        },
        dirigeant: {
          nom: req.body.nom,
          prenom: req.body.prenom,
          telephone: req.body.telephone,
        }
      });

      newEntreprise.save().then((data) => {
        res.json({
          result: true, data: {
            ID: data.id,
            name: data.name,
            description: data.description,
            siteWeb: data.siteWeb,
            email: data.email,
            token: data.token,
            siret: data.siret,
            adresse: data.adresse,
            dirigeant: data.dirigeant
          }
        });
      });
    } else {
      // Entreprise already exists in database
      res.json({ result: false, error: 'Entreprise already exists' });
    };
  });
});


//Connexion (entreprise)
router.post('/connexion', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Entreprise.findOne({ email: req.body.email }).then(data => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true, data: {
          ID: data.id,
          name: data.name,
          description: data.description,
          siteWeb: data.siteWeb,
          email: data.email,
          token: data.token,
          siret: data.siret,
          adresse: data.adresse,
          dirigeant: data.dirigeant
        }
      });
    } else {
      res.json({ result: false });
    }
  });
});


//Updater les offres de l'entreprise (entreprise + benevole)
router.post("/offres/:ID", (req, res) => {
  User.updateOne(
    {
      ID: req.params.ID,
    },
    {
      $set: {
        offres: {
          1: req.body.offre1,
          2: req.body.offre2,
          3: req.body.offre3,
        },
      }
    }
  ).then((data) => {
    res.json(data)
  })
})


//Récupérer toutes les entreprises (x3)
router.get('/all', (req, res) => {
  Entreprise.find()
    .then(data => {
      res.json({ result: true, data: data });
    });
});


module.exports = router;
