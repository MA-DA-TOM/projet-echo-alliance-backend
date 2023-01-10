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
        webSite: req.body.siteWeb,
        email: req.body.email,
        password: hash,
        token: token,
        siret: req.body.siret,
        adress: {
          coordinate: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
          },
          number: req.body.numero,
          street: req.body.rue,
          city: req.body.ville,
          zipCode: req.body.codePostal,
        },
        leader: {
          lastName: req.body.nom,
          firstName: req.body.prenom,
          phone: req.body.telephone,
        },
        offers: {
          first: "null",
          second: "null",
          third: "null",
        }
      });

      newEntreprise.save().then((data) => {
        res.json({
          result: true, data: {
            ID: data.id,
            name: data.name,
            description: data.description,
            webSite: data.siteWeb,
            email: data.email,
            token: data.token,
            siret: data.siret,
            adress: data.adresse,
            offers: data.offres,
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
          webSite: data.webSite,
          email: data.email,
          token: data.token,
          siret: data.siret,
          adress: data.adress,
          offers: data.offers,
        }
      });
    } else {
      res.json({ result: false });
    }
  });
});


//Updater les offres de l'entreprise (entreprise + benevole)
router.post("/offres", (req, res) => {
  Entreprise.updateOne(
    {
      email: req.body.email,
    },
    {
      $set: {
        offers: {
          first: req.body.offre1,
          second: req.body.offre2,
          third: req.body.offre3,
        },
      }
    }
  ).then((data) => {
    res.json(data)
  })
})


//récupérer une seule entreprise 
router.post('/getone', (req, res) => {
  if (!checkBody(req.body, ['email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Entreprise.findOne({ email: req.body.email }).then(data => {

    res.json({
      result: true, data: {
        ID: data.id,
        name: data.name,
        description: data.description,
        webSite: data.webSite,
        email: data.email,
        token: data.token,
        adress: data.adress,
        offers: data.offers
      }
    });
  });
});

//Récupérer toutes les entreprises (x3)
router.get('/all', (req, res) => {

  Entreprise.find()
    .then(data => {
      res.json({ result: true, data: data });
    });
});


module.exports = router;
