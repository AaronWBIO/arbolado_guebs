const mongoose = require('mongoose');
const fotos = new mongoose.Schema({
	Nombre: String,
	Ruta: String,
	Especie: String
});
module.exports = mongoose.model('Foto', fotos, 'fotos');