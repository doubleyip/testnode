console.log('Version -0.00269');

var GlobalAccountID;
var GlobalRecentMatches = [];
// bad idea^ 

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
                alert("error getting Summoner data!");
            },
            async: false
            // SUPER DUPER BAD idea but ¯\_(ツ)_/¯
        });
    } else {}
    return acc_ID;
}

function createButton(func, match_n){
    var button = document.createElement("input");
    button.type = "button";
    button.value = match_n;
    
    button.onclick = function(){
        console.log("plz work");
        func();
        console.log("test");
        //summonerLookUp("test");
    };
    document.body.appendChild(button);
}


// This is the only function we call, This calls summoner lookup and lists the recent matches of a user
function printStuff(name){
    //var API_KEY = "";
    //API_KEY = $("#API-Key").val();
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
                matches.forEach(function(match, i){
                    if(i<5){
                        GlobalRecentMatches.push(match.gameId);
                        createButton(function(){matchLookUp(match.gameId);}, match.gameId);
                }
            })
                // var list = $('<ul>');
                // $('body').append(list);
                // matches.forEach(function(match, i){
                //     if(i<5){
                //      list.append($('<li>').text(`Match${i+1}:`).append($('<a>').attr('href', match.gameId).text(`${match.gameId}`)));
                //     }
                // })   

                createButton(function(){multiMatchLookUp(GlobalRecentMatches);}, 'Multi-Map');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("error getting Summoner data!");
            },

            async: false 
        });
    } else {}  

    console.log(GlobalRecentMatches);
    //multiMatchLookUp(GlobalRecentMatches);
}

function multiMatchLookUp(RECENT_MATCHES){
    console.log("Entered multiMatchLookUp");
    var multiKill_coords = [];
    
    var currID = GlobalAccountID;
    for(m = 0; m<RECENT_MATCHES.length;m++)  {
        var participantID = 'empty';
        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matches/' + RECENT_MATCHES[m] + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                //Loop to search for a Champion kill, then store its coordinate
                for (i=0; i<json.participantIdentities.length; i++)
                {
                    if (json.participantIdentities[i].player.accountId == currID)
                    {
                        participantID = json.participantIdentities[i].participantId;
                        console.log(participantID);
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

        console.log(participantID);
        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/' + RECENT_MATCHES[m] + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
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
                        if (json.frames[i].events[j].type=='CHAMPION_KILL' && json.frames[i].events[j].victimId == participantID)
                        {
                            //console.log(json.frames[i].events[j].position.x);
                            var x = json.frames[i].events[j].position.x;
                            //console.log(x);
                            var y = json.frames[i].events[j].position.y;
                            multiKill_coords.push([x, y]);
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
        
    } 
    console.log(multiKill_coords);
    displaymap(multiKill_coords);
}

// This function calls display map, and plots a specific matchs kill coords
function matchLookUp(MATCH_NUM) {
    //var SUMMONER_NAME = "";
    //SUMMONER_NAME = $("#userName").val();

    //var API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    var Kill_coords = [];
    var participantID = 'empty';
    var currID = GlobalAccountID;
    if (MATCH_NUM !== "") {

        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matches/' + MATCH_NUM + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                //Loop to search for a Champion kill, then store its coordinate
                for (i=0; i<json.participantIdentities.length; i++)
                {
                    if (json.participantIdentities[i].player.accountId == currID)
                    {
                        participantID = json.participantIdentities[i].participantId;
                        console.log(participantID);
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

        console.log(participantID);
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
                		if (json.frames[i].events[j].type=='CHAMPION_KILL' && json.frames[i].events[j].victimId == participantID)
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
  .range([height, 0 ]);

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
        .attr('class', 'kills')
        .style("fill", "red")
        .style("opacity", 0.5)
        .style("stroke", "black");
    };