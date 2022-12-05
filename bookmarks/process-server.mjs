import http from "http";
import fs from "fs";
import path from "path";

import mustache from "./mustache.mjs";
import serve_file from "./file-system-handler.mjs";

const PORT = 8080;

const read_json = filename => JSON.parse(fs.readFileSync(filename, "utf-8"));
const unprocessed_bookmarks = read_json("./unprocessed-bookmarks.json");
const processed_bookmarks = read_json("./processed-bookmarks.json");

const ui = bookmarks => mustache.render(
  fs.readFileSync("main-template.mustache", "utf-8"),
  {
    bookmarks: bookmarks.map((bookmark, index) => ({
      form_id: `bookmark_${index}`,
      title: bookmark.title,
      url: bookmark.url,
      added: bookmark.added,
      notes: bookmark.notes || "",
      processed: bookmark.processed,
      added_formatted: new Date(parseInt(bookmark.added)).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    }))
  }
);

const gather_stream_text = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

const request_url = request => new URL(request.url, `http://${request.headers.host}`);
const search_params = url => Object.fromEntries(url.searchParams.entries());
const subset = array => ({ start, end, limit }) => array.slice(
  start || 0,
  end
).slice(0, limit);

http.createServer(async (request, response) => {
  const url = request_url(request);
  const dir = path.dirname(url.pathname);

  const method = request.method.toUpperCase();

  const req_body_json = await gather_stream_text(request);
  const req_body = req_body_json.length > 0 ? JSON.parse(req_body_json) : null;

  const bookmarks = [
    ...unprocessed_bookmarks.slice(-100).map(x => ({ ...x, processed: false })),
    ...processed_bookmarks.slice().map(x => ({ ...x, processed: true })),
  ].sort((a, b) => b.added - a.added);
  const requested_bookmark = req_body ? bookmarks.find(b => b.url === req_body.url) : null;

  console.log(method, url.href, req_body_json);

  switch (dir) {
    case "/":
      switch (method) {
        case "GET":
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(ui(bookmarks));
          break;

        case "POST":
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(req_body_json);
          break;

        case "QUERY":
          response.writeHead(204, { "Allow": "GET, POST" });
          break;

        default:
          response.writeHead(501, { "Content-Type": "text/plain" });
          response.end("Method not implemented\n\n" + req_body_json);
          break;
      }
      break;

    case "/static":
      serve_file(request, response);
      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end(`Not found: ${request.url}`);
      break;
  }
}).listen(PORT);
