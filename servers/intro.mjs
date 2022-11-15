import http from "http";

const create_server = ({ port, on_request }) => {
  const raw_server = http.createServer(on_request);

  raw_server.listen(port);

  return {
    raw_server,
  };
};

const on_request = (request, response) => {
  const request_summary = {
    headers: request.headers,
    method: request.method,
    url: request.url,
  };

  response.end(JSON.stringify(request_summary, null, 2));
};

create_server({ port: 8080, on_request });
