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


//------------Auth----------------//

passport.use(new Auth0Strategy({ 
   domain:       config.auth0.domain,
   clientID:     config.auth0.clientID,
   clientSecret: config.auth0.clientSecret,
   callbackURL:  'http://localhost:3000/auth/callback' 
  },
  function(accessToken, refreshToken, extraParams, profile, done) { 
    db.getUserByAuthId([profile.id], function(err, user) { //their profile.id with auth0
      user = user[0];
      if (!user) { 
        console.log('CREATING USER');
        db.createUserByAuth([profile.displayName, profile.id], function(err, user) { //right here we're specifying what information we're wanting to store. If we wanted something else we could do profile.whateverWeWanted in the array on this line.
        console.log('2b')
          console.log('USER CREATED', user);
          return done(err, user[0]); 
        })
      } else {  
        console.log('FOUND USER', user);
        return done(err, user); 
      }
    })
  }
));

passport.serializeUser(function(userA, done) {
  console.log('serializing', userA);
  var userB = userA;
  done(null, userB); 
});

passport.deserializeUser(function(userB, done) { 
  var userC = userB;
  //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
    db.getUserFavorites(userC.authid, function(err, favorites) {
      if (!err) userC.favorites = favorites;
      else return err;
    })
    db.getUserCompleted(userC.authid, function(err, completed) {
      if (!err) userC.completed = completed;
      else return err;
    })
  done(null, userC);
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    res.status(200).send(req.user);
})

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/'); 
})


// ---------- database -----------//

app.get('/api/search', controller.allTrails);
app.get('/search/trail/:id', controller.trailData)
app.get('/search/trail/:id', controller.trailDataWithPromise)

//--------- Update Trail ---------//

app.put('/api/updateTrail', updater.updateTrail)






  app.listen(3000, function(){
      console.log(`listening on port ${this.address().port}`)
  })