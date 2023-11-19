let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);

            //Bouton haut, envoi
            document.getElementById("haut").addEventListener("click", function (event) {
     
              let hautcontrol = "haut";
              var sendControl = {
                message: hautcontrol
              };
              var jsonControl = JSON.stringify(sendControl);
              ws.send(jsonControl);
              
              });

              //Bouton gauche, envoi
            document.getElementById("gauche").addEventListener("click", function (event) {
     
              let gauchecontrol = "gauche";
              var sendControl = {
                message: gauchecontrol
              };
              var jsonControl = JSON.stringify(sendControl);
              ws.send(jsonControl);
              
              });

              //Bouton droite, envoi
            document.getElementById("droite").addEventListener("click", function (event) {
     
              let droitecontrol = "droite";
              var sendControl = {
                message: droitecontrol
              };
              var jsonControl = JSON.stringify(sendControl);
              ws.send(jsonControl);
              
              });

              //Bouton bas, envoi
            document.getElementById("bas").addEventListener("click", function (event) {
     
              let bascontrol = "bas";
              var sendControl = {
                message: bascontrol
              };
              var jsonControl = JSON.stringify(sendControl);
              ws.send(jsonControl);
              
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
              console.log("le contrôle est haut")
            } else if (parseControl.message == "gauche"){
              console.log("le contrôle est gauche")
            } else if (parseControl.message == "droite"){
              console.log("le contrôle est droite")
            } else if (parseControl.message == "bas"){
              console.log("le contrôle est bas")
            }

          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };