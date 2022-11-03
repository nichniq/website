console.log("popup");

browser.runtime.getBackgroundPage().then(bg => {
  console.log({ in: "popup", bg });
});

browser.runtime.onMessage.addListener(message => {
  console.log("popup", "message", message);
});

browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
  for (const tab of tabs) {
    console.log({ attempt: "popup", to: `browser.tabs[${tab.id}]` });
    browser.tabs.sendMessage(tab.id, { from: "popup", to: `browser.tabs[${tab.id}]` });
  }
});

browser.runtime.sendMessage({ from: "popup", to: "browser.runtime" });
