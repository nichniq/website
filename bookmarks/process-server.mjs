import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;

const raw_bookmarks = JSON.parse(fs.readFileSync("./raw-bookmarks.json"));

const ui = bookmarks => `
<!doctype html>

<link rel="stylesheet" href="/static/styles.css" />

<h1>Bookmark Processor</h1>

<datalist id="bookmark-types">
  <option value="article">Article</option>
  <option value="site">Personal site</option>
  <option value="tutorial">Tutorial</option>
</datalist>

<table style="width: 100%">
  <thead>
    <tr>
      <th>Bookmark</th>
      <th>Type</th>
      <th>Added</th>
      <th>Save</th>
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
        </div>
      </td>
      <td>
        <input
          form="bookmark-${index}"
          type="text"
          name="type"
          list="bookmark-types"
        />
      </td>
      <td>
        ${new Date(parseInt(x.added)).toISOString().slice(0, 10)}
      </td>
      <td>
        <form id="bookmark-${index}" action="/" method="post">
          <input type="hidden" name="added" value="${x.added}" />
          <button type="submit">Save</button>
        </form>
      </td>
    </tr>`).join("")}
  </tbody>
</table>
`.trim();

const gather_stream_text = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

const parse_form_url = data => Object.fromEntries(
  data.split("&").map(
    pair => pair.split("=").map(
      component => decodeURIComponent(component.replace(/\+/g, " "))
    )
  )
);

const request_url = request => new URL(request.url, `http://${request.headers.host}`);
const search_params = url => Object.fromEntries(url.searchParams.entries());

http.createServer(async (request, response) => {
  const url = request_url(request);
  const { start, end } = search_params(url);

  switch (path.dirname(url.pathname)) {
    case "/":
      switch (request.method.toLowerCase()) {
        case "get":
          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.end(
            ui(
              raw_bookmarks.slice(start || 0, end || undefined)
            )
          );
        break;

        case "post":
          const data = await gather_stream_text(request).then(parse_form_url);

          console.log("data: " + JSON.stringify(data, null, 2));

          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.end(
            ui(
              raw_bookmarks.slice(start || 0, end || undefined)
            )
          );
        break;

        default:
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
