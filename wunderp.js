const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {authenticate, authenticateAdmin} = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Account} = require('./models/account');
const {Transaction} = require('./models/transaction');

require('./config/config');

const app = express();
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Yo!');
});

app.post('/users', authenticateAdmin, (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'role']);
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

app.post('/accounts', authenticate, (req, res) => {
    var body = _.pick(req.body, [
        'openingCash'
        ]);
    var account = new Account(body);

    account.openingDate = new Date();
    account.openerId = req.user._id;
  
    account.save().then((doc) => {
        res.set(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/accounts', authenticate, (req, res) => {
    Account.find().then((accounts) => {
      res.send({accounts});
    }, (e) => {
      res.status(400).send(e);
    });
  });

app.get('/accounts/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Account.findById(req.params.id).then((account) => {
        res.send(account);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.delete('/accounts/:id', authenticate, (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Account.findOneAndRemove(id).then((account) => {
        if (!account) {
        return res.status(404).send();
        }

        res.send(account);
    }).catch((e) => {
        res.status(400).send();
    });

});

app.patch('/accounts/update/:id', authenticate, (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, [
        'closingCash',
        'cassaBalance',
        'terminalBalance',
        'posBalance',
        'totalBalance']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    let closer = req.user._id;
    let closingDate = new Date();

    Account.findOneAndUpdate({_id: id}, {$set: body, closer, closingDate}, {new: true}).then((account) => {
        if (!account) {
          return res.status(404).send();
        }
    
        res.send(account);
      }).catch((e) => {
        res.status(400).send();
      });
});

app.patch('/accounts/close', authenticate, (req, res) => {
    var body = _.pick(req.body, [
        'closingCash',
        'cassaBalance',
        'terminalBalance',
        'posBalance',
        'totalBalance']);

    let closer = req.user._id;
    let closingDate = new Date();

    Account.findOne().sort({_id : -1}).then((account) => {
        Account.findOneAndUpdate({_id: account._id}, {$set: body, closer, closingDate}, {new: true}).then((todo) => {
            if (!todo) {
              return res.status(404).send();
            }
        
            res.send({todo});
          }).catch((e) => {
            res.status(400).send();
          })
    });
});

app.post('/transactions', authenticate, (req, res) => {
    var body = _.pick(req.body, [
        'value',
        'description',
        'issue'
        ]);

    var transaction = new Transaction(body);

    transaction.createdBy = req.user._id;
    transaction.createdAt = new Date();
  
    transaction.save().then((doc) => {
        res.set(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/transactions', authenticate, (req, res) => {
    Transaction.find().then((transactions) => {
        res.send(transactions);
    }, (e) => {
        res.status(400).send(e)
    });
});

app.get('/transactions/:id', authenticate, (req, res) => {

    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Transaction.findById(id).then((transaction) => {
        res.send(transaction);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.delete('/transactions/:id', authenticate, (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Transaction.findOneAndRemove(id).then((transaction) => {
        if (!transaction) {
        return res.status(404).send();
        }

        res.send(transaction);
    }).catch((e) => {
        res.status(400).send();
    });

});

app.patch('/transactions/:id', authenticate, (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, [
        'value',
        'description']);

    createdAt = new Date();
    createdBy = req.user._id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    let closer = req.user._id;
    let closingDate = new Date();

    Transaction.findOneAndUpdate({_id: id}, {$set: body, createdAt, createdBy}, {new: true}).then((transaction) => {
        if (!transaction) {
          return res.status(404).send();
        }
    
        res.send(transaction);
      }).catch((e) => {
        res.status(400).send();
      });
});

app.post('/issues', authenticate, (req, res) => {
    var body = _.pick(req.body, [
        'text'
        ]);

    var issue = new Issue(body);
  
    issue.save().then((doc) => {
        res.set(200).send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/issues', authenticate, (req, res) => {
    Issue.find().then((issue) => {
        res.send(issue);
    }, (e) => {
        res.status(400).send(e)
    });
});

app.get('/issues/:id', authenticate, (req, res) => {

    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Issue.findById(id).then((issue) => {
        res.send(issue);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.listen(port, (err) => {
    console.log(`Listening on port ${port}.`);
});