import http from "http";
import fs from "fs";
import path from "path";

import mustache from "./mustache.mjs";

const PORT = 8080;
const CLIENT_TEMPLATE_PATH = path.join(process.cwd(), "client.html.mustache");
const IMAGES_DIR_PATH = "Part One";

const list_files = directory => fs.readdirSync(directory).reduce(
  (files, child) => {
    const child_path = path.join(directory, child);
    const stat = fs.statSync(child_path);
    if (stat.isFile()) { files.push(child_path) }
    if (stat.isDirectory()) { files.push(...list_files(child_path)) }
    return files;
  },
  []
);

const client = ({ paths }) => mustache.render(
  fs.readFileSync(CLIENT_TEMPLATE_PATH, "utf-8"),
  { paths }
);

const gather_stream_text = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

http.createServer(async (request, response) => {
  if (request.url === "/") {
    switch (request.method) {
      case "GET":
        const paths = list_files(IMAGES_DIR_PATH);
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end( client({ paths }) );
        break;

      case "POST":
        const [ event, payload ] = await gather_stream_text(request).then(JSON.parse);
        console.log(event, payload);
        response.writeHead(200).end();
        break;

      default:
        response.writeHead(501).end();
        break;
    }
  }

  else if (request.url.startsWith("/image/") && request.url.endsWith(".jpg")) {
    const local_path = path.join(process.cwd(), decodeURI(request.url.slice("/image/".length)));

    if (fs.existsSync(local_path)) {
      response.writeHead(200, { "Content-Type": "image/jpeg" });
      fs.createReadStream(local_path).pipe(response);
    } else {
      response.writeHead(404).end();
    }
  }

  else {
    response.writeHead(404).end();
  }
}).listen(PORT);
