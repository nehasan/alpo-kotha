var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    user_name: String,
    password: String,
    email: String,
    gender: String,
    address: String,
    online: { type: Boolean, default: false }
});