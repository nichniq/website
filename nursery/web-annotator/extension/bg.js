// function: posts a message to a localhost endpoint
const post_to_server = body => fetch(
  "http://localhost:8090", // url required in permissions list for CORS
  {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }
);

// event (runtime receives message): handle the event based on its type
let last_selection = "";
browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

  // type ("server"): send payload to the localhost server
  if (type === "server") {
    post_to_server(payload).then(
      x => x.text()
    ).then(x => {
      console.log("response from server", x);
      return x;
    }).catch(x => {
      console.error("error posting to server", x);
      return x;
    })
  }

  // type ("selection"): store the selection for later
  if (type === "selection") {
    last_selection = payload;
  }

  // type ("last_selection"): post the stored selection as a runtime message
  if (type === "last_selection") {
    browser.runtime.sendMessage([ "selection", last_selection ]);
  }
});

// event (extension button click): toggle the extension sidebar
browser.browserAction.onClicked.addListener(tab => {
  console.log("browser action clicked");

  browser.sidebarAction.toggle();
});

// do stuff
console.log("bg loaded");
