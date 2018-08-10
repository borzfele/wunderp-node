const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Account} = require('./models/account');

require('./config/config')

const app = express();
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Yo!');
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});
  
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});
  
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.post('/accounts', (req, res) => {
    var body = _.pick(req.body, [
        'openingCash', 
        'openingDate', 
        'opener', 
        'transactions',
        'closingCash', 
        'closingDate', 
        'closer', 
        'cassaBalance', 
        'posBalance', 
        'totalBalance', 
        'comments']);
    var account = new Account(body);
  
    account.save().then((doc) => {
        res.set(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, (err) => {
    console.log(`Listening on port ${port}.`);
});