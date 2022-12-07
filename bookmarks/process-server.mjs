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
      added_formatted: new Date(bookmark.added).toLocaleString("en-US", {
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

const delete_bookmark = url => {
  const unprocessed_index = unprocessed_bookmarks.findIndex(x => x.url === url);
  const processed_index = processed_bookmarks.findIndex(x => x.url === url);

  if (unprocessed_index > -1) {
    unprocessed_bookmarks.splice(unprocessed_index, 1);
  }

  if (processed_index > -1) {
    processed_bookmarks.splice(processed_index, 1);
  }
};

const list_to_file = list => JSON.stringify(
  list, [ "title", "url", "notes", "added" ], 2
) + "\n";

const save_bookmarks = () => Promise.all([
  fs.promises.writeFile(
    "./unprocessed-bookmarks.json",
    list_to_file(unprocessed_bookmarks)
  ),

  fs.promises.writeFile(
    "./processed-bookmarks.json",
    list_to_file(processed_bookmarks)
  ),
]);

const newest_first = (a, b) => b.added - a.added;
const oldest_first = (a, b) => a.added - b.added;

http.createServer(async (request, response) => {
  const url = request_url(request);
  const method = request.method;
  const req_body_json = await gather_stream_text(request);

  console.log(method, url.href, req_body_json);

  switch (path.dirname(url.pathname)) {
    case "/":
      switch (request.method.toUpperCase()) {
        case "GET":
          const { order = "DESC" , limit } = search_params(url);

          const bookmarks = [
            ...unprocessed_bookmarks.map(x => ({ ...x, processed: false })),
            ...processed_bookmarks.map(x => ({ ...x, processed: true })),
          ].sort(
            order.toUpperCase() === "ASC" ? oldest_first : newest_first
          ).slice(0, parseInt(limit));

          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(ui(bookmarks));
          break;

        case "POST":
          const { event, ...payload } = JSON.parse(req_body_json);

          switch (event.toUpperCase()) {
            case "SAVE":
              delete_bookmark(payload.url);
              payload.added = parseInt(payload.added);
              processed_bookmarks.push(payload);
              processed_bookmarks.sort((a, b) => b.added - a.added);
              save_bookmarks();
              response.writeHead(202, { "Content-Type": "text/plain" });
              response.end(`Saving ${JSON.stringify(payload)}`);
              break;

            case "DELETE":
              delete_bookmark(payload.url);
              save_bookmarks();
              response.writeHead(202, { "Content-Type": "text/plain" });
              response.end(`Deleting ${payload.url}`);
              break;

            default:
              response.writeHead(400, { "Content-Type": "text/plain" });
              response.end(`POST event not found: ${event}`);
              break;
          }
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
