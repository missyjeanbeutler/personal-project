const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      // cors = require('cors')
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js');

const app = module.exports = express();
// let corsOptions = {
//     origin: 'http://localhost:8080'
// };

//---------------

app.use(express.static('../www'));

app.use(bodyParser.json());
// app.use(cors(corsOptions));
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


app.get('/search', controller.allTrails);





  app.listen(8080, function(){
      console.log(`listening on port ${this.address().port}`)
  })