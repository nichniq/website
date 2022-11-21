import http from "http";
import fs from "fs";

const PORT = 8080;

const raw_bookmarks = JSON.parse(fs.readFileSync("./raw-bookmarks.json"));

const ui = bookmarks => `
<h1>Bookmark Processor</h1>
<ul>${bookmarks.map(x => `
  <li>
    <a href="${x.url}" target="_blank">${x.title}</a>
  </li>`).join("")}
</ul>
`;

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  switch (url.pathname) {
    case "/":
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(ui(raw_bookmarks.slice(start || 0, end || undefined)));
      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Nothing here");
      break;
  }
}).listen(PORT);
