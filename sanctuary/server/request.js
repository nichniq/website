/**
 * ClientRequest
 *   extends OutgoingMessage
 *   extends Stream
 *   instance of EventEmitter
 */

/**
 * This object is created internally and returned from http.request().
 * It represents an in-progress request whose header has already been queued.
 * The header is still mutable via
 *
 *   - setHeader(name, value)
 *   - getHeader(name)
 *   - removeHeader(name) API.
 *
 * The actual header will be sent along with the first data chunk
 * or when calling request.end().
 */

/**
 * To get the response, add a listener for 'response' to the request object.
 * 'response' will be emitted from the request object
 * when the response headers have been received.
 * The 'response' event is executed with one argument
 * which is an instance of http.IncomingMessage.
 */

/**
 * During the 'response' event, one can add listeners to the response object;
 * particularly to listen for the 'data' event.
 */

/**
 * If no 'response' handler is added,
 * then the response will be entirely discarded.
 * However, if a 'response' event handler is added,
 * then the data from the response object must be consumed,
 * either by calling response.read() whenever there is a 'readable' event,
 * or by adding a 'data' handler,
 * or by calling the .resume() method.
 * Until the data is consumed, the 'end' event will not fire.
 * Also, until the data is read
 * it will consume memory
 * that can eventually lead to a 'process out of memory' error.
 */

const events = [

/**
 * Indicates that the request is completed,
 * or its underlying connection was terminated prematurely
 * (before the response completion).
 */

"close",

/**
 * Emitted each time a server responds to a request with a CONNECT method.
 * If this event is not being listened for,
 * clients receiving a CONNECT method will have their connections closed.
 */

"connect", // (response:, IncomingMessage, socket: Duplex>, head: Buffer) => {}

/**
 * Emitted when the server sends a '100 Continue' HTTP response,
 * usually because the request contained 'Expect: 100-continue'.
 * This is an instruction that the client should send the request body.
 */

"continue",

/**
 * Emitted when the request has been sent.
 * More specifically, this event is emitted
 * when the last segment of the response headers and body
 * have been handed off to the operating system
 * for transmission over the network.
 * It does not imply that the server has received anything yet.
 */

"finish",

/**
 * Info = {
 *   httpVersion
 *   httpVersionMajor
 *   httpVersionMinor
 *   statusCode
 *   statusMessage
 *   headers
 *   rawHeaders
 * }
 *
 * Emitted when the server sends a 1xx intermediate response
 * (excluding 101 Upgrade).
 * The listeners of this event will receive an object containing the
 * HTTP version,
 * status code,
 * status message,
 * key-value headers object,
 * and array with the raw header names followed by their respective values.
 */

"information", // (info: info) => {}

/**
 * Emitted when a response is received to this request.
 * This event is emitted only once.
 */

"response", // (response: http.IncomingMessage) => {}

/**
 * This event is guaranteed to be passed
 * an instance of the <net.Socket> class, a subclass of <stream.Duplex>,
 * unless the user specifies a socket type other than <net.Socket>.
 */

 "socket", // (socket: Duplex) => {}

/**
 * Emitted when the underlying socket times out from inactivity.
 * This only notifies that the socket has been idle.
 * The request must be destroyed manually.
 */

"timeout",

/**
 * Emitted each time a server responds to a request with an upgrade.
 * If this event is not being listened for
 * and the response status code is 101 Switching Protocols,
 * clients receiving an upgrade header will have their connections closed.
 *
 * This event is guaranteed to be passed
 * an instance of the <net.Socket> class, a subclass of <stream.Duplex>,
 * unless the user specifies a socket type other than <net.Socket>.
 */

"upgrade", // (response:, IncomingMessage, socket: Duplex>, head: Buffer) => {}

];

/**
 * request.end([data[, encoding]][, callback])
 *   data <string> | <Buffer>
 *   encoding <string>
 *   callback <Function>
 * Returns: <this>
 *
 * Finishes sending the request.
 * If any parts of the body are unsent, it will flush them to the stream.
 * If the request is chunked, this will send the terminating '0\r\n\r\n'.
 *
 * If data is specified,
 * it is equivalent to calling request.write(data, encoding)
 * followed by request.end(callback).
 *
 * If callback is specified,
 * it will be called when the request stream is finished.
 */

