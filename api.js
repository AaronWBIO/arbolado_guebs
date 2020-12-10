var express = require('express');
var mongoose = require('mongoose');
const csvtojson = require('csvtojson'); //para poder importar CSV

var router = express.Router(); //Permite crear una clase del tipo routes para exportar.

const {
    basedatos, origen, senescencia,	escala, floracion, riego, serviciosEcosistemicos
} = require('.DescripcionArboles');

var fotos = require('.Fotos');


/**Funciones para subir CSV, y verficar los archivos, estos se usan con html */
router.get('/importarCSV', function (req, res){
	res.sendFile('subirCSV.html',{root: './'}) //Usar con un formulario .html
});

async function guardar(nameCollection, data){ //guarda los elementos del formato CSV  a la Base de datos.
	csvtojson().fromString(data)
	.then( async (csvData) => {
		console.log('guardando datos');
		await nameCollection.insertMany(csvData, (err, data) => {
			if(err){
				console.log(err);
			}else{
                console.log( nameCollection ,' fue importado con exito');
	 		}
		});
	});
}

function VerificarArchivos(archivos){ //Retorna una promesa, con el modelo segun el elemento devuelto.
	return new Promise( (resolve, reject) =>{
		switch(archivos[1].name){
			case 'BASEDATOS.csv':
				resolve(basedatos);
				break;
			case 'ESCALA.csv':
				resolve(escala);
				break;
			case 'RIEGO.csv':
				resolve(riego);
				break;
			case 'FLORACION.csv':
				resolve(floracion);
				break;
			case 'SENESCENCIA.csv':
				resolve(senescencia);
				break;
			case 'ORIGEN.csv':
				resolve(origen);
				break;
			case 'SERVICIOS_ECOSISTEMICOS.csv':
				resolve(serviciosEcosistemicos);
				break;
			default:
				console.log('datos no registrados verifique los archvivos asignados.');
				reject();
				break;
		}
	});
}

router.post('/importarCSV', async (req, res)=>{

	const data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}

	//obtengo el nombre de los documentos csv para saber en que coleccion van a ir los datos
	await Object.entries(data).forEach( async (archivos) => {
		var promesa = VerificarArchivos(archivos);
		
		await promesa
		.then(async(result) =>{			
				await guardar(result, archivos[1].data.toString());
				res.redirect('/');
		}).catch( error =>{
			console.log(error);
		});
	});
	console.log('ADIOS');
});

async function validar(nameCollection, dato){ //Se verifica los datos del archivo, de la base de datos de los arboles.
	//Busca que el dato a introducir sea valido
	await nameCollection.findOne({'VALOR': dato}, (err, result)=>{
			if(err){  console.log('soy el mejor'); throw err; };    //There was an error with the database.
			if(!result){
				console.log('El valor introducido: ', dato);
				console.log('no es valido para la coleccion del modelo ', nameCollection);//The query found no results.
				console.log('si los datos son correctos ignore esta advertencia'); 
				dato = {'status':false, 'consulta': nameCollection };
			} 
			else{
				console.log('El dato '+dato+' es valido para el modelo: ', nameCollection)
				dato = {'status': true, 'consulta': nameCollection };
			}
		});
	return dato;
}

router.post('/validarBaseDatos', (req, res)=>{ //Solicitud para verificar si los datos del csv son correctos.
	let data = req.files;
	if(data == null){ console.log('No hay elementos seleccionados'); res.redirect('/importarCSV');}

	data = data.file7.data.toString();
	csvtojson() 
	.fromString(data)
	.then( async (csvData) => {
	 	await Object.entries(csvData).forEach(async function(element) {		 		
		 	await Object.entries(element[1]).forEach(  function(valores){
		 		switch (valores[0]) {
		 			case 'ORIGEN':
		 				validar(origen, valores[1]);
		 				break;
		 			case 'SENESCENCIA':
		 				validar(senescencia, valores[1]); //*/
		 					break;
		 			case 'ESCALA':
		 				validar(escala, valores[1]);
		 					break;
		 			case 'FLORACION':
		 				validar(floracion, valores[1]);
		 				break;
		 			case 'RIEGO':
		 				validar(riego, valores[1]);
		 				break;
		 			case 'SERVICIOS_ECOSISTEMICOS':
		 				validar(serviciosEcosistemicos, valores[1]);
		 				break;
		 			default:
		  				console.log('los datos ', valores[1], 'no se validan para ', valores[0]);
		  				break;
		  		}
		  	});
		});
		res.redirect('/api/importarCSV');
	});
});

