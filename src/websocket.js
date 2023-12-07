const canvas = document.getElementById("grid");
const context = canvas.getContext("2d");

//Paramètres de la grid
const tileWidth = 26;  // Adjusted tile width to fit the larger grid within the canvas
const tileHeight = 26; // Adjusted tile height to fit the larger grid within the canvas
const gridRows = 14;   // Updated grid rows to match the larger map
const gridCols = 14;   // Updated grid columns to match the larger map


//définir chaque variable
const WALL = 1;
const EMPTY = 0;
const PACMAN = 2;
const GHOST = 4;
const POINTS = 16;

//initialisation du compteur de score
let score = 0;


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
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
  1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1,
  1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
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
      } else if (newmap[arrayIndex] === 2) {
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
        alert("Game Over! You touched the ghost. Your Score: " + score);
        location.reload(); // Refresh the page to restart the game
      }else if (newmap[arrayIndex] === POINTS) { //Points
        context.fillStyle = "black"; //fond du point est noir
        context.fillRect(
            tileWidth * eachCol,
            tileHeight * eachRow,
            tileWidth,
            tileHeight
        );
        context.beginPath(); //le point est un cercle vert
        context.arc((tileWidth * eachCol)+tileWidth/2, (tileHeight * eachRow)+tileHeight/2, 5, 0, 2 * Math.PI)
        context.fillStyle = "green"
        context.fill()
        context.closePath();
      }else {
        context.fillStyle = "purple"; // autre
        context.fillRect(tileWidth * eachCol, tileHeight * eachRow, tileWidth, tileHeight);
      }
    }
  }
  drawScore()
}

const drawScore = () => {
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 25);
}

//PLAYER
const spawnPlayer = () => {
  //position de départ
  let spawnPosition = 15;
  map[spawnPosition] = PACMAN;
}
spawnPlayer();

//GHOSTS
const spawnGhost = () => {
  //position de départ
  let ghostPosition = 26;
  map[ghostPosition] |= GHOST;
}
spawnGhost();

//on met des points partout où les cases sont vides
const placePointsOnEmptySpaces = () => {
  for (let i = 0; i < map.length; i++) { //j'ai divisé par 4 parce que quand je les mets tous on se déconnecte du websocket
    if (map[i] === EMPTY) {
      map[i] = POINTS;
    }
  }
}

placePointsOnEmptySpaces()

const getPositionOf = (player) => {
  let index = map.indexOf(player);
  return index;
}

const moveTo = (player, move) => {
  let playerPosition = getPositionOf(player);
  let newposition = playerPosition + move;
  // Check if the new position is valid before moving the player
  if (newposition >= 0 && newposition < map.length && !(map[newposition] & WALL)) {
    // Si le joueur passe sur une case avec des points on augmente le score
    if(map[newposition] === 16){
      score += 10;
      map[newposition] = player;
    }
    // Quand le joueur passe sur la case du point, on met la case à vide


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
  document.addEventListener('keyup', function (event) {
    //Limiteur spam / délai entre les mouvements

    if (canSendMap) {
      canSendMap = false;
      setTimeout(() => {
        canSendMap = true;
      }, 300);


      //si le joueur est Pacman (hote), il fait ses mouvements en local et envoie la map aux autres joueurs.
      if (PlayerControl == PACMAN) {
        switch (event.key) {
          case 'ArrowUp':
            moveTo(PlayerControl, -14);
            break;

          case 'ArrowDown':
            moveTo(PlayerControl, 14);
            break;

          case 'ArrowLeft':
            moveTo(PlayerControl, -1);
            break;

          case 'ArrowRight':
            moveTo(PlayerControl, 1);
            break;
        }
        sendMap();
      } else {
        // si le joueur n'est pas PACMAN(hote), il envoit ses moves sur le websocket.
        switch (event.key) {
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
      }
    }

  });
};


ws.onclose = function (event) {
  console.log("Disconnected from websocket !");
  console.error(event)
};
ws.onmessage = function (event) {
  //on récupère le message (controle) reçu
  console.log("websocket:" + event.data);
  var parseControl = JSON.parse(event.data);

  // récupération de la map et update
  var newmap = JSON.parse(event.data);
  if (Array.isArray(newmap.message)) {
    map = newmap.message;
    drawMap(newmap.message);
  } else {}

  //si on est pacman, on écoute les move des phantomes, update et send.
  if(PlayerControl==PACMAN){

    if (parseControl.message == "haut4"){
      moveTo(GHOST, -15);
      sendMap();
    } else if (parseControl.message == "gauche4"){
      moveTo(GHOST, -1);
      sendMap();
    } else if (parseControl.message == "droite4"){
      moveTo(GHOST, 1);
      sendMap();
    } else if (parseControl.message == "bas4"){
      console.log("message est bas4, GHOST="+GHOST);
      moveTo(GHOST, 15);
      sendMap();
    }

  }

};
ws.onerror = function (event) {
  console.log("Error Websocket : " + event.message);
};
