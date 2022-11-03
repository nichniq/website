console.log("sidebar");

browser.runtime.getBackgroundPage().then(bg => {
  console.log({ in: "sidebar", bg });
});

browser.runtime.onMessage.addListener(message => {
  console.log({ received: "sidebar", message });
});

browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
  for (const tab of tabs) {
    console.log({ attempt: "sidebar", to: `browser.tabs[${tab.id}]` });
    browser.tabs.sendMessage(tab.id, { from: "sidebar", to: `browser.tabs[${tab.id}]` });
  }
});

browser.runtime.sendMessage({ from: "sidebar", to: "browser.runtime" });
