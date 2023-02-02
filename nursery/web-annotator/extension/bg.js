console.log("bg script loaded");

// requires that we include host in extension "permissions" config (no port)
fetch("http://localhost:8090")
  .then(x => x.text())
  .then(console.log)
  .catch(console.error);

browser.action.onClicked.addListener(tab => {
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    files: [ "./content.js" ],
  }).then(x => {
    console.log("successfully inserted content script", x);
  }).catch(x => {
    console.error("failed to insert content script", x);
  })
});

browser.runtime.onMessage.addListener(([ type, payload ]) => {
  console.log(type, payload);
  return Promise.resolve("bg received message");
});
