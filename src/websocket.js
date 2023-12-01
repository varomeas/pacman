
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
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,1,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,0,
]

const updateAll = () => {
  drawMap();
  window.requestAnimationFrame(updateAll);
}

window.onload = () => {
  window.requestAnimationFrame(updateAll);
}

function drawMap(newmap){
  for(let eachRow = 0; eachRow < gridRows; eachRow++){
    for(let eachCol = 0; eachCol < gridCols; eachCol++){
      //on parcours chaque élément du tableau map
      let arrayIndex = eachRow * gridRows + eachCol;
      //on vérifie si l'élément est un 0(chemin), un 1(mur) ou autre(joueur)
      if(newmap[arrayIndex] === 1){
        //pour espacer les blocks, on fait tileWidth*eachCol pour créer un espace dans chaque block sur l'axe horizontal, puis pareil pour le vertical avec tileHeight*eachRow.
        //sans ce code, toutes les cases se retrouvent les une par dessu les autres.
        context.fillStyle="lightgrey";
        context.fillRect(tileWidth*eachCol,tileHeight*eachRow,tileWidth,tileHeight);
      } else if(newmap[arrayIndex] === 0) {
        context.fillStyle="black";
        context.fillRect(tileWidth*eachCol,tileHeight*eachRow,tileWidth,tileHeight);
      } else {
        context.fillStyle="blue";
        context.fillRect(tileWidth*eachCol,tileHeight*eachRow,tileWidth,tileHeight);
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
  //on reset l'emplacement présent du joueur à 0 pour remettre un vide
  //avant de bouger le joueur
  map[playerPosition] = 0;
  //on bouge le joueur
  let newposition = playerPosition+move;
  map[newposition] = 2;
  //2 représente le joueur sur la map.
}
//export de moveplayer pour faire marcher les boutons de controles dans websocket.js
export {movePlayer};
export {map};
export {updateAll};
export {drawMap};
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
          };
          ws.onclose = function (event) {
            console.log("Disconnected from websocket !");
          };
          ws.onmessage = function (event) {
            //on récupère le message (controle) reçu
            console.log("websocket:"+event.data);
            var newmap = JSON.parse(event.data);  
            var parseControl = JSON.parse(event.data); 

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

            drawMap(newmap.message);

          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };

          function myFunction() {
            // Your code logic here
            var jsonmap = {
              message: map
            };
            var sendmap = JSON.stringify(jsonmap);
            ws.send(sendmap);
          }
          
          // Set the interval to run the function every 100 milliseconds
          setInterval(myFunction, 2000);
