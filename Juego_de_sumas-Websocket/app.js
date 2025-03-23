const WebSocket = require('ws');
const express = require('express');

const app = express('express'); // crea la app
const server = require('http').createServer(app);  //crear el server
const wss = new WebSocket.Server({server}); //crea el servidor de websocket

const port = 3000;
let sumaTotal = 0;

app.use(express.static('public')); //middleware para servir archivos estaticos

// evento que se ejecuta cuando se conecta un cliente
wss.on('connection', (ws) =>{
    console.log("nuevo cliente conectado");
    ws.send(JSON.stringify({type: 'update', sum: sumaTotal})); //enviar la suma total al cliente

    // evento que se ejecuta cuando se recibe un mensaje del cliente
    ws.on('message', (message) => {
    const data = JSON.parse(message);
    
        if(data.type === 'suma') {
            sumaTotal += data.number;
            //console.log('suma total:', sumaTotal);

            //enviar la suma total a todos los clientes
            wss.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'update', sum: sumaTotal}));
                }
            });  
        }
    });
    // evento que se ejecuta cuando se desconecta un cliente
    ws.on('close', () => {
        console.log('cliente desconectado');
    });
});

//iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: http://localhost:${port}`);
})

