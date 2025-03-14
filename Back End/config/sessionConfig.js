const session = require('express-session');

module.exports = session({
  secret: process.env.DB_SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true, 
  cookie: { secure: false }
});