'use strict';

var express = require('express');

var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var Router=require('router');
var router=Router();
var app = express();
var validate = require('url-validator');

app.use(router);
mongoose.connect('mongodb://localhost:27017/clementinejs');

var urlSchema = mongoose.Schema({
    url: String
});

var url = mongoose.model('url', urlSchema);

router.get('/',function(req,res){
    res.end('Chello!');
});

var error={};

router.get('/new/:url(*)', function(req,res){
    var inputUrl=req.params.url;
    if(!validate(inputUrl)){      //if invalid
        res.json(error);                    //return error
        return;
    }
    url.find({url : inputUrl}, function(err,data){
        if(err)
            throw err;
        if(data==null){
            var saveUrl = new url( { url:inputUrl } );
            saveUrl.save(function(err, saveUrl){
                if(err)
                    console.log(err);
                res.json(saveUrl);
                console.log(inputUrl);
                return;
            });
        }
        else{
            res.json(data);
        }
    });
    //else
        //create item in db
        //return item in db
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

