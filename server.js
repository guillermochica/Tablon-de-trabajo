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

app.get('/tablon/:jefe/:project', function (req, res) {
  res.send(tablas[req.params.jefe][req.params.project]);

});

app.post('/tablon/:jefe/:project', function (req, res) {
  //Creación de la matriz de proyectos:
  tablas[req.params.jefe] = new Array; //Crea un array para un jefe concreto; cada jefe puede llevar más de un proyecto

  var page = fs.createWriteStream('tablon' + req.params.jefe + req.params.project + '.html'); //Crea el documento html donde se ubicará el tablón
  page.write('<h1>Tablón de ' + req.params.project + ' / Jefe: ' + req.params.jefe + '</h1><br>'); //Escribe el tablón

  tablas[req.params.jefe][req.params.project] = fs.readFileSync('tablon' + req.params.jefe + req.params.project + '.html', 'utf8'); //Carga el tablón en la matriz de proyectos
  res.send('Creado tablón para proyecto ' + req.params.project);
});


app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
