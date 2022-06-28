export const is = {
  string: x => typeof x === "string",
  number: x => typeof x === "number",
  function: x => typeof x === "function",
  undefined: x => x === undefined,
  array: x => Array.isArray(x),
  null: x => x === null,
  object: x => typeof x === "object" && x !== null && !Array.isArray(x),
  symbol: x => typeof x === "symbol",
  primitive: x => x === null || typeof x !== "object",
};

export const match = (x, y) => {
  if ( is.primitive(x) && is.primitive(y) ) {
    return x === y;
  }

  if ( is.array(x) && is.array(y) ) {
    return x.legnth === y.length
      && x.every( (v, i) => match( y[i], v ) );
  }

  if ( is.object(x) && is.object(y) ) {
    return Object.keys(x).length === Object.keys(y).length
      && Object.keys(x).every( key => match( x[key], y[key] ) );
  }

  return false;
};
