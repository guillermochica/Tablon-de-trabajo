//Servidor REST del servicio Tablón de trabajo

var fs = require('fs');
var express = require('express');
var app = express();
var port = process.argv[2]?process.argv[2]:8080;
var inicio = fs.readFileSync('inicio.html', 'utf8');
var tablas = new Array;

app.get('/', function (req, res) {
  console.log('Request received');
  res.send(inicio);
});

app.get('/tablon/:jefe/:project/:datos', function (req, res) {
  res.send(tablas[req.params.jefe][req.params.project]);

});

app.post('/tablon/:jefe/:project/:datos', function (req, res) {
  //Creación de la matriz de proyectos:
  tablas[req.params.jefe] = new Array; //Crea un array para un jefe concreto; cada jefe puede llevar más de un proyecto

  var page = fs.createWriteStream('tablon' + req.params.jefe + req.params.project + '.html'); //Crea el documento html donde se ubicará el tablón

  var datos = new Array;

  toInt(datos, req.params.datos); //los datos vienen en string, hay que pasarlos a entero

  crearTablon(page,req.params.project,req.params.jefe, datos);  //Escribe el tablón

  tablas[req.params.jefe][req.params.project] = fs.readFileSync('tablon' + req.params.jefe + req.params.project + '.html', 'utf8'); //Carga el tablón en la matriz de proyectos
  res.send('Creado tablón para proyecto ' + req.params.project);
});


app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);

//Funciones

function crearTablon (pagina, project, jefe, datos) {
  var string = '<html> \
    <head> \
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> \
      <title>Tablón de trabajo</title> \
    </head> \
    <body align="center"> \
    <h1>Tablón de ' + project + ' / Jefe: ' + jefe + '</h1><br> <p></p> \
    <table border="1" style="width:100%"> \
    <tr>'

  for (i = 1 ; i<=datos[0] ; i++) {
    string = string + '<td> Paco </td>';
  }
  string = string + '</tr>';

  for (i = 1 ; i<=datos[1] ; i++) {
    string = string + '<tr>';
    for (j = 1 ; j<=datos[0] ; j++) {
      string = string + '<td> Tarea </td>';
    }
    string = string + '</tr>';
  }
  string = string + '<p>No pierdas el tablón, guarda esta página en marcadores</p></body></html>';


  pagina.write(string);
}

function toInt(datos, params) {
  var k = 0;

  var aux1 = '';
  var i = 0;
  while (params[i] != ',') {
    aux1 = aux1 + params[i];
    i++;
  }
  i++;
  datos[k] = parseInt(aux1, 10); //primer numero guardado
  k++;
  var aux2 = '';
  while (i != params.length) {
    aux2 = aux2 + params[i];
    i++;
  }
  datos[k] = parseInt(aux2, 10); //segundo numero guardado
  k++;
}
