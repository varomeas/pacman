const canvas = document.getElementById("grid");
const context = canvas.getContext("2d");

//Paramètres de la grid
const tileWidth = 26;  // Adjusted tile width to fit the larger grid within the canvas
const tileHeight = 26; // Adjusted tile height to fit the larger grid within the canvas
const gridRows = 15;   // Updated grid rows to match the larger map
const gridCols = 15;   // Updated grid columns to match the larger map


//défiinir chaque variable
//let boost = 1>>2


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
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,      
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                              
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0                           
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

//avoir le joueur en numéro 2 dans le tableau map pourrait créer des pb
//je pense qu'il faudrait avoir 2 couches: une constante map avec des 0 ou 1
//une autre couche "joueurs" qui vérifie les murs et chemins.

//player
const spawnPlayer = () => {
  //position de départ
  let spawnPosition = 11;
  //update le nombre de l'array map à 2 pour représenter le joueur:
  //2 représente le joueur 1.
  map[spawnPosition] = 2;
}

//on spawn le joueur au début de la partie.
spawnPlayer();

const getPlayerPosition = () => {
  let playerIndex = map.indexOf(2);
  //le player position est un index (0=première case de map)
  //console.log("playerposition"+playerIndex);
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


//Meme fonction pour les ghosts

const getGhostPosition = () => {
  let ghostIndex = map.indexOf(4);
  //le ghost position est un index (0=première case de map)
  //console.log("ghostposition"+ghostIndex);
  return ghostIndex;
}


const moveGhost = (move) => {
  let ghostPosition = getGhostPosition();
  let newposition = ghostPosition + move;
    // Move the player
    map[ghostPosition] &= ~GHOST; // Clear the GHOST's current position
    map[newposition] |= GHOST; // Set the GHOST's new position

  }

//export de moveplayer pour faire marcher les boutons de controles dans websocket.js



//todo:
//créer un constructeur pour les murs, vérifier la collision



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
              movePlayer(-10);
            } else if (parseControl.message == "gauchepacman"){
              movePlayer(-1);
            } else if (parseControl.message == "droitepacman"){
              movePlayer(1);
            } else if (parseControl.message == "baspacman"){
              movePlayer(10);
            }

            //on vérifie si le message correspond à un controle pour ghost
            if (parseControl.message == "hautghost"){
              moveGhost(-10);
            } else if (parseControl.message == "gaucheghost"){
              moveGhost(-1);
            } else if (parseControl.message == "droiteghost"){
              moveGhost(1);
            } else if (parseControl.message == "basghost"){
              moveGhost(10);
            }

            // newmap = map + move du joueur


          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };



          function sendMapEvery100ms() {
            setInterval(() => {
              var jsonmap = {
                message: map
              };
              var sendmap = JSON.stringify(jsonmap);
              ws.send(sendmap);
            }, 300);
          }
          sendMapEvery100ms();

// Ghost
const WALL = 1;
const EMPTY = 0;
const PLAYER = 2;
const GHOST = 4;


// Ghost
const spawnGhost = () => {

    //position de départ
    let ghostPosition = 88;
     map[ghostPosition] |= GHOST;
}

// Spawn initial ghosts
spawnGhost();

// Move ghosts every 1000ms (1 second)
setInterval(moveGhosts, 1000);