var sign_in = require('./sign_in');
var sign_up = require('./sign_up');
var User = require('../models/user');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
//        console.log('serializing user: ');
//        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
//            console.log('de-serializing user:',user);
            user['online'] = true;
            user.save();
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    sign_in(passport);
    sign_up(passport);
};