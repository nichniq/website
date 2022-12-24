import http from "http";
import fs from "fs";
import path from "path";

import mustache from "./mustache.mjs";

const PORT = 8080;
const CLIENT_TEMPLATE_PATH = path.join(process.cwd(), "client.html.mustache");
const IMAGES_DIR_PATH = "./images/Part One";

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

const load_images = limit => list_files(IMAGES_DIR_PATH)
  .filter(x => x.endsWith(".jpg"))
  .map(path => ({
    path: /images\/(.+)/.exec(path)[1],
  }))
  .slice(0, limit);

const client_html = ({ images }) => mustache.render(
  fs.readFileSync(CLIENT_TEMPLATE_PATH, "utf-8"),
  { images }
);

const gather_body = readable => new Promise((resolve, reject) => {
  let data = "";
  readable.setEncoding("utf8");
  readable.on("data", chunk => { data += chunk });
  readable.on("end", () => { resolve(data) });
  readable.on("error", error => { reject(error) });
});

const images_from_paths = paths => paths.map(
  (path, index) => ({
    path: /images\/(.+)/.exec(path)[1],
    zIndex: index,
    x: 0,
    y: 0,
  })
);

http.createServer(async (request, response) => {
  if (request.url === "/") {
    if (request.method === "GET") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        client_html({ images: load_images(10) })
      );
    }

    else if (request.method === "POST") {
      const [ event, payload ] = await gather_body(request).then(JSON.parse);
      console.log(event, payload);
      response.writeHead(200).end();
    }

    else {
      response.writeHead(501).end();
    }
  }

  else if (request.url.startsWith("/images/")) {
    if (request.method !== "GET") {
      response.writeHead(501).end();
    }

    else if (request.method === "GET") {
      const local_path = path.join(process.cwd(), decodeURI(request.url));

      if (local_path.endsWith(".jpg") && fs.existsSync(local_path)) {
        response.writeHead(200, { "Content-Type": "image/jpeg" });
        fs.createReadStream(local_path).pipe(response);
      }

      else {
        response.writeHead(404).end();
      }
    }
  }

  else {
    response.writeHead(404).end();
  }
}).listen(PORT);
