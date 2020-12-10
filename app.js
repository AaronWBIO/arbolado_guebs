var express = require("express");
var mongoose = require("mongoose");
var morgan = require('morgan'); //Permite visualizar las peticiones en el servidor.
var fileupload = require('express-fileupload'); //Manejador para la recebcion de documentos.
var User = require(".User");
var Arbol = require(".Arbol");
var Biblioteca = require(".Biblioteca");
var db = require(".myurl").myurl;
var cors = require('cors')



//var bcrypt = require('bcrypt')
var saltRouds = 10

var app = express();


var port = process.env.PORT || 3000;

//usa npm start para correr siempre el servidor, poniendo el comando start en script en package.json


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors()) // Use this after the variable declaration

app.use(fileupload()); //libreria para 
app.use(morgan('dev'));  //Imprime en consola las solicitudes de los clientes.


mongoose.connect(db,{ useNewUrlParser: true ,useUnifiedTopology: true,})
  .then(() => {
    console.log("Database is connected");
    //db = database.db('prueba');
  })
  .catch(err => {
    console.log("Error is ", err.message);
  });

app.get("/", (req, res) => {
  res.status(200).send(`Hi Welcome to the Login and Signup API`);
});


app.get("/getMarkers", (req, res) => {

 
  Arbol.find({}, {},function(err, data){
    res.status(200).json(data);
    console.log(data);
 })


 
});


//funcion para obtener especies de arboles en biblioteca
app.get("/getBiblioteca", (req, res) => {

  Biblioteca.find({}, {},function(err, data){
    res.status(200).json(data);
    //console.log(data);
 })


 
});

app.get("/getNombres", (req, res) => {

  
  Biblioteca.find({}, {
    "NOMBRE_CIENTIFICO": true,
    "NOMBRE_COMUN": true
  },function(err, data){

    
    res.status(200).json(data);
    //console.log(data);
 })


 
});



//funcion para obtener informacion de la ficha
app.post("/getFicha", async (req, res) => {  
  
  var nombreCientifico = req.body.NommbreCientifico.trim();
 //console.log("El servidor recibio:"+nombreCientifico);

  await Biblioteca.findOne({ NOMBRE_CIENTIFICO: nombreCientifico })
    .then(data => {

      if(data!=null)
      {
        res.status(200).json(data);
      }else{
        res.status(200).send('Datos vacios');
      }
      
    })
    .catch(err => {
      console.log("Error is ", err.message);
    });
});

//funcion para buscar especies por nombre comun o cientifico




//seccion para agregar markes
app.post("/setMarkers", async (req, res) => {

  var arbol = new Arbol({
    name: req.body.name,
    lat:req.body.lat,
    lon:req.body.lon,
    url:req.body.url
  });

  console.log(arbol.url);

  await arbol.save()
          .then(() => {
            res.status(200).send('ok');
          })
          .catch(err => {
            console.log("Error is ", err.message);
          });
});


//seccion para hacer el registro de usuarios
app.post("/signup", async (req, res) => {

    //const hash = bcrypt.hashSync(req.body.password, saltRouds);

    var hash = encriptar(req.body.email, req.body.password);

    var newUser = new User({
      name: req.body.name,
      email:req.body.email,
      password: hash,
      level: "0"
    });
  
    await User.findOne({ email: newUser.email })
      .then(async profile => {
        if (!profile) {
          await newUser
            .save()
            .then(() => {
              res.status(200).send('Usuario guardado');
            })
            .catch(err => {
              console.log("Error is ", err.message);
            });
        } else {
          res.send("El correo ya ha sido registrado");
        }
      })
      .catch(err => {
        console.log("Error is", err.message);
      });
  });
  


//funcion para iniciar sesion
app.post("/login", async (req, res) => {  
    var newUser = new User({
      name: req.body.name,
      email:req.body.email,
      password: req.body.password,
      level: "0"
    });

  
    await User.findOne({ email: newUser.email })
      .then(profile => {
        if (!profile) {
          res.send("Error, Usuario no existe");
        } else {

          //var hash = bcrypt.hashSync(newUser.password);

          //if(bcrypt.compareSync(newUser.password, profile.password) )// true
          //{

          //if (bcrypt.compareSync(newUser.password, profile.password))
          //{
            var passEncriptada = encriptar(newUser.email, newUser.password);
            //var passEncriptada2 = encriptar(newUser.name, newUser.password);
            //console.log(passEncriptada)
            if( passEncriptada == profile.password){
            

            newUser.level = profile.level;

            let cadena = "ok,"+profile.email+","+profile.name+","+profile.level;

            //res.status(200).send(profile);
            res.status(200).send(cadena);
            }
           else {
            res.send("Error, contraseña incorrecta");
          }
        }
      })
      .catch(err => {
        console.log("Error is ", err.message);
      });
});

function encriptar(user, pass) {
    var crypto = require('crypto')
    // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
    var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
    return hmac
}

//Incluyo las rutas que se usan en el api, se accede mediante la url https://direccion/api/....
app.use('/api',require('./api.js'));


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


/*
app.post("/insertar", async (req, res) => {
  
  // Function call npm install crypto-js
  await User.insertMany([ 
    { name:  req.body.name, password:  req.body.password }
    
  ]).then(function(){ 
    console.log(req.body.name + " , "+ req.body.password)  // Success 
    res.send("Dato insertado");


  }).catch(function(error){ 
    console.log(error)      // Failure 
  }); 

});


app.post("/consulta", async (req, res) => {
  
  // Function call 
  await User.find( ).then(function(respuesta){ 
    // Success
    console.log(respuesta.length)
    console.log(respuesta[0].name)
    res.send("Datos leidos");

  }).catch(function(error){ 
    console.log(error)      // Failure 
    res.send("Error");
  }); 

});
*/