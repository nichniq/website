import http from "http";
import fs from "fs";

const PORT = 8090;
const DATA_FILE = "./data.json";

const load = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const save = x => fs.writeFileSync(DATA_FILE, JSON.stringify(x, null, 2));

const data = load();

const gather_stream_text = stream => new Promise((resolve, reject) => {
  let data = "";
  stream.setEncoding("utf8");
  stream.on("data", chunk => { data += chunk });
  stream.on("end", () => { resolve(data) });
  stream.on("error", error => { reject(error) });
});

http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const method = request.method;


  if (method === "POST") {
    const req_body = await gather_stream_text(request);
    console.log(method, url.href, req_body);

    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Successful response");
  }
}).listen(PORT);
