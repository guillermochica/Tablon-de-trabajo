//Servidor REST del servicio Tablón de trabajo

var fs = require('fs');
var express = require('express');
var app = express();
var port = process.argv[2]?process.argv[2]:8080;
var inicio = fs.readFileSync('inicio.html', 'utf8');
var tablones = fs.readFileSync('tablones.html', 'utf8');

app.get('/', function (req, res) {
  res.send(inicio);
});

app.get('/tablon/:project', function (req, res) {
  res.send(tablones);
});

app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
