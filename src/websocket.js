
import { movePlayer } from "./grid";

let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);

       

              //Bouton haut touche clavier
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

          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };

