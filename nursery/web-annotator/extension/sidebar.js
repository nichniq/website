const textarea = document.getElementById("selection");

browser.runtime.sendMessage([ "last_selection" ]);

browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

  if (type === "selection") {
    textarea.value = payload;
  };
});

console.log("sidebar loaded");
