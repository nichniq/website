import is from "../modules/type.js";

export const strict = (x, y) => x === y;
export const ish = (x, y) => x == y;

export const gt = (x, y) => x > y;
export const gte = (x, y) => x >= y;
export const lt = (x, y) => x < y;
export const lte = (x, y) => x <= y;

export const incr = (x, y) => x - y >= 0;
export const decr = (x, y) => x - y < 0;

export const atoz = (x, y) => x.localeCompare(y) >= 0;
export const ztoa = (x, y) => x.localeCompare(y) < 0;

export const deep = (x, y) => {
  if ( is.primitive(x) && is.primitive(y) ) {
    return x === y;
  }

  if ( is.array(x) && is.array(y) ) {
    return x.length === y.length
      && x.every( (v, i) => deep( y[i], v ) );
  }

  if ( is.object(x) && is.object(y) ) {
    return Object.keys(x).length === Object.keys(y).length
      && Object.keys(x).every( key => deep( x[key], y[key] ) );
  }

  return false;
};
