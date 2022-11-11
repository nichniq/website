export const makeBuffer = (size) => new DataView(new ArrayBuffer(size));
export const makeUint8Array = (thing) => new Uint8Array(thing.buffer || thing);
export const encodeString = (whatever) => new TextEncoder().encode(String(whatever));
export const clampInt32 = (n) => Math.min(0xffffffff, Number(n));
export const clampInt16 = (n) => Math.min(0xffff, Number(n));
