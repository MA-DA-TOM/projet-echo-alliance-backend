var express = require('express');
var router = express.Router();

const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Entreprise = require('../models/associations');


router.post('/inscription', (req, res) => {
    if (!checkBody(req.body, ['name', 'description', 'siteWeb', 'email', 'password', 'siret', 'longitude', 'latitude', 'numero', 'adresse', 'ville', 'codePostal', 'nom', 'prenom'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    Entreprise.findOne({email: req.body.email}).then(data => {
      if (data === null){
    
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
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          numero: req.body.numero,
          adresse: req.body.adresse,
          ville: req.body.ville,
          codePostal: req.body.codePostal,
          nom: req.body.nom,
          prenom: req.body.prenom,
        }); 

newEntreprise.save().then(() => {
    res.json({ result: true });
});
} else {
      // Entreprise already exists in database
      res.json({ result: false, error: 'Entreprise already exists' });
};
});
});

router.post('/connexion', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Entreprise.findOne({ email: req.body.email }).then(data => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false });
    }
   });
});

router.get('/:name', (req, res) => {
    Entreprise.find({ name: req.params.name }).then(data => {
      res.json({ result: true, asso: data });
    });
   });


module.exports = router;
