/** IMPORTS **/

import { predictLength, downloadZip, makeZip } from "./third-party/client_zip/index.js";


/** DEFINITIONS **/

const save = data => browser.storage.local.set(data);
const load = keys => browser.storage.local.get(data);
const log = (x, err) => { console[err === undefined ? 'log' : 'error'](x); return x; };

const responses = {
  content_script_loaded({ last_loaded }) {
    save({ last_loaded }).then(log);
  },
};

/** EXECUTION **/

browser.runtime.onMessage.addListener(({ type, payload }) => {
  if (type in responses) {
    responses[type](payload);
  }
});

