import http from "http";
import fs from "fs";

import { WebSocketServer } from "ws";

const read_outgoing = () => fs.readFileSync("./outgoing.txt", 'utf8');
const watch_outgoing = cb => fs.watchFile("./outgoing.txt", cb);
const write_incoming = content => fs.writeFileSync("./incoming.txt", content);

const server_event_types = [
  "listening", // fires when the underlying server has been bound
  "headers", // fires before response headers are written for the handshake
  "connection", // fires after the handshake with the server websocket
  "close", // fires when the underlying server closes
  "error", // fires when the underlying server encounters and error
  "wsClientError",
];

export const socket_event_types = [
  "close", // fired when the connection is closed
  "error", // fired when an error has occured
  "message", // fired when a message is received
  "open", // fired when the connection is established
  "ping", // fired when a ping is received
  "pong", // fired when a pong is received
  "redirect", // fired before a redirect is fired
  "unexpected-response",
  "upgrade", // fired when headers are received as part of handshake
];

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("listening", () => {
  console.log("bound to server");
});

wss.on("connection", ws => {
  console.log("established connection", ws);

  // send the outgoing file to the client
  ws.send(
    read_outgoing()
  );

  // watch the outgoing file, send its content if it changes
  watch_outgoing(
    () => ws.send(read_outgoing())
  );

  // when a message is received from the client, write to the the incoming file
  ws.on("message", buffer => {
    const json = JSON.parse(buffer);

    write_incoming(json);
    console.log("message", json);
  });
});

server.listen(8080);

/**
 * Eventually, I'd like to make a websocket server a module like this:
 *
 * ```javascript
 * export default function websocket_server({
 *   port,
 *   listeners = [],
 * }) {
 *   const server = http.createServer();
 *   const wss = new WebSocketServer({ server });
 *
 *   server.listen(port);
 *
 *   return {
 *     connections: [],
 *     state: null,
 *   };
 * }
 * ```
 */
