const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js');

const app = express();

//---------------

app.use(bodyParser.json());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: config.secret
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));

let db = massive.connectSync({
    connectionString: config.database
})
app.set('db', db);

let controller = require('./trail_ctrl'); 


//-----------------



  app.listen('3000', function(){
      console.log('listening on port 3000')
  })