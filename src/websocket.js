let ws = new WebSocket("ws://kevin-chapron.fr:8090/ws");
        ws.onopen = function (event) {
            //connexion à l'application pacmanmulti
            var app = {
              app: "pacmanmulti"
            }
            var jsonapp = JSON.stringify(app);
            ws.send(jsonapp);

            //test du control 1 avec bouton
            document.getElementById("test").addEventListener("click", function (event) {
     
              let testcontrol = "test du contrôle 1";
              var sendControl = {
                message: testcontrol
              };
              var jsonControl = JSON.stringify(sendControl);
              ws.send(jsonControl);
              
              });
          };
          ws.onclose = function (event) {
            console.log("Disconnected from websocket !");
          };
          ws.onmessage = function (event) {
            console.log("Message received from websocket : " + event.data);
          };
          ws.onerror = function (event) {
            console.log("Error Websocket : " + event.message);
          };