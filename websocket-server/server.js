import http from "http";
import fs from "fs";

import { WebSocketServer } from "ws";

const read_outgoing = () => fs.readFileSync("./outgoing.txt", 'utf8');
const watch_outgoing = cb => fs.watchFile("./outgoing.txt", cb);
const write_incoming = content => fs.writeFileSync("./incoming.txt", content);

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("listening", () => console.log("bound to server"));

wss.on("connection", ws => {
  ws.send(read_outgoing());
  watch_outgoing(() => ws.send(read_outgoing()));

  ws.on("message", buffer => {
    write_incoming(JSON.parse(buffer));
  });
});

server.listen(8080);

