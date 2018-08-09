let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wunderp', { useNewUrlParser: true });

module.exports = {mongoose};