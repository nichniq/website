// url required in permissions list for CORS
const post_to_server = body => fetch(
  "http://localhost:8090",
  {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  }
);

// requires "scripting" and "currentTab" permission
const insert_scripts = (tab_id, ...files) => browser.scripting.executeScript({
  target: { tabId: tab_id },
  files,
});

browser.browserAction.onClicked.addListener(tab => {
  console.log("browser action clicked");

  insert_scripts(tab.id, "./content.js").catch(x => {
    console.error("failed to load script", x)
  });
});

browser.runtime.onMessage.addListener(message =>
  post_to_server(message).then(
    x => x.text()
  ).then(x => {
    console.log("response from server", x);
    return x;
  }).catch(x => {
    console.error("error posting to server", x);
    return x;
  })
);

console.log("bg loaded");
