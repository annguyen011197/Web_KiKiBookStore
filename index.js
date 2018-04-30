var express = require('express');
var app = express();
var bp = require('body-parser')

app.use(bp())
app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(3000);