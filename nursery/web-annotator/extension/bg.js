console.log("bg script loaded");

// requires that we include host in extension "permissions" config (no port)
fetch("http://localhost:8090")
  .then(x => x.text())
  .then(console.log)
  .catch(console.error);
