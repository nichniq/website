// TODO: Pick a better name than "server"
// ideas: membrane, medium, connector, cnxn, post office, magic mirror

import { promises as node_fs } from "fs";
import node_path from "path";
import node_util from "util";

import * as compare from "../modules/compare.js";
import { partition, group } from "../modules/lisp.js";
import { get_files } from "../modules/filesystem.js";

const log = x => {
  console.log(
    node_util.inspect(x, { showHidden: false, depth: null, colors: true })
  );
  return x;
};

const path = (...segments) => node_path.join(...segments);

const cwd = process.cwd();

const mapping_file_promise = node_fs.readFile(
  path("mapping.txt"),
  { encoding: "utf8" },
);

const expected = {
  files: {
    ".txt": [
      "mapping.txt", "native-species.txt", "pullman.txt", "thoughts.txt"
    ],
    ".png": [ "1894-colfax-lynch.png", "1894-nyt-cover.png" ],
    ".jpg": [ "waiilatpu.jpg" ],
    ".js": [ "server.js" ],
    ".json": [ "package.json" ],
  },
  directories: [
    [ "server", { directories: [], files: { ".js": [ "request.js" ] } } ],
  ],
};

const directory_content_promise = get_files(cwd)
.then(received => {
  log(received);
  log(expected);
  log(compare.deep(received, expected));

  return received;
})

// import http from "http";

// const listener = function (request, response) {
//   console.log(request)
//   response.writeHead(200);
//   response.end(JSON.stringify(request));
// }

// const server = http.createServer(listener);
// server.listen(8080);
