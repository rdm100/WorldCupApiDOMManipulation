var app = function(){
  var url = 'http://api.football-data.org/v1/competitions/467/teams';
  makeRequest(url, requestCompleteForTeams);
}

var makeRequest = function(url, callback){
  //create a new XMLHttpRequest object
  var request = new XMLHttpRequest();
  //set the type of request we want with the url we want to call
  request.open("GET", url);

  request.setRequestHeader("X-Auth-Token", "");//insert your api key to use
  //set the callback we want it to use when it has completed the call
  request.addEventListener('load', callback);
  //send the request!
  request.send();
}

const requestCompleteForTeams = function(){
//this will be the request object itself
if(this.status !== 200) return;
//grab the response text
const jsonString = this.responseText;
const teamsData = JSON.parse(jsonString);

  console.log(teamsData);
  populateSelectTeams(teamsData);
  getTeamListener(teamsData);
}

const populateSelectTeams = function(teamsData){
  const div = document.getElementById('main');
  const h1 = document.createElement('h1');
  h1.innerText = `Teams`;
  const select = document.createElement('select');
  teamsData.teams.forEach(function(team, index){
    let option = document.createElement('option');
    option.innerText = team.name
    option.value = index
    select.appendChild(option);
  })
  div.appendChild(h1);
  div.appendChild(select);
};

const getTeamListener = function(teamsData){
  const selected = document.querySelector('select');
  selected.addEventListener('change', function(){
    let team = teamsData.teams[this.value];
    save(team);
    renderTeamDetails(team);
    makeRequestForPlayersData(team);
    makeRequestForFixturesData(team);
  })
}

const renderTeamDetails = function(team){
  console.log(team);
  const div = document.querySelector('#team-details');
  clearContent(div);
  const name = document.createElement('p');
  name.innerText = `Name: ${team.name}`;
  const code = document.createElement('p');
  code.innerText = `Short Name: ${team.code}`;
  const img = document.createElement('img');
  img.src = team.crestUrl;
  img.alt = team.name;
  div.appendChild(name);
  div.appendChild(code);
  div.appendChild(img);
};


const makeRequestForPlayersData = function(team){
  const url = team._links.players.href;
  makeRequest(url, requestCompleteForPlayers);
}

const requestCompleteForPlayers = function(){
if(this.status !== 200) return;

const jsonString = this.responseText;
const playersData = JSON.parse(jsonString);

populatSelectPlayer(playersData);
getPlayerListener(playersData);
};

const populatSelectPlayer = function(playersData){
  const div = document.querySelector('#players');
  clearContent(div);
  const h1 = document.createElement('h1');
  h1.innerText = `Players`;
  const select = document.createElement('select');
  select.classList.add('player-select');
  playersData.players.forEach(function(player, index){
    const option = document.createElement('option');
    option.innerText = player.name;
    option.value = index;
    select.appendChild(option);
  })
  div.appendChild(h1);
  div.appendChild(select);
}

const getPlayerListener = function(playersData){
  const selected = document.querySelector('.player-select');
  selected.addEventListener('change', function(){
    let player = playersData.players[this.value];
    // save(player);
    console.log(player)
    renderPlayerDetails(player);
  })
}

const renderPlayerDetails = function(player){
  const div = document.querySelector('#player-details');
  clearContent(div);
  const playerInfo = document.createElement('ul');
  const nameLi = document.createElement('li');
  nameLi.innerText = `Player Name: ${player.name}`;
  const positionLi = document.createElement('li');
  positionLi.innerText = `Player Position: ${player.position}`;
  const jerseyNumberLi = document.createElement('li');
  jerseyNumberLi.innerText = `Jersey Number: ${player.jerseyNumber}`;
  const nationLi = document.createElement('li');
  nationLi.innerText = `Nationality: ${player.nationality}`;
  playerInfo.appendChild(nameLi);
  playerInfo.appendChild(positionLi);
  playerInfo.appendChild(jerseyNumberLi);
  playerInfo.appendChild(nationLi);
  div.appendChild(playerInfo);
}

const makeRequestForFixturesData = function(team){
  const url = team._links.fixtures.href;
  makeRequest(url, requestCompleteForFixtures);
}

const requestCompleteForFixtures = function(){
if(this.status !== 200) return;

const jsonString = this.responseText;
const fixturesData = JSON.parse(jsonString);

populatSelectFixture(fixturesData);
getFixtureListener(fixturesData);
};

const populatSelectFixture = function(fixturesData){
  // console.log(FixturesData);
  const div = document.getElementById('fixtures');
  clearContent(div);
  const h1 = document.createElement('h1');
  h1.innerText = `Fixtures`;
  const select = document.createElement('select');
  select.classList.add('fixture-select');
  fixturesData.fixtures.forEach(function(fixture, index){
    var option = document.createElement('option');
    option.innerText = `Matchday ${fixture.matchday}`;
    option.value = index;
    select.appendChild(option);
  });
div.appendChild(h1);
div.appendChild(select);
}

const getFixtureListener = function(fixturesData){
  console.log(fixturesData);
  const selected = document.querySelector('.fixture-select');
  selected.addEventListener('change', function(){
    let fixture = fixturesData.fixtures[this.value];
    // save(player);
    console.log(fixture);
    renderFixtureDetails(fixture);
  })
}

const renderFixtureDetails = function(fixtureData){
  const div = document.querySelector('#fixtures');
  // clearContent(div);
  const fixtureInfo = document.createElement('ul');
  const matchDateLi = document.createElement('li');
  matchDateLi.innerText = `Matchdate: ${fixtureData.date}`;
  const teamsPlayingLi = document.createElement('li');
  teamsPlayingLi.innerText = `Teams Playing: ${fixtureData.homeTeamName} Vs ${fixtureData.awayTeamName}`;
  fixtureInfo.appendChild(matchDateLi);
  fixtureInfo.appendChild(teamsPlayingLi);
  div.appendChild(fixtureInfo);
}

const save = function(data){
  const jsonString = JSON.stringify(data);
  localStorage.setItem('data', jsonString);
}

const clearContent = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

window.addEventListener('load', app);