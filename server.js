'use strict';

var express = require('express');

var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var Router=require('router');
var router=Router();
var app = express();

app.use(router);
mongoose.connect('mongodb://localhost:27017/clementinejs');
var urlSchema = mongoose.Schema({
    id : Number,
    url: String
});

var url = mongoose.model('url', urlSchema);
var validate = require('url-validator');

router.get('/',function(req,res){
    res.send('Chello!');
});

router.get('/new/:url(*)', function(req,res){
    res.send(req.params.url);
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