/* ================================================================================
 Funciones par poder guardar imagenes a la base de datos.
*/
router.get('/subirImagen', async (req, res)=>{ //Visualiza un html para subir las fotos
	res.sendFile('subirImagen.html', {root:'./'});
});

router.get('/visualizarImagen/:id', async (req, res)=>{ //Responde con una imagen en la hubicacion dada.
	var id = req.params.id;
	res.sendFile('staticfiles/Fotos/Carpeta1/'+id, {root: './'});
} );

async function GuardarFotos(req, res, nombreCarpeta){
	var i=0;
	console.log("Console :",req.files);
	if(Object.keys(req.files).length==9 && Object.keys(req.files)[8] == 'mv'){
		console.log(req.files.name);
		req.files.mv('./staticfiles/Fotos/'+nombreCarpeta+'/'+req.files.name, async function(err) {
			if (err){ return res.status(500).send(err);}
			var savedata = await new fotos({
				'Nombre': req.files.name,
			    'Ruta': './staticfiles/Fotos/'+nombreCarpeta+'/'
			}).save( async function(err, result) {
			    if (err){throw err;}
		        if(result) {
				    console.log('guardado con exito');//res.json(result)
				    res.send('Archivo Trepado y Ruta Guardada');
				}
			})
		});
	}else{
		await Object.entries(req.files).forEach( async (archivos) => {
			await archivos[1].mv('./staticfiles/Fotos/'+nombreCarpeta+'/'+archivos[1].name, async function(err) {
				if (err){ console.log('error')}//return res.status(500).send(err);}
				
				var savedata = await new fotos({
					'Nombre': archivos[1].name,
				    'Ruta': './staticfiles/Fotos/'+nombreCarpeta+'/'
				}).save( async function(err, result) {
				    if (err) throw err;
					i=i+1;
					if(result) {
				    	console.log(result);//res.json(result)
				    }
				    if(i==Object.keys(req.files).length){
				       	res.send('Archivo Trepado y Ruta Guardada');
				    }
				})
			});//*/
		});
	}
}

router.post('/subirImagen', async (req, res)=>{

    //Si se desea probar con un html, se debe usar la sintaxis req.files.nameEtiquetaDelArchivo.
    //Si se usa con la libreria de arduino usar la sintaxis req.file
	if (!req.files || Object.keys(req.files).length == 0) {
	return res.status(400).send('No files were uploaded.');
  	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file let sampleFile = req.files.foto[0];
	// Use the mv() method to place the file somewhere on your server
	/*switch (parseFloat(req.body.Opcion)) {
		case 1:
			console.log('Guardando en Carpeta 1');
			GuardarFotos(req, res, 'Carpeta1');
			break;
		case 2:
			console.log('Guardando en Carpeta 2');
			GuardarFotos(req, res, 'Carpeta2');
			break;
		case 3:
			console.log('Guardando en Carpeta 3');
			GuardarFotos(req, res, 'Carpeta3');
			break;
		case 4:
			console.log('Guardando en Carpeta 4');
			GuardarFotos(req, res, 'Carpeta4');
			break;
		default:
			GuardarFotos(req, res, 'Carpeta1');
			break;
	}//*/
	GuardarFotos(req, res, 'Carpeta1');
	console.log("Fin del afuncion Post");
});

module.exports = router;

