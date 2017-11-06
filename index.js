/*
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));


app.set('port',(process.env.PORT || 3000));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
console.log('TEST');

app.get('/', function(req, res) {
  var data = {};
  var api_key = 'RGAPI-c16c2668-0913-4123-9416-113f700d30f0';
  var s_toSearch = 'doubleyip';
  var URL = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + s_toSearch + '?api_key=' + api_key;
  
  async.waterfall([
    function(callback) {
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200) {
          var json = JSON.parse(body);
          data.id = json.id;
          data.name = json.name;
          callback(null, data);
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

    res.render('layouts/main', {
      info: data
    });
  });
});


app.listen(app.get('port'), function(){
	console.log('Node app is running on port',app.get('port'));
});
*/

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.get('/', function(request, response) {
  response.render('layouts/main');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
