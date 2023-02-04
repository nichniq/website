// const: #selection element is a teztarea to contain text selection
const textarea = document.getElementById("selection");

// event (runtime receives message):
browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

  // type ("selection"): update textarea with selection payload
  if (type === "selection") {
    textarea.value = payload;
  };
});

// do stuff
browser.runtime.sendMessage([ "last_selection" ]);
console.log("sidebar loaded");
