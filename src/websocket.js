const canvas = document.getElementById("grid");
const context = canvas.getContext("2d");

//Paramètres de la grid
const tileWidth = 40;
const tileHeight = 40;
const gridRows = 10;
const gridCols = 10;

//défiinir chaque variable
//let boost = 1>>2

//map de 10 par 10
let map = [
  1,1,1,1,1,1,1,1,1,1,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
]



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
  let spawnPosition = 5;
  //update le nombre de l'array map à 2 pour représenter le joueur:
  //2 représente le joueur 1.
  map[spawnPosition] = 2;
}

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
      alert("Game Over! You touched the ghost. Score: " + playerScore);
      // Optionally, you can reset the game or perform other actions
      // Example: location.reload(); // Reloads the page to restart the game
      return;
    }

    // Move the player
    map[playerPosition] &= ~PLAYER; // Clear the player's current position
    map[newposition] |= PLAYER; // Set the player's new position

  }
}
//export de moveplayer pour faire marcher les boutons de controles dans websocket.js

//on spawn le joueur au début de la partie.
spawnPlayer();

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
                    let hautcontrol = "haut";
                    var sendControl = {
                      message: hautcontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowDown':
                    let bascontrol = "bas";
                    var sendControl = {
                      message: bascontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowLeft':
                    let gauchecontrol = "gauche";
                    var sendControl = {
                      message: gauchecontrol
                    };
                    var jsonControl = JSON.stringify(sendControl);
                    ws.send(jsonControl);
                    break;

                  case 'ArrowRight':
                    let droitecontrol = "droite";
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
              console.log("map websocket updated")
            } else {}

            //on vérifie si le message correspond à un controle
            if (parseControl.message == "haut"){
              movePlayer(-10);
            } else if (parseControl.message == "gauche"){
              movePlayer(-1);
            } else if (parseControl.message == "droite"){
              movePlayer(1);
            } else if (parseControl.message == "bas"){
              movePlayer(10);
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
              console.log("loop")
            }, 1000);
          }
          sendMapEvery100ms();

// Ghost
const WALL = 1;
const EMPTY = 0;
const PLAYER = 2;
const GHOST = 4;


// Ghost
const spawnGhost = () => {
  // Choose a random position for the ghost
  let ghostPosition = Math.floor(Math.random() * (gridRows * gridCols));
  while (map[ghostPosition] !== EMPTY) {
    // Ensure the ghost doesn't spawn on a wall or player
    ghostPosition = Math.floor(Math.random() * (gridRows * gridCols));
  }

  // Update the map to include the ghost
  map[ghostPosition] |= GHOST;
}

// ...
const moveGhosts = () => {
  for (let i = 0; i < map.length; i++) {
    if (map[i] & GHOST) {
      // If the current position contains a ghost, move it one step
      map[i] &= ~GHOST; // Clear the ghost's current position
      let randomDirection = Math.floor(Math.random() * 4); // 0: up, 1: down, 2: left, 3: right

      // Calculate the new position based on the random direction
      let newPosition;
      switch (randomDirection) {
        case 0:
          newPosition = i - gridCols; // Move up
          break;
        case 1:
          newPosition = i + gridCols; // Move down
          break;
        case 2:
          newPosition = i - 1; // Move left
          break;
        case 3:
          newPosition = i + 1; // Move right
          break;
        default:
          newPosition = i; // No movement
      }

      // Check if the new position is valid before moving the ghost
      if (newPosition >= 0 && newPosition < map.length && !(map[newPosition] & WALL)) {
        // Set the new position for the ghost
        map[newPosition] |= GHOST;

        // Check for collisions with the player
        if (map[newPosition] & PLAYER) {
          // Game over logic
          alert("Game Over! The ghost caught you.");
          // Optionally, you can reset the game or perform other actions
          // Example: location.reload(); // Reloads the page to restart the game
          return;
        }
      } else {
        // Restore the ghost to its original position if the new position is invalid
        map[i] |= GHOST;
      }
      break; // Break the loop after moving one ghost to avoid moving multiple ghosts in the same iteration
    }
  }
}

// Spawn initial ghosts
spawnGhost();

// Move ghosts every 1000ms (1 second)
setInterval(moveGhosts, 1000);