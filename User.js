// models/User.js
var mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name:{
      type:String,
      require:true
    },
    email: {
      type: String,
      require:true
    },
    password:{
      type:String,
      require:true
    },
    level:{
      type: String,
      require:true
    }
 });
 module.exports = mongoose.model('UserSchema',UserSchema, 'usuarios');
 