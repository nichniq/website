import { predictLength, downloadZip, makeZip } from "./third-party/client_zip/index.js";

console.log({ loaded: "bg" });

browser.runtime.onMessage.addListener(message => {
  console.log({ received: "bg", message });
  sendMessageToContentScript(message);
});

function sendMessageToContentScript(message) {
  browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
    for (const tab of tabs) {
      browser.tabs.sendMessage(tab.id, { forwarded: "bg", ...message });
    }
  });
}

const types = {
  modes: [ "not_initalized", "on_pinterest", "not_on_pinterest" ],
};

const local_state = {
  mode: "not_initalized"
};

const update = state => ({
  mode: page => ({ ...state, mode: "on_pinterest" }),
});

const render = state => {
  switch (state.mode) {
    case "on_pinterest":
      break;
    case "not_on_pinterest":
    case "not_initalized":
    default:
      break;
  }
}
