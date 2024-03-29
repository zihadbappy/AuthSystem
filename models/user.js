const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
     username:{
         type: String,
         required: true},

     useremail:{
        type: String,
        required: true},

    userpass:{
        type: String,
        required: true},
        
    secretToken:{
        type:String
    },
    active:{
        type:Boolean
    },

    date:{
        type: Date,
        default: Date.now}
});

const user= mongoose.model('user', userSchema );

module.exports = user;  