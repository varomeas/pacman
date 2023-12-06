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
const PACMAN = 2;
const GHOST = 4;

//séléction du joueur
const pacmanButton = document.getElementById("pacman");
const ghostButton = document.getElementById("ghost");
pacmanButton.addEventListener("click", selectPlayer);
ghostButton.addEventListener("click", selectGhost);
let PlayerControl; // Declare the PlayerControl variable outside the functions
function selectPlayer() {
  PlayerControl = PACMAN;
  console.log(PlayerControl);
}
function selectGhost() {
  PlayerControl = GHOST;
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
  1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,
  1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,
  1,0,0,0,1,0,0,1,0,0,1,0,0,0,1,
  1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,1,1,1,1,1,0,0,1,
  1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,
  1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,
  1,0,1,1,0,1,1,1,0,0,0,1,0,0,1,
  1,0,1,1,0,0,0,1,1,1,0,0,0,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

function drawMap(newmap) {
  // Efface le canvas avant de redessiner
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let eachRow = 0; eachRow < gridRows; eachRow++) {
    for (let eachCol = 0; eachCol < gridCols; eachCol++) {
      let arrayIndex = eachRow * gridRows + eachCol;

      if (newmap[arrayIndex] === 1) {
        context.fillStyle = "rgb(43, 43, 220)"; //Mur
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      } else if (newmap[arrayIndex] === 2){
        context.fillStyle = "yellow";
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }
        else if (newmap[arrayIndex] === 0) {
        context.fillStyle = "black"; //Vide
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      } else if (newmap[arrayIndex] === 4) {
          context.fillStyle = "red"; // Ghost
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      } else if (newmap[arrayIndex] === 6) {
        context.fillStyle = "purple"; // Collision Pacman + Ghost GAME OVER
        alert("Game Over! You touched the ghost.");
        location.reload(); // Refresh the page to restart the game
      } else if (newmap[arrayIndex] === 16) {
        context.fillStyle = "green"; // Ghost
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }else {
        context.fillStyle = "purple"; // autre
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }
    }
  }
}

//PLAYER
const spawnPlayer = () => {
  //position de départ
  let spawnPosition = 16;
  map[spawnPosition] = PACMAN;
}
spawnPlayer();

//GHOSTS
const spawnGhost = () => {
  //position de départ
  let ghostPosition = 28;
   map[ghostPosition] |= GHOST;
}
spawnGhost();

  const getPositionOf = (player) => {
    let index = map.indexOf(player);
    return index;
  }

const moveTo = (player,move) => {
  let playerPosition = getPositionOf(player);
  let newposition = playerPosition + move;
  // Check if the new position is valid before moving the player
  if (newposition >= 0 && newposition < map.length && !(map[newposition] & WALL)) {
    // Check for collisions with the ghost
    
    // Move the player
    map[playerPosition] &= ~player; // Clear the player's current position
    map[newposition] |= player; // Set the player's new position
  }
}

let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);


            let canSendMap = true;
              //Boutons touches clavier
              document.addEventListener('keyup', function(event) {
                //Limiteur spam / délai entre les mouvements
                
                if (canSendMap) {
                  canSendMap = false;
                  setTimeout(() => {
                    canSendMap = true;
                  }, 300);

                  switch(event.key) {

                    case 'ArrowUp':
                      moveTo(PlayerControl,-15);
                      break;
  
                    case 'ArrowDown':
                      moveTo(PlayerControl,15);
                      break;
  
                    case 'ArrowLeft':
                      moveTo(PlayerControl,-1);
                      break;
  
                    case 'ArrowRight':
                      moveTo(PlayerControl,1);
                      break;
                  }
                  sendMap();
                }
                
              });
          };


          ws.onclose = function (event) {
            console.log("Disconnected from websocket !");
          };
          ws.onmessage = function (event) {
            //on récupère le message (controle) reçu
            console.log("websocket:"+event.data);
            var parseControl = JSON.parse(event.data);

            // récupération de la map et update
            var newmap = JSON.parse(event.data);
            if (Array.isArray(newmap.message)) {
              map = newmap.message;
              drawMap(newmap.message);
            } else {}

          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };



          


