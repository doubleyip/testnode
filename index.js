var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');


app.get('/sumSearch', function(req, res) {
  var data = {};
  var server = 'na';
  var apiKey = 'RGAPI-c16c2668-0913-4123-9416-113f700d30f0';
  var sumSearch = req.query.name;
  var URL = 'https://'+server+'1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + sumSearch + '?api_key=' + apiKey;
  console.log(URL);

  async.waterfall([
    function(callback) {
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          data.id = json.id;
          data.name = json.name;
          callback(null, data);
		  console.log(data.name);
		  console.log(data.id);
        } else {
          console.log(err);
        }
      });
    }
  ],
  function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    /*res.render('index', {
      info: json
	  
    })*/
	res.status(404).json(data);
  });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);