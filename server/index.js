const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js');

const app = express();

app.use(bodyParser.json());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: config.secret
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));




// const massiveInstance = massive.connectSync({connectionString: ''})

// app.set('db', massiveInstance);
// const db = app.get('db');

// let db = massive.connect({
//     connectionString: config.database
//   },
//   (err, localdb) => {
//     db = localdb;
//     app.set('db', db);
//     db.set_trails((err, data) => {
//       if (err) console.log(err);
//       else console.log('All tables successfully reset');
//     });
//   })


  app.listen('3000', function(){
      console.log('listening on port 3000')
  })