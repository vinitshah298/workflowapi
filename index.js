var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

var routes = require('./routes/workflow');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/workflow/', routes);

mongoose.connect("mongodb://mongo/Workflow", function(error) {
    if(error) {
        console.log(error);
        return;
    }

    var server = http.createServer(app);
    server.listen(4500, function(error) {
        if(error) {
            console.log(error);
        }
        console.log("Server is up");
    });
});