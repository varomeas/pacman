
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
      } else {
        context.fillStyle = "blue";
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

  // Vérifier si la nouvelle position est valide avant de déplacer le joueur
  if (newposition >= 0 && newposition < map.length && map[newposition] !== 1) {
    // Réinitialiser l'emplacement actuel du joueur à 0 pour le vider
    map[playerPosition] = 0;
    // Déplacer le joueur
    map[newposition] = 2;
  }
}
//export de moveplayer pour faire marcher les boutons de controles dans websocket.js

//on spawn le joueur au début de la partie.
spawnPlayer();





//Fonction écoute de la map et envoi si pas dispo
// Variable pour suivre l'état d'envoi de la map
let mapSent = false;

function listenAndSendMap() {
  let mapReceived = false; // Indique si la map a été reçue
  let timeout = 5000; // Durée de l'attente en millisecondes (5 secondes)

  const timer = setTimeout(() => {
    if (!mapReceived) {
      console.log("La map n'a pas été reçue dans les 5 secondes. Création et envoi de la map...");
      sendMap(); // Envoi de la map
    }
  }, timeout);

  // Écoute des messages du WebSocket
  ws.onmessage = function (event) {
    var newmap = JSON.parse(event.data);

    if (Array.isArray(newmap.message)) {
      console.log("Map reçue du WebSocket");
      mapReceived = true; // Indique que la map a été reçue
      clearTimeout(timer); // Annule le timeout car la map a été reçue
      mapSent = false; // Réinitialise la variable pour permettre l'envoi de la prochaine map
      drawMap(newmap.message); // Dessiner la nouvelle map reçue
    }
    // Autres traitements...
  };
}

// Fonction pour envoyer la map sur le WebSocket
function sendMap() {
  // Votre logique pour créer et envoyer la map via WebSocket
  var jsonmap = {
    message: map
  };
  var sendmap = JSON.stringify(jsonmap);
  ws.send(sendmap);
  mapSent = true; // Mettre à jour l'état pour indiquer que la map a été envoyée
}

// Appel de la fonction pour commencer à écouter le WebSocket







let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);

            listenAndSendMap();

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
            var parseControl = JSON.parse(event.data);
            
            // récupération de la map
            var newmap = JSON.parse(event.data);
            if (Array.isArray(newmap.message)) {
              drawMap(newmap.message);
              console.log("map websocket updated")
            } else {}

            //draw la map si elle n'a pas été envoyé, sinon affiche la
            // Variable pour suivre l'état d'envoi de la map
            let mapSent = false;

            function myFunction() {
              if (!mapSent) {
                // Votre logique pour créer et envoyer la map via WebSocket
                var jsonmap = {
                  message: map
                };
                var sendmap = JSON.stringify(jsonmap);
                ws.send(sendmap);

                // Mettre à jour l'état pour indiquer que la map a été envoyée
                mapSent = true;
              }
            }

            ws.onmessage = function (event) {
              var newmap = JSON.parse(event.data);

              if (Array.isArray(newmap.message)) {
                drawMap(newmap.message);
                console.log("map websocket updated");

                // Réinitialiser l'état pour permettre l'envoi de la prochaine map
                mapSent = false;
              }
              // Autres traitements...
            };

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



