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

  getData(datos, req.params.datos); //los datos vienen en string, hay que recuperarlos

  //var contenidoTabla = new Array; //NUEVO
  //var j = 2;
  //for(i = 1 ; i<= datos[0] ; i++) { //NUEVO
  //  contenidoTabla.push(req.params.datos[j]);
  //  j++;
  //}

  crearTablon(page,req.params.project,req.params.jefe, datos);  //Escribe el tablón //NUEVO

  tablas[req.params.jefe][req.params.project] = fs.readFileSync('tablon' + req.params.jefe + req.params.project + '.html', 'utf8'); //Carga el tablón en la matriz de proyectos
  res.send('Creado tablón para proyecto ' + req.params.project);
});


app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);

//Funciones

function crearTablon (pagina, project, jefe, datos) { //CAMBIADO   //Rellena el contenido de la pagina html creada con el tablón pedido
  var string = '<html> \
    <head> \
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> \
      <title>Tablón de trabajo</title> \
    </head> \
    <body align="center"> \
    <h1>Tablón de ' + project + ' / Jefe: ' + jefe + '</h1><br> <p></p> \
    <table border="1" style="width:100%"> \
    <tr>';
  var k = 2;
  for (i = 1; i<=datos[0] ; i++) {
    string = string + '<td> ' + datos[k][0] + ' </td>';
    k++;
  }
  string = string + '</tr>';

  for (i = 1 ; i<=datos[1] ; i++) {
    string = string + '<tr>';
    var h=1; var l = 2;
    for (j = 1; j<=datos[0] ; j++) {
      string = string + '<td> ' + datos[l][h] + ' </td>';
      h++; l++;
    }
    string = string + '</tr>';
  }
  string = string + '<p>No pierdas el tablón, guarda esta página en marcadores' + datos[2][1]+'</p></body></html>';

  pagina.write(string);
}

function getData(datos, params) { //CAMBIADO//Convierte los dos primeros datos del vector proyecto en enteros ya que representan los numeros de filas y columnas
  var k = 0; //K recorrera el vector de datos

  var aux1 = '';
  var i = 0; //variable que ira recorriendo el string
  while (params[i] != ',') {
    aux1 = aux1 + params[i];
    i++;
  }
  i++;
  datos[k] = parseInt(aux1, 10); //primer numero guardado
  k++;
  var aux2 = '';
  while (params[i] != ',') { //CAMBIADO
    aux2 = aux2 + params[i];
    i++;
  }
  i++; //aqui i es igual a 4 (para el caso de una sola cifra borrar esto despues)
  datos[k] = parseInt(aux2, 10); //segundo numero guardado

for(c = 1 ; c<=datos[0] ; c++) { //c de columnas (colaboradores)
  k++; //aqui k es igual a 2
  j=0; //j recorrera los indices del vector de colaborador
  datos[k] = new Array; //vector de colaborador, contiene su nombre en primera posicion y luego sus tareas
  for(f=1 ; f<=datos[1] ; f++) { //f de filas (tareas)
    var aux3 = '';

    while(params[i]!=',') {
      aux3 = aux3 + params[i];
      i++;
    }
    i++; //para dejar de situarnos en la coma
    datos[k][j] = aux3;
    j++;
  }
}

}
