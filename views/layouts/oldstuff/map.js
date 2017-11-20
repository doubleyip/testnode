console.log('Version -0.00270');

var GlobalAccountID;
var GlobalRecentMatches = [];
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
                window.location.href = "error.html";
                //alert("error getting Summoner data!");
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
        //matchLookUp(match_n);
        console.log("test");
        //summonerLookUp("test");
    };
    document.body.appendChild(button);
    //button.
    //document.body.
}


// This is the only function we call, This calls summoner lookup and lists the recent matches of a user
function printStuff(name){
    //var API_KEY = "";
    //API_KEY = $("#API-Key").val();
    console.log("calling summoner lookup");
    var Account_ID = summonerLookUp(name);
    if (Account_ID !== "") {
        //console.log("hi");
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
                    //if(i<5){
                    GlobalRecentMatches.push(match.gameId);
                    createButton(function(){matchLookUp(match.gameId);}, match.gameId);
                    //console.log("He1");
                //}
            })
                // var list = $('<ul>');
                // $('body').append(list);
                // matches.forEach(function(match, i){
                //     if(i<5){
                //      list.append($('<li>').text(`Match${i+1}:`).append($('<a>').attr('href', match.gameId).text(`${match.gameId}`)));
                //     }
                // })   
                createButton(function(){multiMatchLookUp(GlobalRecentMatches);}, 'Multi-Map');
                createButton(function(){multiCSGraph(GlobalRecentMatches);}, 'Multi-CS-Graph');
                MultiKDA(GlobalRecentMatches);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.location.href = "error.html";
                //alert("error getting Summoner data!1");
            }
        });
    } else {}  
    
}

function MultiKDA(RECENT_MATCHES){
    console.log("Entered MultiKDA");
    var currID = GlobalAccountID;
    var dataKills = 0;
    var dataDeaths = 0;
    var dataAssists = 0;
    var winCount = 0;
    var lossCount = 0;


    for(m = 0; m<RECENT_MATCHES.length;m++)  {
        var participantID = 'empty';
        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matches/' + RECENT_MATCHES[m] + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                
                // find participant id
                for (i=0; i<json.participantIdentities.length; i++)
                {
                    if (json.participantIdentities[i].player.accountId == currID)
                    {
                        participantID = json.participantIdentities[i].participantId;
                        console.log(participantID);
                    }
    

                }
                for (i=0; i<json.participants.length; i++)
                {
                    if (json.participants[i].participantId == participantID)
                    {
                        dataKills += json.participants[i].stats.kills;
                        dataDeaths += json.participants[i].stats.deaths;
                        dataAssists += json.participants[i].stats.assists;

                        if (json.participants[i].stats.win){
                            winCount++;
                        }
                        else{
                            lossCount++;
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

    dataKills /= 20;
    dataDeaths /= 20;
    dataAssists /= 20;


    var data = [{
        value: winCount,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Win"
    }, {
        value: lossCount,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Loss"
    }];

    var ctx = document.getElementById("winlossChart").getContext("2d");

    

    var myNewChart = new Chart(ctx).Pie(data);
    console.log('end of print pie');

    var optionsPie = {
            tooltipEvents: [],
            showTooltips: true,
            onAnimationComplete: function() {
                this.showTooltip(this.segments, true);
            },
            tooltipTemplate: "<%= label %> - <%= value %>"
        };

    var kdadata = [{
    value: dataDeaths,
    color: "#F7464A",
    highlight: "#FF5A5E",
    label: "Deaths",
    labelColor: 'white',
    labelFontSize: '16'
}, {
    value: dataKills,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "Kills",
    labelColor: 'white',
    labelFontSize: '16'
}, {
    value: dataAssists,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "Assists",
    labelColor: 'white',
    labelFontSize: '16'
}];

var ctx2 = document.getElementById("kdaChart").getContext("2d");

    

    var myNewChart2 = new Chart(ctx2).Pie(kdadata,optionsPie);
}

function multiCSGraph(RECENT_MATCHES){
    console.log("Entered multiCSGraph");
    var currID = GlobalAccountID;
    var labelsTemp = [];
    var dataTempArray = [];
    var dataTemp = 0;

    for(m = 0; m<RECENT_MATCHES.length;m++)  {
        var participantID = 'empty';
        $.ajax({
            url: 'https://na1.api.riotgames.com/lol/match/v3/matches/' + RECENT_MATCHES[m] + '?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0',
            type: 'GET',
            dataType: 'json',
            data: {
            },
            success: function (json) {
                
                // find participant id
                for (i=0; i<json.participantIdentities.length; i++)
                {
                    if (json.participantIdentities[i].player.accountId == currID)
                    {
                        participantID = json.participantIdentities[i].participantId;
                        console.log(participantID);
                    }
    

                }
                for (i=0; i<json.participants.length; i++)
                {
                    if (json.participants[i].participantId == participantID)
                    {
                        dataTemp = json.participants[i].stats.totalMinionsKilled;
                        console.log(dataTemp);
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

        labelsTemp.push(m+1);
        dataTempArray.push(dataTemp);


    }

    var chartData = {
    labels: labelsTemp,
    datasets: [
        {
            fillColor: "#79D1CF",
            strokeColor: "#79D1CF",
            data: dataTempArray
        }
    ]
};

var ctx = document.getElementById("myChart1").getContext("2d");
var myLine = new Chart(ctx).Line(chartData, {
    showTooltips: false,
    onAnimationComplete: function () {

        var ctx = this.chart.ctx;
        ctx.font = this.scale.font;
        ctx.fillStyle = this.scale.textColor
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        this.datasets.forEach(function (dataset) {
            dataset.points.forEach(function (points) {
                ctx.fillText(points.value, points.x, points.y - 10);
            });
        })
    }
});
}
function multiMatchLookUp(RECENT_MATCHES){
    console.log("Entered multiMatchLookUp");
    var multiKill_coordsRED = [];
    var multiKill_coordsBLUE = [];
    
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
                            if(participantID > 4 ){
                                 multiKill_coordsBLUE.push([x, y]);
                             }
                             else{
                                multiKill_coordsRED.push([x, y]);
                             }

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
    displaymap(multiKill_coordsRED, multiKill_coordsBLUE);
}



// This function calls display map, and plots a specific matchs kill coords
function matchLookUp(MATCH_NUM) {
    //var SUMMONER_NAME = "";
    //SUMMONER_NAME = $("#userName").val();

    //var API_KEY = "RGAPI-c16c2668-0913-4123-9416-113f700d30f0";
    var Kill_coordsRED = [];
    var Kill_coordsBLUE = [];
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
                            if(participantID > 4 ){
                                 Kill_coordsBLUE.push([x, y]);
                             }
                             else{
                                Kill_coordsRED.push([x, y]);
                             }
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
       displaymap(Kill_coordsRED, Kill_coordsBLUE);
    } 
    else {}
}




function displaymap(Kill_coordsRED, Kill_coordsBLUE){
    //console.log(Kill_coords);


    var cordsRED = Kill_coordsRED,
    cordsBLUE = Kill_coordsBLUE,
    
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
        .data(cordsBLUE)
        .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills')
        .style("fill", "blue")
        .style("opacity", 0.7)
        .style("stroke", "black");
    

    
    svg.append('svg:g').selectAll("circle")
        .data(cordsRED)
        .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills')
        .style("fill", "red")
        .style("opacity", 0.7)
        .style("stroke", "black");
    

   
}
