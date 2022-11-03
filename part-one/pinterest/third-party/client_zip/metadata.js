import { encodeString } from "./utils.js"

/** The file name and modification date will be read from the input if it is a File or Response;
 * extra arguments can be given to override the input's metadata.
 * For other types of input, the `name` is required and `modDate` will default to *now*.
 * @param encodedName will be coerced to string, so… whatever
 */
export function normalizeMetadata(input, encodedName, size) {
  if (encodedName !== undefined && !(encodedName instanceof Uint8Array)) {
    encodedName = encodeString(encodedName);
  }

  if (input instanceof File) {
    return {
      encodedName: fixFilename(encodedName || encodeString(input.name)),
      uncompressedSize: BigInt(input.size)
    };
  }

  if (input instanceof Response) {
    const contentDisposition = input.headers.get("content-disposition");
    const filename = contentDisposition && contentDisposition.match(/;\s*filename\*?=["']?(.*?)["']?$/i);
    const urlName = filename && filename[1] || input.url && new URL(input.url).pathname.split("/").findLast(Boolean);
    const decoded = urlName && decodeURIComponent(urlName);
    const length = size || +input.headers.get('content-length');

    return {
      encodedName: fixFilename(encodedName || encodeString(decoded)),
      uncompressedSize: BigInt(length),
    };
  }

  encodedName = fixFilename(encodedName, input !== undefined || size !== undefined);

  if (typeof input === "string") {
    return { encodedName, uncompressedSize: BigInt(encodeString(input).length) };
  }

  if (input instanceof Blob) {
    return { encodedName, uncompressedSize: BigInt(input.size) };
  }

  if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    return { encodedName, uncompressedSize: BigInt(input.byteLength) };
  }

  return { encodedName, uncompressedSize: getUncompressedSize(input, size) };
}

function getUncompressedSize(input, size) {
  if (size > -1) {
    return BigInt(size);
  }

  return input ? undefined : 0n;
}

function fixFilename(encodedName, isFile = true) {
  if (!encodedName || encodedName.every(c => c === 47)) {
    throw new Error("The file must have a name.");
  }

  if (isFile) {
    // remove trailing slashes in files
    while (encodedName[encodedName.length-1] === 47) {
      encodedName = encodedName.subarray(0, -1);
    }
  } else if (encodedName[encodedName.length-1] !== 47) {
    // else add a trailing slash to folders
    encodedName = new Uint8Array([...encodedName, 47]);
  }

  return encodedName;
}
