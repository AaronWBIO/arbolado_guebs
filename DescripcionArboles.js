var mongoose = require('mongoose');

const basedatos = new mongoose.Schema({
	NOMBRE: String,
	NOMBREMAYA: String,
	NOMBRECIENTIFICO: String,
	FAMILIA: String,
	ESPECIE: String,
	ORIGEN: String,
	SENESCENCIA: String,
	ESCALA: String,
	FLORACION: String,
	RIEGO: String,
	SERVICIOSECOSISTEMICOS: String,
	DESCRIPCION: String
	//tipode hoja: 
});

const origen = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String

});

const senescencia = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String
});

const escala = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String,
});

const floracion = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String,	
});

const riego = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String	
});

const serviciosEcosistemicos = new mongoose.Schema({
	ID: Number,
	VALOR: String,
	DESCRIPCION: String	
});

module.exports = { 
	//el modelo collection agrega una s, al final si no se incluye nombreCollection
	//nombre, valor{ modelo('nombreModel', variableSchema, nombreCollection)}
	basedatos: mongoose.model('Basedatos', basedatos,'basedatos'),
	origen: mongoose.model('Origen', origen, 'origen'),
	senescencia: mongoose.model('Senescencia', senescencia,'senescencia'),
	escala: mongoose.model('Escala', escala, 'escala'),
	floracion: mongoose.model('Floracion', floracion, 'floracion'),
	riego: mongoose.model('Riego', riego, 'riego'),
	serviciosEcosistemicos: mongoose.model('ServiciosEcosistemicos', serviciosEcosistemicos, 'serviciosEcosistemicos'),
}