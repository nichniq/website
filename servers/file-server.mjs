import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;

// https://www.iana.org/assignments/media-types/media-types.xhtml
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

const MIME_TYPES = {
  ".json": "application/json",
  ".pdf": "application/pdf",

  ".mp3": "audio/mpeg",

  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",

  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",

  ".mp4": "video/mp4",
};

http.createServer(async (request, response) => {
  const cwd = process.cwd();
  const path_from_cwd = path.join(cwd, request.url);
  const { is_missing, is_file, is_directory } = await fs.promises.stat(path_from_cwd)
    .then(stats => ({ is_missing: false, is_file: stats.isFile(), is_directory: stats.isDirectory() }))
    .catch(x => ({ is_missing: true, is_file: false, is_directory: false }));

  if (is_missing) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end(`No file at ${path_from_cwd}`);
  } else if (is_directory) {
    const possible_index = path.join(path_from_cwd, "index.html");
    const is_index_defined = await fs.promises.access(possible_index).then(x => true).catch(x => false);

    if (is_index_defined) {
      response.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(possible_index)] });
      const stream = fs.createReadStream(possible_index);
      stream.pipe(response);
    } else {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("This could list the files in the directory");
    }
  } else if (is_file) {
    response.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(path_from_cwd)] });
    const stream = fs.createReadStream(path_from_cwd);
    stream.pipe(response);
  }
}).listen(PORT);
