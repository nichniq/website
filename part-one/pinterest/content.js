console.log("content");

browser.runtime.onMessage.addListener(message => {
  console.log({ received: "content", message });
});

browser.runtime.sendMessage({ from: "content", to: "browser.runtime" });

function notifyExtension(e) {
  console.log("content script sending message");
  browser.runtime.sendMessage({"clicked": e.target.tagName});
}

/*
Add notifyExtension() as a listener to click events.
*/
window.addEventListener("click", notifyExtension);
