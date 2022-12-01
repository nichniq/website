import http from "http";

import fs_handler from "./file-system-handler.mjs";

const servers = [
  [ 8000, fs_handler ]
];

for (const [ port, handler ] of servers) {
  http.createServer(handler).listen(port);
}
