const mongoose = require('mongoose');

const NewuserSchema= new mongoose.Schema({
     newusername:{
         type: String,
         required: true},

     newuseremail:{
        type: String,
        required: true},

    newuserpass:{
        type: String,
        required: true},

    date:{
        type: Date,
        default: Date.now}
});

const Newuser= mongoose.model('Newuser', NewuserSchema );

module.exports = Newuser;  