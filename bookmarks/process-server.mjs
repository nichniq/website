import http from "http";
import fs from "fs";
import path from "path";

import mustache from "./mustache.mjs";

const PORT = 8080;

const ui_tempate = fs.readFileSync("main-template.mustache", "utf-8");
const ui = bookmarks => mustache.render(ui_tempate, {
  bookmarks: bookmarks.map(({ title, url, added }, index) => ({
    form_id: `bookmark_${index}`,
    title,
    url,
    added: new Date(parseInt(added)).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }))
});

const raw_bookmarks = JSON.parse(fs.readFileSync("./raw-bookmarks.json"));

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

  const { start, end, limit } = search_params(url);
  const bookmark_subset = subset(raw_bookmarks)({ start, end, limit });

  const method = request.method.toUpperCase();

  const req_body_json = await gather_stream_text(request);
  const req_body = req_body_json.length > 0 ? JSON.parse(req_body_json) : null;
  const requested_bookmark = req_body ? raw_bookmarks.find(b => b.url === req_body.url) : null;

  console.log(method, url.href, req_body_json);

  switch (dir) {
    case "/":
      switch (method) {
        case "GET":
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(ui(bookmark_subset));
          break;

        case "PUT":
          if (requested_bookmark == null) {
            response.writeHead(200, { "Content-Type": "application/json" }).end(
              JSON.stringify({
                created: req_body,
              })
            );
          } else {
            response.writeHead(200, { "Content-Type": "application/json" }).end(
              JSON.stringify({
                replaced: requested_bookmark,
                with: req_body,
              })
            );
          }
          // response.writeHead(204).end();
          break;

        case "DELETE":
          response.writeHead(200, { "Content-Type": "application/json" }).end(
            JSON.stringify({ deleted: requested_bookmark })
          );
          // response.writeHead(204).end();
          break;

        case "QUERY":
          response.writeHead(204, { "Allow": "GET, PUT, DELETE" });
          break;

        default:
          response.writeHead(501, { "Content-Type": "text/plain" });
          response.end("Method not implemented\n\n" + req_body_json);
          break;
      }
      break;

    case "/static":
      if (method !== "GET") {
        response.writeHead(501, { "Content-Type": "text/plain" });
        response.end("Method not implemented\n\n" + req_body_json);
        break;
      }

      const MIME_TYPES = {
        ".css": "text/css; charset=utf-8",
      };

      const stream = fs.createReadStream(path.join("./", url.pathname + url.search));
      const ext = path.extname(url.pathname);
      response.writeHead(200, { "Content-Type": MIME_TYPES[ext] });
      stream.pipe(response);
      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
      break;
  }
}).listen(PORT);
