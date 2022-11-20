- [IANA HTTP status codes](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
- [MDN HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

```javascript
const STATUS_TYPES = new Map([
  [ 200, "OK" ],
  [ 400, "Bad Request" ],
  [ 401, "Unauthorized" ],
  [ 403, "Forbidden" ],
  [ 404, "Not Found" ],
  [ 500, "Internal Server Error" ],
]);
```

- [IANA media types](https://www.iana.org/assignments/media-types/media-types.xhtml)
- [MDN basics of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)

```javascript
const MIME_TYPES = {
  ".json": "application/json",
  ".pdf": "application/pdf",

  ".mp3": "audio/mpeg",

  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",

  ".css": "text/css",
  ".csv": "text/csv",
  ".htm": "text/html",
  ".html": "text/html",
  ".js": "text/javascript",
  ".md": "text/markdown",
  ".mjs": "text/javascript",
  ".txt": "text/plain",

  ".mp4": "video/mp4",
};
```

- [MDN HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

```javascript
const HTTP_METHODS = [
  "GET", // retrieves the resource
  "POST", // sends a message to the server
  "PUT", // replaces the resource with a payload
  "DELETE", // deletes the resource
  "PATCH", // applies partial modification to resource
];
```
