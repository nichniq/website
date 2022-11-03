import { encodeString, makeUint8Array } from "./utils.js";

/** The file name and modification date will be read from the input if it is a File or Response;
 * extra arguments can be given to override the input's metadata.
 * For other types of input, the `name` is required and `modDate` will default to *now*.
 * @param modDate should be a Date or timestamp or anything else that works in `new Date()`
 */
export function normalizeInput(input, modDate) {
  if (modDate !== undefined && !(modDate instanceof Date)) {
    modDate = new Date(modDate);
  }

  if (input instanceof File) {
    return {
      isFile: true,
      modDate: modDate || new Date(input.lastModified),
      bytes: input.stream(),
    };
  }

  if (input instanceof Response) {
    return {
      isFile: true,
      modDate: modDate || new Date(input.headers.get("Last-Modified") || Date.now()),
      bytes: input.body,
    };
  }

  if (modDate === undefined) {
    modDate = new Date();
  } else if (isNaN(modDate)) {
    throw new Error("Invalid modification date.");
  }

  if (input === undefined) {
    return { isFile: false, modDate };
  }

  if (typeof input === "string") {
    return { isFile: true, modDate, bytes: encodeString(input) };
  }

  if (input instanceof Blob) {
    return { isFile: true, modDate, bytes: input.stream() };
  }

  if (input instanceof Uint8Array || input instanceof ReadableStream) {
    return { isFile: true, modDate, bytes: input };
  }

  if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    return { isFile: true, modDate, bytes: makeUint8Array(input) };
  }

  if (Symbol.asyncIterator in input) {
    return { isFile: true, modDate, bytes: ReadableFromIter(input) };
  }

  throw new TypeError("Unsupported input format.");
}

export function ReadableFromIter(iter) {
  const gen = ("next" in iter) ? iter : iter[Symbol.asyncIterator]();

  return new ReadableStream({
    pull: async function(controller) {
      let pushedSize = 0;

      while (controller.desiredSize > pushedSize) {
        const next = await gen.next();

        if (next.value) {
          const chunk = normalizeChunk(next.value);
          controller.enqueue(chunk);
          pushedSize += chunk.byteLength;
        } else {
          controller.close();
          break;
        }
      }
    }
  })
}

export function normalizeChunk(chunk) {
  if (typeof chunk === "string") {
    return encodeString(chunk);
  }

  if (chunk instanceof Uint8Array) {
    return chunk;
  }

  return makeUint8Array(chunk);
}
