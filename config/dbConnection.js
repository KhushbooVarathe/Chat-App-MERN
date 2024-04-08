const express = require('express');
const mongoose = require('mongoose');
const app = express();

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MongoDB_URL, connectionParams)
  .then(() => {
    console.log('Connected to the database');
    
  })
  .catch(err => {
    console.error(`Error connecting to the database: ${err}`);
  });
