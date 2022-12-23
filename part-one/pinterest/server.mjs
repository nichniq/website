import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;
const CLIENT_HTML_PATH = path.join(process.cwd(), "client.html");

const gather_stream_text = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

http.createServer(async (request, response) => {
  switch (request.method.toUpperCase()) {
    case "GET":
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(CLIENT_HTML_PATH).pipe(response);
      break;

    case "POST":
      const { event, ...payload } = await gather_stream_text(request).then(JSON.parse);
      console.log(request, event, payload);
      break;

    default:
      response.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Method not implemented");
      break;
  }
}).listen(PORT);
