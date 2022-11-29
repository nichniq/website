import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;

const indent = (spaces, content) => content.split("\n").map(x => " ".repeat(spaces) + x).join("\n");

const tr = (x, form_id) => `<tr>
  <td>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <input
        form="${form_id}"
        type="text"
        name="title"
        value="${x.title}"
        style="flex-basis: 100%; font-weight: bold"
      />
      <div style="flex-basis: 100%; display: flex; gap: 5px;">
        <input
          form="${form_id}"
          type="text" name="url" value="${x.url}"
          style="flex: 1 0 auto"
          oninput="this.nextElementSibling.href = this.value"
        />
        <a href="${x.url}" target="_blank" style="flex: 0 0 auto">↪︎</a>
      </div>
      <div>${
        new Date(parseInt(x.added)).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short"
        })
      }</div>
    </div>
  </td>
  <td>
    <textarea
      form="${form_id}"
      name="notes"
    ></textarea>
  </td>
  <td>
    <form id="${form_id}" data-endpoint="/" data-method="PUT">
      <input type="hidden" name="added" value="${x.added}" />
      <button type="submit">Save</button>
    </form>
  </td>
  <td>
    <form data-endpoint="/" data-method="DELETE">
      <input type="hidden" name="url" value="${x.url}" />
      <button type="submit">Delete</button>
    </form>
  </td>
</tr>`;

const ui = bookmarks => `<!doctype html>

<meta charset="utf8" />
<link rel="stylesheet" href="/static/styles.css" />

<h1>Bookmark Processor</h1>

<table style="width: 100%">
  <thead>
    <tr>
      <th style="width: 500px">Bookmark</th>
      <th>Notes</th>
      <th style="width: 0">Save</th>
      <th style="width: 0">Delete</th>
    </tr>
  </thead>
  <tbody>
${indent(4, bookmarks.map((x, index) => tr(x, `bookmark_${index}`)).join("\n"))}
  </tbody>
</table>

<script>
  const form_obj = form => Object.fromEntries(
    [ ...form.elements ].filter(x => x.name).map(x => [ x.name, x.value ])
  );

  document.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.target;

    fetch(
      form.dataset.endpoint, {
        method: form.dataset.method,
        body: JSON.stringify(form_obj(form))
      }
    );
  });

  const submit = (url, method) => {
    const body = new FormData(event.target);
    console.log(data);
    fetch(url, { method, body });
  };
</script>`;

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
