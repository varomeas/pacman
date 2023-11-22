
const canvas = document.getElementById("grid");
const context = canvas.getContext("2d");

//Paramètres de la grid
const tileWidth = 40;
const tileHeight = 40; 
const gridRows = 10;
const gridCols = 10;

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

const drawMap = () => {
  for(let eachRow = 0; eachRow < gridRows; eachRow++){
    for(let eachCol = 0; eachCol < gridCols; eachCol++){
      //on parcours chaque élément du tableau map
      let arrayIndex = eachRow * gridRows + eachCol;
      //on vérifie si l'élément est un 0(chemin), un 1(mur) ou autre(joueur)
      if(map[arrayIndex] === 1){
        //pour espacer les blocks, on fait tileWidth*eachCol pour créer un espace dans chaque block sur l'axe horizontal, puis pareil pour le vertical avec tileHeight*eachRow.
        //sans ce code, toutes les cases se retrouvent les une par dessu les autres.
        context.fillStyle="lightgrey";
        context.fillRect(tileWidth*eachCol,tileHeight*eachRow,tileWidth,tileHeight);
      } else if(map[arrayIndex] === 0) {
        context.fillStyle="black";
        context.fillRect(tileWidth*eachCol,tileHeight*eachRow,tileWidth,tileHeight);
      } else {
        context.fillStyle="red";
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
  let spawnPosition = 0;
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
//on spawn le joueur au début de la partie.
spawnPlayer();



//todo:
//créer un constructeur pour les murs, vérifier la collision