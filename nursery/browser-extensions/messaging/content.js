const send_message = (type, payload) => {
  browser.runtime.sendMessage([ type, payload ]);
  console.log("sent", type, payload);
}

browser.runtime.onMessage.addListener(([ type, payload ], sender, sendResponse) => {
  switch (type) {
    case "log_from_bg":
      console.log(type, payload);
      break;

    default:
      console.log("unknown event", type);
      break;
  }
});

send_message("content_script_loaded", { last_loaded: Date.now() });
