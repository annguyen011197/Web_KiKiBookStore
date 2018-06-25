var LocalStrategy = require("passport-local").Strategy;
var User = require("../database/models/AccountModel");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function (req, email, password, done) {
        //if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        let username = req.body.username
        process.nextTick(function () {
          if (!req.user) {
            User.findOne({
              $or: [
                { "local.email": email },
                { "local.username": username }
              ]
            }, function (err, user) {
              if (err)
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "That email or username is already taken.")
                );
              if (user) {
                return done(null, false,
                  req.flash("signupMessage", "That email or username is already taken.")
                );
              } else {
                var newUser = new User();
                newUser.local.username = username
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.verify = new Date().getTime();
                newUser.save(function (err) {
                  if (err) return done(err);
                  return done(null, newUser, req.flash("signupMessage", "Successful"));
                });
              }
            });
          } else if (req.user != undefined) {
            if (!req.user.local.email) {
              User.findOne({ "local.email": email }, function (err, user) {
                if (err) return done(err);

                if (user) {
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                  var user = req.user;
                  user.local.email = email;
                  user.local.password = user.generateHash(password);
                  user.local.verify = new Date().getTime();
                  user.save(function (err) {
                    if (err) return done(err);
                    return done(null, user, req.flash('signupMessage', 'Successful'));
                  });
                }
              });
            } else {
              return done(null, req.user);
            }
          }
        });
      }
    )
  );

  // passport.use('local-login', new LocalStrategy(
  //   {
  //     usernameField: "email",
  //     passwordField: "password",
  //     passReqToCallback: true
  //   },
  //   (req, email, password, done) => {
  //     process.nextTick(() => {
  //       User.findOne({ 'local.email': email })
  //         .exec((err, user) => {
  //           if (err)
  //             return done(err)
  //           if (!user)
  //             return done(null, false, req.flash('loginMessage', 'No user found.'))
  //           if(!user.validPassword(password))
  //             return done(null,false,req.flash('loginMessage', 'Wrong Password'))
  //           return done(null,user,req.flash('loginMessage','Succesful'))
  //         })
  //     })
  //   }
  // ))

  passport.use('local-login', new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ 'local.email': email })
          .exec((err, user) => {
            if (err)
              return done(err)
            if (!user)
              return done(null, false, {message:'No user found'})
            if(!user.validPassword(password))
              return done(null,false,{message:'Wrong password'})
            if(!user.local.verify != "Active")
              return done(null,false,{message:'Must active email'})
            return done(null,user,{message:'Succesful'})
          })
      })
    }
  ))
};
