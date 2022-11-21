import http from "http";

const PORT = 8080;

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  switch (url.pathname) {
    case "/":
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end("<h1>Bookmark Processor</h1>");
      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Nothing here");
      break;
  }
}).listen(PORT);
