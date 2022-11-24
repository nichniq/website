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
          <div style="flex-basis: 100%; display: flex; gap: 10px;">
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
<script>
  // document.addEventListener("submit", event => {
  //   const form = event.target;
  //   debugger;
  // });
</script>
`.trim();

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

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
          let data = "";

          request.on("data", chunk => {
              data += chunk;

              if (data.length > 1e6) {
                  data = "";
                  response.writeHead(413, { "Content-Type": "text/plain" });
                  response.end();
                  request.connection.destroy();
              }
          });

          request.on("end", () => {
            data = Object.fromEntries(
              data.split("&").map(x => x.split("=").map(x => decodeURIComponent(x.replace(/\+/g, " "))))
            );

            console.log("data: " + JSON.stringify(data, null, 2));

            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(
              ui(
                raw_bookmarks.slice(start || 0, end || undefined)
              )
            );
          });
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
