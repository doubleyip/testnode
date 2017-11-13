function openWindow() {
  var win = window.open("about:blank", "", "width=800,height=600");
  setTimeout(function() {
    win.document.write("Hellou world!");
    win.document.close();
  }, 1000)
}

function UserAction() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/DGamesta?api_key=RGAPI-c16c2668-0913-4123-9416-113f700d30f0", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
}