/**
 * request.destroy([error])
 *   error <Error> Optional, an error to emit with 'error' event.
 * Returns: <this>
 *
 * Destroy the request.
 * Optionally emit an 'error' event, and emit a 'close' event.
 * Calling this will cause remaining data in the response
 * to be dropped and the socket to be destroyed.
 */

/**
 * request.getHeader(name)
 *   name <string>
 * Returns: <any>
 *
 * Reads out a header on the request.
 * The name is case-insensitive.
 * The type of the return value depends
 * on the arguments provided to request.setHeader().
*/

/**
 * request.getHeaderNames()
 * Returns: <string[]>
 *
 * Returns an array containing
 * the unique names of the current outgoing headers.
 * All header names are lowercase.
 */

/**
 * request.getHeaders()
 * Returns: <Object>
 *
 * Returns a shallow copy of the current outgoing headers.
 * Since a shallow copy is used, array values may be mutated
 * without additional calls to various header-related http module methods.
 * The keys of the returned object are the header names
 * and the values are the respective header values.
 * All header names are lowercase.
 *
 * The object returned by the response.getHeaders() method
 * does not prototypically inherit from the JavaScript Object.
 * This means that typical Object methods
 * such as obj.toString(), obj.hasOwnProperty(), and others
 * are not defined and will not work.
 */

/**
 * request.hasHeader(name)
 *   name <string>
 * Returns: <boolean>
 *
 * Returns true if the header identified by name
 * is currently set in the outgoing headers.
 * The header name matching is case-insensitive.
 */

/**
 * request.path
 * Returns: <string> The request path.
 */

/**
 * request.method
 * Returns: <string> The request method.
 */

/**
 * request.host
 * Returns: <string> The request host.
 */

/**
 * request.protocol
 * Returns: <string> The request protocol.
 */

/**
 * request.setHeader(name, value)
 *   name <string>
 *   value <any>
 *
 * Sets a single header value for headers object.
 * If this header already exists in the to-be-sent headers,
 * its value will be replaced.
 * Use an array of strings here to send multiple headers with the same name.
 * Non-string values will be stored without modification.
 * Therefore, request.getHeader() may return non-string values.
 * However, the non-string values will be converted to strings
 * for network transmission.
 *
 * request.setHeader('Content-Type', 'application/json');
 * request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
 *
 * When the value is a string an exception will be thrown
 * if it contains characters outside the latin1 encoding.
 * If you need to pass UTF-8 characters in the value
 * please encode the value using the RFC 8187 standard.
 *
 * const filename = 'Rock 🎵.txt';
 * request.setHeader(
 *   'Content-Disposition',
 *   `attachment; filename*=utf-8''${encodeURIComponent(filename)}`
 * );
 */

 /**
  * request.setTimeout(timeout[, callback])
  *   timeout <number> Milliseconds before a request times out.
  *   callback <Function> Optional function to be called when a timeout occurs.
  *            Same as binding to the 'timeout' event.
  * Returns: <http.ClientRequest>
  *
  */

/**
 * request.write(chunk[, encoding][, callback])
 *   chunk <string> | <Buffer>
 *   encoding <string>
 *   callback <Function>
 * Returns: <boolean>
 *
 * Sends a chunk of the body.
 * This method can be called multiple times.
 * If no Content-Length is set, data will automatically be encoded
 * in HTTP Chunked transfer encoding,
 * so that server knows when the data ends.
 * The Transfer-Encoding: chunked header is added.
 * Calling request.end() is necessary to finish sending the request.
 *
 * The encoding argument is optional and only applies when chunk is a string.
 * Defaults to 'utf8'.
 *
 * The callback argument is optional
 * and will be called when this chunk of data is flushed,
 * but only if the chunk is non-empty.
 *
 * Returns true
 * if the entire data was flushed successfully to the kernel buffer.
 * Returns false
 * if all or part of the data was queued in user memory.
 * 'drain' will be emitted when the buffer is free again.
 *
 * When write function is called with empty string or buffer,
 * it does nothing and waits for more input.
 */
