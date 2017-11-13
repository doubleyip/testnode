console.log('Version -0.0014');

var GlobalAccountID;
// bad idea^ 

function processUser(){
    var parameters = window.location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    l = unescape(temp[1]);
    //temp = parameters[1].split("=");
    //p = unescape(temp[1]);
    document.getElementById("write").innerHTML = l;
    //document.getElementById("pass").innerHTML = p;
    return l;
    //printStuff(l);
}

//function that fetchs the users id
function summonerLookUp(SUMMONER_NAME){
    console.log("in summoner lookup");
    //var SUMMONER_NAME = "";
    //SUMMONER_NAME = $("#userName").val();
    var acc_ID = "";
    //var API_KEY = "";
    //API_KEY = $("#API-Key").val();

    if (SUMMONER_NAME !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + SUMMONER_NAME + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                //getting data from json into local variables
                summonerID = json.id;
                var accountID = json.accountId;
                //setting global paramter
                GlobalAccountID= accountID;
                acc_ID = GlobalAccountID;
                return acc_ID;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //alert("error getting Summoner data!");
                window.location.href = "error.html";
            },
            async: false
            // SUPER DUPER BAD idea but ¯\_(ツ)_/¯
        });
    } else {}
    return acc_ID;
}

// This is the only function we call, This calls summoner lookup and lists the recent matches of a user
function printStuff(name){
    //var API_KEY = "";
    //API_KEY = $("#API-Key").val();
    //var name = processUser();
    console.log("calling summoner lookup");
    var Account_ID = summonerLookUp(name);
    if (Account_ID !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/'+ GlobalAccountID + '/recent?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                var matches = json.matches;
                //This is where we print the last 5 matches the summoner played
                var list = $('<ul>');
                $('body').append(list);
                matches.forEach(function(match, i){
                    if(i<5){
                    var val = match.gameId;
                     list.append($('<li>').text(`Match${i+1}:`).append($('<a>').attr('href', matchLookUp(val)).text(`${match.gameId}`)));
                     //list.on('click', 'href', matchLookUp(val));
                     //list.append($('<li>').text(`Match${i+1}:`).append($('<a>').on('click','matchLookUp(val)').text(`${match.gameId}`)));
                     //console.log(match.gameId);
                     //list.append($('<li><a href= "#">' + 'match${i+1}:' + 'match.gameId');

                    }
                    //list.on('click', 'href', function(){ matchLookUp(val)});
                })   
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            }
        });
    } else {}  
}


// This function calls display map, and plots a specific matchs kill coords
function matchLookUp(MATCH_NUM) {
    //var SUMMONER_NAME = "";
    //SUMMONER_NAME = $("#userName").val();

    //var API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    var Kill_coords = [];
    //console.log("hey");
    if (MATCH_NUM !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/' + MATCH_NUM + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                //Loop to search for a Champion kill, then store its coordinate
                for (i=0; i<json.frames.length; i++)
                {
                    for (j=0; j<json.frames[i].events.length; j++)
                    {
                        if (json.frames[i].events[j].type=='CHAMPION_KILL')
                        {
                            //console.log(json.frames[i].events[j].position.x);
                            var x = json.frames[i].events[j].position.x;
                            //console.log(x);
                            var y = json.frames[i].events[j].position.y;
                            Kill_coords.push([x, y]);
                        }
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!1");
            },
            ///////////////////////////////////////////////////////////
            async: false // This line is the holy grail of our project/
            //and still a SUPER DUPER BAD idea ¯\_(ツ)_/¯ //////////////
            ///////////////////////////////////////////////////////////
        });   
       displaymap(Kill_coords);
    } 
    else {}
}





function displaymap(Kill_coords){
    //console.log(Kill_coords);

    var cords = Kill_coords, 
    
    // Domain for the current Summoner's Rift on the match history website's mini-map
    
    domain = {
            min: {x: -570, y: -420},
            max: {x: 15220, y: 14980}
    },
    width = 512,
    height = 512,
    bg = "http://opgg-static.akamaized.net/images/maps/11.png",
    xScale, yScale, svg;

    color = d3.scale.linear()
    .domain([0, 3])
    .range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);

    xScale = d3.scale.linear()
  .domain([domain.min.x, domain.max.x])
  .range([0, width]);

    yScale = d3.scale.linear()
  .domain([domain.min.y, domain.max.y])
  .range([height, 0]);

    svg = d3.select("#map").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

    svg.append('image')
    .attr('xlink:href', bg)
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', width)
    .attr('height', height);

