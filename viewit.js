var express = require('express');
var CONFIG = require('./config');
var rawjs = require('raw.js');
var reddit = new rawjs("view it app");

var clientId = CONFIG.clientId;
var secret = CONFIG.secret;
var redirectUri = CONFIG.redirectUri;

// init
reddit.setupOAuth2(clientId, secret,  redirectUri);


function l(s){
	console.log(s);	
}

var app = express();

var port = 80;
var first = true;
var code = 0;
var access_token = 0;

app.get('/get_access', function(req,res){
	var url = reddit.authUrl("some_random_state", ['read']);
	res.redirect(url);
});
app.get('/', function(req,res){
	if(code === 0)
		res.redirect('/get_access');
});

app.get('/health_check', function(req,res){
	res.sendStatus(200);
});

app.get('/got_access', function(req,res){
	code = req.query.code;
	reddit.auth({"code": code}, function(err, response) {
		if(err){
			res.send(err);
		}else{
			access_token = response.access_token;
			res.redirect('/subreddits');
		}
	});
	
});

app.get('/r/:sub_name', function(req,res){
	var subName = req.params.sub_name;
	reddit.top(subName, function(err, response){
		if(!err)
		res.send(response);
	});	
});


app.get('/subreddit', function(req,res){
	res.render('subreddit');
});


app.listen(port, function(){
	console.log("listening on port "+port);
});
