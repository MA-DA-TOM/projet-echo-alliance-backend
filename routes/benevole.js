var express = require('express');
var router = express.Router();

const uid2 = require('uid2');
const bcrypt = require ('bcrypt');

require('../models/connection');
const Benevole = require('../models/benevoles');
const { checkBody } = require('../modules/checkBody');


router.post('/inscription', (req, res) => {
  if (!checkBody(req.body, ['name', 'lastName', 'email', 'password', 'dateNaissance'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
  }

  Benevole.findOne({email: req.body.email}).then(data => {
  if (data === null){

    const token = uid2(32);
  
    const hash = bcrypt.hashSync(req.body.password, 10);
  
    const newBenevole = new Benevole({ 
      name: req.body.name,
      lastName: req.body.lastName, 
      email: req.body.email, 
      password: hash, 
      token: token,
      dateNaissance: req.body.dateNaissance,
      heuresCumulees: req.body.heuresCumulees,
      echelon: req.body.echelon,
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

router.post('/connexion', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  Benevole.findOne({ email: req.body.email }).then(data => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false });
    }
   });
});

router.get('/deleteMyEvent', (req, res, next) => {
  Benevole.updateOne({email: req.params.email},
  {
    '$pull': {
        myEvent: {
            'name': req.body.name
        } 
    }
}
).then(data => { res.json({ result: true, eventBenevole: data }); }
)
});

router.get('/getall', (req, res) => {
  Benevole.find({email: req.params.email}).then(data => {
    res.json({result: true, benevoles: data});
  });
});

module.exports = router;
