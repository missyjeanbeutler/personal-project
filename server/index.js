const express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config = require('./config.js');

const app = module.exports = express();

//---------------

app.use(express.static('../www'));   

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
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
let updater = require('./update_trails_ctrl')


//-----------------


// ---------- database -----------//

app.get('/api/search', controller.allTrails);
app.get('/search/trail/:id', controller.trailData)
app.get('/search/trail/:id', controller.trailDataWithPromise)

//--------- Update Trail ---------//

app.put('/api/updateTrail', updater.updateTrail)






  app.listen(3000, function(){
      console.log(`listening on port ${this.address().port}`)
  })