// dom elements
const $url = document.getElementById("url");
const $selection = document.getElementById("selection");
const $add = document.getElementById("add");

// event (runtime receives message):
browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

  // type ("selection"): update textarea with selection payload
  if (type === "selection") {
    const { selection = "", url = "" } = payload || {}
    $selection.value = selection;
    $url.value = url;
  };
});

// event (add selection form submitted): submit selection as runtime message
$add.addEventListener("submit", event => {
  event.preventDefault();

  const form_data = new FormData(event.target);
  browser.runtime.sendMessage(
    [ "server", [ "add_selection", Object.fromEntries(form_data.entries()) ] ]
  );
});

// do stuff
browser.runtime.sendMessage([ "last_selection" ]);
console.log("sidebar loaded");
