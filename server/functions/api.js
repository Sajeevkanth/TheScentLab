const serverless = require('serverless-http');
const app = require('../server');
const connectDB = require('../config/db');

// Connect to database on every invocation since functions are stateless
connectDB();

module.exports.handler = serverless(app);
