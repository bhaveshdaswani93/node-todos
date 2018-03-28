const mongoose = require('mongoose');
let url = 'mongodb://heroku_xrtk1ngn:radtob5qo858ohper4clc7d60v@ds123399.mlab.com:23399/heroku_xrtk1ngn';
mongoose.Promise = global.Promise;
mongoose.connect(url);
module.exports = { mongoose }