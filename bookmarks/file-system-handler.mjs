import fs from "fs";
import path from "path";

// https://www.iana.org/assignments/media-types/media-types.xhtml
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

const ext_content_type = ext => (ext in MIME_TYPES)
  ? { "Content-Type": MIME_TYPES[ext] }
  : {};

const path_info = local_path => Promise.all([
  fs.promises.stat(local_path),
  fs.promises.readdir(local_path).catch(() => []),
]).then(([ stats, children ]) => (
  { is_file: stats.isFile(), is_directory: stats.isDirectory(), children }
)).catch(() => (
  { is_file: false, is_directory: false, children: [] }
));

export default (request, response) => {
  const local_path = path.join(process.cwd(), request.url);

  path_info(local_path).then(({ is_file, is_directory, children }) => {
    if (is_file) {
      response.writeHead(200, ext_content_type(path.extname(local_path)));
      fs.createReadStream(local_path).pipe(response);
    } else if (is_directory && children.includes("index.html")) {
      response.writeHead(200, ext_content_type(".html"));
      fs.createReadStream(path.join(local_path, "index.html")).pipe(response);
    } else if (is_directory && children.length > 0) {
      response.writeHead(200, ext_content_type(".html"));
      response.end(`<!doctype html><ul>${
        children
          .map(x => path.join(request.url, x))
          .map(x => `<li><a href="${x}">${x}</a></li>`)
          .join("")
      }</ul>`);
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end(`Not found: ${local_path}`);
    }
  }).catch(err => {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end(`Server error: ${err}`);
  })
};
