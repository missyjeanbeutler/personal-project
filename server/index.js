const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js');

const app = module.exports = express();

//---------------

app.use(express.static('../www'));

app.use(bodyParser.json());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: config.secret
}))
app.use(passport.initialize());
app.use(passport.session());


let db = massive.connectSync({
    connectionString: config.database
})
app.set('db', db);

let controller = require('./trail_ctrl'); 


//-----------------


  app.get('/api/test', function(req, res) {
    res.send('I AM TEXT')
  })





  app.listen(8080, function(){
      console.log(`listening on port ${this.address().port}`)
  })