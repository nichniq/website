import { createServer } from 'http';
import { WebSocketServer } from "ws";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("listening", () => console.log("bound to server"));
wss.on("connection", ws => {
  console.log("connected to websocket");

  ws.on("message", buffer => {
    const data = JSON.parse(buffer);
    console.log('received message', data);
  });
});

server.listen(8080);
