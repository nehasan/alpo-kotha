//'use strict';
var User = require('../models/user');;

//var dbm;
//var type;
//var seed;
//
///**
//  * We receive the dbmigrate dependency from dbmigrate initially.
//  * This enables us to not have to rely on NODE_PATH.
//  */
//exports.setup = function(options, seedLink) {
//  dbm = options.dbmigrate;
//  type = dbm.dataType;
//  seed = seedLink;
//};

exports.up = function() {
    console.log("MIGRATION ... ");
//    return db.users.update({}, {$set : {"online": false}}, {upsert: false, multi: true});
//  return null;
    User.update({}, {"online": true}, {upsert: false, multi: true}, function(err, res){
        if(err){
            console.log('Migration Error: ' + err);
        }else{
            console.log('Migration Success: ' + res);
        }
    });
};

exports.down = function() {
//    return db.users.update({}, {$unset : {"online": ""}}, {multi: true});
//  return null;
    User.update({}, {"online": ''}, {multi: true}, function(err, res){
        if(err){
            console.log('Migration Error: ' + err);
        }else{
            console.log('Migration Success: ' + res);
        }
    });
};

//exports._meta = {
//  "version": 1
//};