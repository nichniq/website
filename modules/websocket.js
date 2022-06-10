import bijection from "/modules/bijection.js";

const { now } = Date;

export const states = bijection([
  [ "CONNECTING", 0 ],
  [ "OPEN", 1 ],
  [ "CLOSING", 2 ],
  [ "CLOSED", 3 ],
]);

const log_websocket_event = event => () => console.log(`websocket: ${event}`);

function websocket ({
  url,
  description = now(),
  handlers = {
    open: log_websocket_event("open"),
    error: log_websocket_event("error"),
    message: log_websocket_event("message"),
    close: log_websocket_event("close"),
    send: log_websocket_event("send")
  },
}) {
  const websocket = new WebSocket(url);
  const symbol = Symbol(description);

  for (const [ event, handler ] of Object.entries(handlers)) {
    websocket.addEventListener(event, handler)
  }

  const api = {
    symbol,
    description: symbol.description,
    url: websocket.url,

    state: () => states.key_for(websocket.readyState),
    bytes_enqueued: () => websocket.bufferedAmount,

    send(data) {
      const json = JSON.stringify(data);

      websocket.send(json);

      websocket.dispatchEvent(
        new CustomEvent("send", {
          details: { data, json, bytes_enqueued: api.bytes_enqueued() }
        })
      );
    },

    close(code, reason) {
      const bytes_enqueued = api.bytes_enqueued();

      if (bytes_enqueued > 0) {
        console.warn(`closed with ${bytes_enqueued} bytes un-transferred`);
      }

      for (const [ event, handler ] of Object.entries(handlers)) {
        websocket.removeEventListener(event, handler)
      }

      websocket.close(code, reason);
    },
  };

  return Object.freeze(api);
};

export default websocket;
