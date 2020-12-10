// models/Biblioteca.js



var mongoose = require('mongoose');
const BibliotecaSchema = mongoose.Schema({
    NOMBRE_CIENTIFICO:{
      type:String,
      require:true
    },
    NOMBRE_COMUN: {
      type: String,
      require:true
    },
    OTROS_NOMBRES_COMUNES: {
        type: String,
        require:true
      },
    FAMILIA:{
      type:String,
      require:true
    },
    ORIGEN:{
        type:String,
        require:true
      },
    TALLA:{
        type:String,
        require:true
      },
    ESCALA:{
        type:String,
        require:true
      },
    PERMANENCIA_HOJAS:{
        type:String,
        require:true
      },
    TIPO_DE_HOJA:{
        type:String,
        require:true
      },
    CORTEZA:{
        type:String,
        require:true
      },
    FLOR:{
        type:String,
        require:true
      },
    FLORACION:{
        type:String,
        require:true
      },
    FRUCTIFICACION:{
        type:String,
        require:true
      },
    RIEGO:{
        type:String,
        require:true
      },
      
      PRECAUCIONES:{     
        type:String,
        require:true
      },
      USOS_Y_SERVICIOS_ECOSISTEMICOS:{
        type:String,
        require:true
      },
      SE_PROVISION:{
        type:String,
        require:true
      },
      SE_REGULACION:{
        type:String,
        require:true
      },
      SE_CULTURALES:{
        type:String,
        require:true
      },
      DESCRIPCION:{
        type:String,
        require:true
      },
      CARACTERISTICAS:{
        type:String,
        require:true
      },
      NOMBRE_IMAGEN:{
        type:String,
        require:true
      },
      CANTIDAD_IMAGENES:{
        type:String,
        require:true
      },
      NIVEL:{
        type:String,
        require:true
      },
      IMAGENES_NIVEL:{
        type:String,
        require:true
      }
    
 });
 module.exports = mongoose.model('BibliotecaSchema',BibliotecaSchema, 'biblioteca');


 