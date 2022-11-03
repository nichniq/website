import { makeUint8Array } from "./utils.js";

// nichniq: presumably this is the compiled version of "./crc32.wam"
const wasm = "AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw";

const instance = new WebAssembly.Instance(
  new WebAssembly.Module(
    Uint8Array.from(
      atob(wasm),
      c => c.charCodeAt(0)
    )
  )
);
const { c, m } = instance.exports;
export const memory = m // for testing

// Someday we'll have BYOB stream readers and encodeInto etc.
// When that happens, we should write into this buffer directly.
const pageSize = 0x10000; // 64 kB
const crcBuffer = makeUint8Array(m).subarray(pageSize);

export function crc32(data, crc = 0) {
  for (const part of splitBuffer(data)) {
    crcBuffer.set(part);
    crc = c(part.length, crc);
  }

  return crc;
}

function* splitBuffer(data) {
  while (data.length > pageSize) {
    yield data.subarray(0, pageSize);
    data = data.subarray(pageSize);
  }

  if (data.length) {
    yield data;
  }
}
