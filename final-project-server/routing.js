const express = require('express');
const uuidV4 = require('uuid/v4');
const passport = require('passport');

const User = require('./models/users.js');
const Comments = require('./models/comments.js');
const Favorites = require('./models/favorites.js');

const router = express.Router();


//User signup and login + authentication

// router.get('/api/signup', (req, res, next) => {
//   res.send(data)
// });

require('./authentify.js')(app);

router.post('/api/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '') {
      return res.send('Please enter a username.');
    }
    else if (password === '') {
      return res.send('Please enter a password.');
    }
  User.findOne({ username: username }, (err, user) => {
    if (err) { return next(err); }
    if (user) {
      return res.send('Username is already in use, please be more creative.');
    }
    const newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate('login', {
    successRedirect: {
                      '/api/', res.send('Thank you for signing up.')
                    },
    failureRedirect: '/api/signup'
    // failureFlash: true

    //alternative?
    /*passport.authenticate('login') (req, res) => {
    res.sendStatus(200);
    }*/
  })
);

// router.use(( req, res, next) => {
//   res.locals.currentUser = req.user;
//   res.locals.errors = req.flash('error');
//   res.locals.infos = req.flash('info');
//   next();
// });
//
// router.get('/api/login', (req, res, next) => {
//   res.send(data)
// });

router.post('/api/login', passport.authenticate('login', {
  successRedirect: {
                    '/api/', res.send('Thank you for loggin in.')
                  },
  failureRedirect: '/api/login'
  // failureFlash: true
}));

router.post('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.use((req, res, next) => {
  if (req.isAuthenticated) {
    next();
  }
  else {
    res.sendStatus(401);
  }
});

router.get('/api/authy', (req, res) => {
  console.log('authy', req.user);
  res.send(req.user)
});

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   }
//   else {
//     req.flash("info", "You must be logged in to see this page.");
//     res.redirect('/api/login');
//   }
// }



//Favorites collections for users

router.post('/api/favorite', (req, res) => {
  var favorite = new Favorites();
  favorite.name = req.body.name;
  favorite.art = req.body.art;
  favorite.id = req.body.id;
  favorite.save(function() {
  })
  res.send('posting favs');
})

//placeholder - need user ids and favorite ids
router.delete('/api/favorite', (req, res) => {
  var cb = (err, data) => {
    res.sendStatus(204);
  };
  Favorites.findByIdAndRemove(req.params.favsXXXXX, cd);
});

router.get('/api/savedFavorites', function(req, res) {
  Favorites.find({})
    .exec(function(err, data) {
      res.send(data);
    });
});

router.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../final-project-client/build',
  'index.html'));
});

module.exports = router;
