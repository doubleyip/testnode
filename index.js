var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');


app.get('/',function(req,res){
	res.render('index');
});

app.get('/search', function(req, res) {
  var data = {};
  var apiKey = 'RGAPI-c16c2668-0913-4123-9416-113f700d30f0';
  var sumSearch = req.query.summoner.toLowerCase();
  var URL = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + sumSearch + '?api_key=' + apiKey;
  
  async.waterfall([
    function(callback) {
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          data.accountId = json.accountId;
          data.name = json.name;
          callback(null, data);
        } else {
          console.log(err);
        }
      });
    },
	function(data, callback){
		var URL='https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/'+data.id'/recent?api_key='+apiKey;
		request(URL,function(err,response,body){
			if(!err&&response.statuscode==200){
				
			}else{
				console.log('Line 39');
			}
		});
	}
  ],
  function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    res.render('index', {
      info: data
    });
  });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);
