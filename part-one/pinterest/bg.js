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