svg.append('svg:g').selectAll("circle")
    .data(cords)
    .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills');
    };
/*
function getAPI() {
    var x1 = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    //return x1;
    document.getElementById("api").innerHTML = x1;
    //console.log("hello from func");
}

//function that fetchs the users id
function summonerLookUp(){
    console.log("in summoner lookup");
	var SUMMONER_NAME = "";
    SUMMONER_NAME = processUser();
    console.log("SUMMONER_NAME");
    //SUMMONER_NAME = $("#userName").val();

    //var SUMMONER_NAME = document.getElementById("input").value;
    //SUMMONER_NAME = getQueryString()["SUMMONER_NAME"];
    //console.log("SUMMONER_NAME");
    //var summonerRegion =  document.getElementById("selectbox").value;

    var API_KEY = "";
    API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    //API_KEY = $("#API-Key").val();
    //var API_KEY = "";
    //API_KEY = RGAPI-c16c2668-0913-4123-9416-113f700d30f0;

    if (SUMMONER_NAME !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                //getting data from json into local variables
                summonerID = json.id;
                var accountID = json.accountId;
                //setting global paramter
                GlobalAccountID= accountID;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            },
            async: false
            // SUPER DUPER BAD idea but ¯\_(ツ)_/¯
        });


    } else {}
}

function printStuff(){
    console.log("first");
    var API_KEY = "";
    API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    //API_KEY = $("#API-Key").val();
    console.log("calling summoner lookup");
    summonerLookUp();

    //console.log(GlobalAccountID);
    if (GlobalAccountID !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/'+ GlobalAccountID + '/recent?api_key=' + API_KEY,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                //getting data from json into local variables
                //console.log(json);
                
                var matches = json.matches;

                //console.log(matches);
                //writing to website this shit
                var list = $('<ul>');
                $('body').append(list);
                matches.forEach(function(match, i){
                    if(i<5){
                     list.append($('<li>').text(`Match${i+1}:`).append($('<a>').attr('href', match.gameId).text(`${match.gameId}`)));
                    }
                })




                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            }
        });


    } else {}


    //});
    
}






//var Kill_coords = [];

function matchLookUp() {
    var SUMMONER_NAME = "";
    //SUMMONER_NAME = $("#userName").val();
    SUMMONER_NAME = processUser();

    var API_KEY = "";
    API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    //API_KEY = $("#API-Key").val();
    var Kill_coords = [];
    
    if (SUMMONER_NAME !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/2612838793' + '?api_key=' + 'RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                //Loop to search for a Champion kill, then store its coordinate
                for (i=0; i<json.frames.length; i++)
                {
                	for (j=0; j<json.frames[i].events.length; j++)
                	{
                		if (json.frames[i].events[j].type=='CHAMPION_KILL')
                		{
                			//console.log(json.frames[i].events[j].position.x);
                			var x = json.frames[i].events[j].position.x;
                			//console.log(x);
                			var y = json.frames[i].events[j].position.y;
                			Kill_coords.push([x, y]);
                		}
                	}
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            },
            ///////////////////////////////////////////////////////////
            async: false // This line is the holy grail of our project/
            //and still a SUPER DUPER BAD idea ¯\_(ツ)_/¯ //////////////
            ///////////////////////////////////////////////////////////
        });
        //console.log("Finished");
        
        
        //console.log(Kill_coords);
        //var test = [[250,250]];
        //displaymap(test);
        //console.log(a[3]);
       // console.log(a.length);
       displaymap(Kill_coords);


    } else {}
}





function displaymap(Kill_coords){
	//console.log(Kill_coords);

var cords = Kill_coords, //[
        //[561 ,581]
    //],
    // Domain for the current Summoner's Rift on the match history website's mini-map
    
    domain = {
            min: {x: -570, y: -420},
            max: {x: 15220, y: 14980}
    },
    width = 512,
    height = 512,
    bg = "http://opgg-static.akamaized.net/images/maps/11.png",
    xScale, yScale, svg;

color = d3.scale.linear()
    .domain([0, 3])
    .range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);

xScale = d3.scale.linear()
  .domain([domain.min.x, domain.max.x])
  .range([0, width]);

yScale = d3.scale.linear()
  .domain([domain.min.y, domain.max.y])
  .range([height, 0]);

svg = d3.select("#map").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

svg.append('image')
    .attr('xlink:href', bg)
    .attr('x', '0')
    .attr('y', '0')
    .attr('width', width)
    .attr('height', height);

svg.append('svg:g').selectAll("circle")
    .data(cords)
    .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills');
    };

*/