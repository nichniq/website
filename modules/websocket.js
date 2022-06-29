import * as events from "../modules/events.js";

const states = bijection([
  [ "CONNECTING", 0 ], // the websocket is establishing connection to the server
  [ "OPEN", 1 ], // the websocket is connected to the server
  [ "CLOSING", 2 ], // the websocket is disconnecting from the server
  [ "CLOSED", 3 ], // the websocket has disconnected from the server
]);

export const event_types = bijection([
  [ "connected", "open" ], // the websocket has connected to the server
  [ "sent", "sent" ], // the websocket has sent a message to the server
  [ "received", "message" ], // websocket has received a message from the server
  [ "disconnected", "close" ], // the websocket has lost connection to server
]);

function websocket ({
  url,
  listeners = [],
}) {
  const websocket = new WebSocket(url);

  const bytes_enqueued = () => websocket.bufferedAmount;
  const state = () => states.key_for(websocket.readyState);

  events.update(websocket).handle(...listeners);

  return Object.freeze({
    url: websocket.url,
    state,
    bytes_enqueued,

    send(data) {
      const json = JSON.stringify(data);
      websocket.send(json);
      events.dispatch("sent").from(websocket).with(
        { data, json, bytes_enqueued: bytes_enqueued() }
      );
    },

    close(code, reason) {
      events.update(websocket).ignore(...listeners);
      websocket.close(code, reason);
    },
  });
};

export default websocket;
