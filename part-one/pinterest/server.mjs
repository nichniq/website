import http from "http";
import fs from "fs";
import path from "path";
import mustache from "./mustache.mjs";

const PORT = 8080;
const CLIENT_TEMPLATE_PATH = path.join(process.cwd(), "client.html.mustache");

const client = () => mustache.render(
  fs.readFileSync(CLIENT_TEMPLATE_PATH, "utf-8"),
  {
    paths: JSON.stringify([ "path/to/a", "path/to/b" ])
  }
);

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
      response.end(client());
      break;

    case "POST":
      const [ event, payload ] = await gather_stream_text(request).then(JSON.parse);
      console.log(event, payload);
      response.writeHead(200);
      response.end("OK");
      break;

    default:
      response.writeHead(501);
      response.end();
      break;
  }
}).listen(PORT);
