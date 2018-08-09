const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Yo!');
});

app.listen(port, (err) => {
    console.log(`Listening on port ${port}.`);
});