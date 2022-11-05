/** IMPORTS **/

import { predictLength, downloadZip, makeZip } from "./third-party/client_zip/index.js";


/** DEFINITIONS **/

const save = data => browser.storage.local.set(data);
const load = keys => browser.storage.local.get(keys);

const send_to_tab = (tab_id, type, payload) => {
  browser.tabs.sendMessage(tab_id, [ type, payload ]);
  console.log(`bg sent: ${type}`, payload);
};

/** EXECUTION **/

browser.runtime.onMessage.addListener(([ type, payload ], sender, sendResponse) => {
  console.log(`bg received: ${type}`, payload);

  switch(type) {
    case "content_script_loaded":
      const { last_loaded } = payload;

      Promise.all([ load("last_loaded"), save({ last_loaded }) ]).then(([ saved, _ ]) => {
        const diff_sec = Math.floor((last_loaded - saved.last_loaded) / 1000);

        send_to_tab(sender.tab.id, "log_from_bg", [ "last_loaded", {
          prev: saved.last_loaded,
          curr: last_loaded,
          diff: `${Math.floor(diff_sec / 60)}m ${Math.floor(diff_sec % 60)}s`,
        } ]);
      });

      break;
    default:
      console.log("did nothing");

      break;
  }
});

