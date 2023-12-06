const canvas = document.getElementById("grid");
const context = canvas.getContext("2d");

//Paramètres de la grid
const tileWidth = 26;  // Adjusted tile width to fit the larger grid within the canvas
const tileHeight = 26; // Adjusted tile height to fit the larger grid within the canvas
const gridRows = 15;   // Updated grid rows to match the larger map
const gridCols = 15;   // Updated grid columns to match the larger map


//défiinir chaque variable
const WALL = 1;
const EMPTY = 0;
const PLAYER = 2;
const GHOST = 4;

//séléction du joueur
const pacmanButton = document.getElementById("pacman");
const ghostButton = document.getElementById("ghost");
pacmanButton.addEventListener("click", selectPlayer);
ghostButton.addEventListener("click", selectGhost);
let PlayerControl; // Declare the PlayerControl variable outside the functions
function selectPlayer() {
  PlayerControl = "pacman";
  console.log(PlayerControl);
}
function selectGhost() {
  PlayerControl = "ghost";
  console.log(PlayerControl);
}


function sendMap() {
  var jsonmap = {
    message: map
  };
  var sendmap = JSON.stringify(jsonmap);
  ws.send(sendmap);
}
//démarrage du jeu
const startButton = document.getElementById("start");
startButton.addEventListener("click", sendMap);

//save de la map 10 par 10 qui marche
// let map = [
//   1,1,1,1,1,1,1,1,1,1,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,0,0,0,
// ]

//map de 15 par 15
let map = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];



function drawMap(newmap) {
  // Effacer le canvas avant de redessiner
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let eachRow = 0; eachRow < gridRows; eachRow++) {
    for (let eachCol = 0; eachCol < gridCols; eachCol++) {
      let arrayIndex = eachRow * gridRows + eachCol;

      if (newmap[arrayIndex] === 1) {
        context.fillStyle = "lightgrey";
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      } else if (newmap[arrayIndex] === 0) {
        context.fillStyle = "black";
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }else if (newmap[arrayIndex] === 4) {
          context.fillStyle = "red"; // Ghost
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }
      else if (newmap[arrayIndex] === 16) {
        context.fillStyle = "green"; // Ghost
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }else {
        context.fillStyle = "yellow";
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }
    }
  }
}

//PLAYER
const spawnPlayer = () => {
  //position de départ
  let spawnPosition = 20;
  map[spawnPosition] = PLAYER;
}
spawnPlayer();

const getPlayerPosition = () => {
  let playerIndex = map.indexOf(PLAYER);
  return playerIndex;
}

const movePlayer = (move) => {
  let playerPosition = getPlayerPosition();
  let newposition = playerPosition + move;
  // Check if the new position is valid before moving the player
  if (newposition >= 0 && newposition < map.length && !(map[newposition] & WALL)) {
    // Check for collisions with the ghost
    if (map[newposition] & GHOST) {
      // Game over logic
      alert("Game Over! You touched the ghost.");
      // Optionally, you can reset the game or perform other actions
      // Example: location.reload(); // Reloads the page to restart the game
      return;
    }
    // Move the player
    map[playerPosition] &= ~PLAYER; // Clear the player's current position
    map[newposition] |= PLAYER; // Set the player's new position
  }
}


//GHOSTS
const spawnGhost = () => {
  //position de départ
  let ghostPosition = 88;
   map[ghostPosition] |= GHOST;
}
spawnGhost();

const getGhostPosition = () => {
  let ghostIndex = map.indexOf(GHOST);
  return ghostIndex;
}

const moveGhost = (move) => {
  let ghostPosition = getGhostPosition();
  let newposition = ghostPosition + move;
    // Move the ghost
    map[ghostPosition] &= ~GHOST; // Clear the GHOST's current position
    map[newposition] |= GHOST; // Set the GHOST's new position
  }

let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);

              //Boutons touches clavier
              document.addEventListener('keydown', function(event) {
                switch(event.key) {
                  case 'ArrowUp':
                    let hautcontrol = "haut"+PlayerControl;
                    var sendControl = {
                      message: hautcontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowDown':
                    let bascontrol = "bas"+PlayerControl;
                    var sendControl = {
                      message: bascontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowLeft':
                    let gauchecontrol = "gauche"+PlayerControl;
                    var sendControl = {
                      message: gauchecontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowRight':
                    let droitecontrol = "droite"+PlayerControl;
                    var sendControl = {
                      message: droitecontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;
                }
              });

                              // Écouteur d'événements pour la touche "S"
                // document.addEventListener('keydown', function(event) {
                //   if (event.key === 's' || event.key === 'S') {
                //     // Fonction pour créer et envoyer la carte via WebSocket
                //     function sendMapViaWebSocket() {
                //       var jsonmap = {
                //         message: map
                //       };
                //       var sendmap = JSON.stringify(jsonmap);
                //       ws.send(sendmap);
                //
                //     }
                //
                //     // Appel de la fonction pour envoyer la carte via WebSocket
                //     sendMapViaWebSocket();
                //   }
                // });

          };




          ws.onclose = function (event) {
            console.log("Disconnected from websocket !");
          };
          ws.onmessage = function (event) {
            //on récupère le message (controle) reçu
            console.log("websocket:"+event.data);
            var parseControl = JSON.parse(event.data);

            // récupération de la map
            var newmap = JSON.parse(event.data);
            if (Array.isArray(newmap.message)) {
              drawMap(newmap.message);
            } else {}

            //on vérifie si le message correspond à un controle pour pacman
            if (parseControl.message == "hautpacman"){
              movePlayer(-15);
              sendMap();
            } else if (parseControl.message == "gauchepacman"){
              movePlayer(-1);
              sendMap();
            } else if (parseControl.message == "droitepacman"){
              movePlayer(1);
              sendMap();
            } else if (parseControl.message == "baspacman"){
              movePlayer(15);
              sendMap();
            }

            //on vérifie si le message correspond à un controle pour ghost
            if (parseControl.message == "hautghost"){
              moveGhost(-15);
              sendMap();
            } else if (parseControl.message == "gaucheghost"){
              moveGhost(-1);
              sendMap();
            } else if (parseControl.message == "droiteghost"){
              moveGhost(1);
              sendMap();
            } else if (parseControl.message == "basghost"){
              moveGhost(15);
              sendMap();
            }

            // newmap = map + move du joueur


          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };



          


