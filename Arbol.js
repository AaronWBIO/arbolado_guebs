// models/User.js
var mongoose = require('mongoose');
const ArbolSchema = mongoose.Schema({
    name:{
      type:String,
      require:true
    },
    lat: {
      type: String,
      require:true
    },
    lon: {
        type: String,
        require:true
      },
    url:{
      type:String,
      require:true
    }
    
 });
 module.exports = mongoose.model('ArbolSchema',ArbolSchema, 'arboles');
 