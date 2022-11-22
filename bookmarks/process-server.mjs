import http from "http";
import fs from "fs";

const PORT = 8080;

const raw_bookmarks = JSON.parse(fs.readFileSync("./raw-bookmarks.json"));

const ui = bookmarks => `
<!doctype html>

<style>
  body {
    font-size: 12px;
    font-family: monospace;
  }

  table {
    background-color: white;
    border-collapse: collapse;
    text-align: left;
  }

  thead {
    background-color: inherit;
    position: sticky;
    top: 0;
  }

  thead::after {
    display: block;
    content: "";
    background-color: black;
    height: 1px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  thead > tr > th {
    padding: 0.5em;
  }

  tbody > tr > td {
    padding: 0.25em 0.5em;
  }

  tr:nth-child(2n) {
    background-color: lightgray;
  }
</style>

<h1>Bookmark Processor</h1>

<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Save</th>
    </tr>
  </thead>
  <tbody>${bookmarks.map(x => `
    <tr>
      <td><a href="${x.url}" target="_blank">${x.title}</a></td>
      <td>
        <form action="/bookmarks" method="post">
          <input type="hidden" name="url" value="${x.url}" />
          <button type="submit">Save</button>
        </form>
      </td>
    </tr>`).join("")}
  </tbody>
</table>
<script>
  document.addEventListener("submit", event => {
    const form = event.target;
    debugger;
  });
</script>
`.trim();

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  switch (url.pathname) {
    case "/":
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        ui(
          raw_bookmarks.slice(start || 0, end || undefined)
        )
      );
      break;

    case "/bookmarks":
      console.log(request);

      if (/POST/i.test(request.mathod)) {
        console.log("POST")
      }
      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Nothing here");
      break;
  }
}).listen(PORT);
