var express = require('express');
var router = express.Router();

const { checkBody } = require('../modules/checkBody');

require('../models/connection');
const Event = require('../models/events');


router.post('/', (req, res) => {
    if (!checkBody(req.body, ['name', 'description', 'dateDebut', 'dateFin', 'longitude', 'latitude', 'numero', 'rue', 'ville', 'codePostal'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    const { name, description, dateDebut, dateFin, longitude, latitude, numero, rue, ville, codePostal } = req.body;
    const newEvent = new Event({ name, description, dateDebut, dateFin, longitude, latitude, numero, rue, ville, codePostal });

newEvent.save().then(() => {
    res.json({ result: true });
});
});


router.get('/:name', (req, res) => {
    Event.find({ name: req.params.name }).then(data => {
      res.json({ result: true, events: data });
    });
   });


router.delete('/', (req, res) => {
    const { name } = req.body;
   
    Event.deleteOne({ name }).then((deletedDoc) => {
        if (deletedDoc.deletedCount > 0) {
        res.json({ result: true });
      } else {
        res.json({ result: false, error: 'Event not found' });
      }
    });
});

router.post('/benevole', (req, res, next) => {
    Event.updateOne({email: req.params.email},
    {
      '$push': {
          benevoles: {
              'name': req.body.name,
              'lastName': req.body.lastName, 
              'email': req.body.email, 
          } 
      }
  }
  ).then(data => { res.json({ result: true, eventBenevole: data }); }
  )
  });

module.exports = router;
