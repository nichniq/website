// url required in permissions list for CORS
const post_to_server = body => fetch(
  "http://localhost:8090",
  {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }
);

browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

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
});

browser.browserAction.onClicked.addListener(tab => {
  console.log("browser action clicked");

  browser.sidebarAction.toggle();
});

let last_selection = "";

browser.runtime.onMessage.addListener(message => {
  const [ type, payload ] = message;

  if (type === "selection") {
    last_selection = payload;
  }

  if (type === "last_selection") {
    browser.runtime.sendMessage([ "selection", last_selection ]);
  }
});

console.log("bg loaded");
