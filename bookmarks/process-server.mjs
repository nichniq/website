import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;

const raw_bookmarks = JSON.parse(fs.readFileSync("./raw-bookmarks.json"));

const ui = bookmarks => `
<!doctype html>

<meta charset="utf8" />
<link rel="stylesheet" href="/static/styles.css" />

<h1>Bookmark Processor</h1>

<table style="width: 100%">
  <thead>
    <tr>
      <th>Bookmark</th>
      <th>Notes</th>
      <th>Save</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>${bookmarks.map((x, index) => `
    <tr>
      <td>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <input
            form="bookmark-${index}"
            type="text"
            name="title"
            value="${x.title}"
            style="flex-basis: 100%"
          />
          <div style="flex-basis: 100%; display: flex; gap: 5px;">
            <input
              form="bookmark-${index}"
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
          form="bookmark-${index}"
          name="notes"
        ></textarea>
      </td>
      <td>
        <form id="bookmark-${index}" data-endpoint="/" data-method="PUT">
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
    </tr>`).join("")}
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
</script>
`.trim();

const gather_stream_text = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

const request_url = request => new URL(request.url, `http://${request.headers.host}`);
const search_params = url => Object.fromEntries(url.searchParams.entries());

http.createServer(async (request, response) => {
  const url = request_url(request);
  const { start, end } = search_params(url);
  const request_body = await gather_stream_text(request);
  const log = (method, body) => { console.log(method, body) };

  switch (path.dirname(url.pathname)) {
    case "/":
      switch (request.method.toUpperCase()) {
        case "GET":
          log("GET", request_body);

          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(ui(raw_bookmarks.slice(start || 0, end || undefined)));
        break;

        case "PUT":
          log("PUT", request_body);

          const parsed_request = JSON.parse(request_body);

          if (raw_bookmarks.some(b => b.url === parsed_request.url)) {
            response.writeHead(204).end();
          } else {
            response.writeHead(204, { "Content-Type": "text/plain" }).end();
          }
        break;

        case "DELETE":
          log("DELETE", request_body);

          response.writeHead(204).end();
        break;

        default:
          log("UNKNOWN", request_body);

          response.writeHead(501, { "Content-Type": "text/plain" });
          response.end("Unknown method: " + request_body);
        break;
      }
    break;

    case "/static":
      const MIME_TYPES = {
        ".css": "text/css; charset=utf-8",
      };

      const stream = fs.createReadStream(path.join("./", url.pathname));
      const ext = path.extname(url.pathname);
      response.writeHead(200, { "Content-Type": MIME_TYPES[ext] });
      stream.pipe(response);
    break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Nothing here");
      break;
  }
}).listen(PORT);
