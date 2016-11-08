//Geral para o app
var express = require('express');
var flash    = require('connect-flash');
var app = express();

//Middleware
app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/')); //determina o conteúdo estático
app.use(flash());

app.listen(app.get('port'), function() {
  console.log('Node está brincando na porta ' + app.get('port'));
});
