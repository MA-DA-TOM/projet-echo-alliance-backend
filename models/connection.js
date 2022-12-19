const mongoose = require('mongoose');

const connectionString = "mongodb+srv://Lapinew:Ld*791518292@cluster0.4221bxp.mongodb.net/echoAlliance";

mongoose.set('strictQuery', false).connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
