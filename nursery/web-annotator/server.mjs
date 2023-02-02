import http from "http";

const PORT = 8090;

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
  const req_body = await gather_stream_text(request);

  console.log(method, url.href, req_body);

  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Successful response")
}).listen(PORT);
