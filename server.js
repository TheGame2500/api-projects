'use strict';
var express = require('express');
var mongoose = require('mongoose');
var Router=require('router');
var router=Router();
var app = express();
var validate = require('url-validator');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect('mongodb://localhost:27017/clementinejs');

app.use(router);
autoIncrement.initialize(connection);

var ObjectId = mongoose.Types.ObjectId;
var urlSchema = mongoose.Schema({
    url: String
});

urlSchema.plugin(autoIncrement.plugin, 'url');

var url = mongoose.model('url', urlSchema);

router.get('/',function(req,res){
    res.end('Hi!');
});


router.get('/new/:url(*)', function(req,res){
    var inputUrl=req.params.url;
    if(!validate(inputUrl)){                            //if invalid
        res.send('Url not found!');                     //return error
        return;
    }
    url.find({url : inputUrl}, function(err,data){
        if(err)
            throw err;
        if(!data.length){
            var saveUrl = new url( { url:inputUrl } );
            saveUrl.save(function(err, data){
                if(err)
                    throw err;
                res.json({shortUrl:'https://api-projects-thegame2500.c9users.io/'+data._id, orginalUrl : inputUrl});
                return;
            });
        }
        else{
            res.json({shortUrl:'https://api-projects-thegame2500.c9users.io/'+data[0]._id, orginalUrl : data[0].url});
        }
    });
});

router.get('/:urlId', function(req,res){
    var urlId=req.params.urlId;
    if(urlId==='favicon.ico') {res.end(); return;} //prevent favicon from breaking the request
    url.find({ _id : urlId}, function(err, data){
        if(err){
            throw(err);
        }
        if(!data.length){
            res.send('No such id found!');
            return;
        }
        res.redirect(data[0].url);
        
    })
})

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});