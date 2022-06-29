/**
 * Helper method to make a call further on down easier on the eyes. Added more
 * functionality than I needed in case I move this to a shared module. I wanted
 * to clarify the concept before moving on. It provides a functional way of
 * mapping each entry in an object, its key, value, or both.
 */

const map = object => ({
  each_key: functor => Object.fromEntries(
    Object.entries(types).map(([ key, value ]) => [ functor(key), value ])
  ),
  each_entry: functor => Object.fromEntries(
    Object.entries(types).map(type => functor(type))
  ),
  each_value: functor => Object.fromEntries(
    Object.entries(types).map(([ key, value ]) => [ key, functor(value) ])
  ),
});

/**
 * Types are a fuzzy concept in JavaScript. There are many ways to find and
 * define them, but this way is the most consistent. By calling the ORIGINAL
 * OBJECT's `toString` method with a value will produce a string that looks like
 * [object <type>]. If we slice slice off the first eight characters and the
 * last, we get a fairly accurate representation of the value. This method is
 * described by MDN.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#real-world_usage
 */

export const type = x => Object.prototype.toString.call(x).slice(8,-1);

/**
 * There are descriptions of the native types. Each type has a label (it's key),
 * a pattern to compare a value's type with, and examples of that type. The list
 * is derived from MDN.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 */

const types = {
  array: {
    // including plain arrays and all the typed arrays
    pattern: /Array$/,
    examples: [ [], [ 1, 'a', true, null ], new Int8Array() ],
  },
  atomics: {
    // honestly not sure what this is, maybe it's a singleton too?
    pattern: "Atomics",
    examples: [ Atomic ],
  },
  bigint: {
    // haven't actually used one yet
    pattern: "BigInt",
    examples: [ BigInt(69), BigInt(Math.MAX_SAFE_INTEGER) ],
  } ,
  boolean: {
    pattern: "Boolean",
    examples: [ true, false ],
  },
  date: {
    pattern: "Date",
    examples: [ new Date() ],
  },
  error: {
    // all errors return the same type
    pattern: "Error",
    examples: [ new Error(), new SyntaxError() ],
  },
  function: {
    // Function, AsyncFunction, GeneratorFunction, AsyncGeneratorFunction
    pattern: /Function$/,
    examples: [
      () => {}, async () => {},
      function () {}, async function () {},
      class C {},
      function* () {}, async function* () {},
      Proxy, JSON.stringify,
    ],
  },
  generator: {
    // Generator and AsyncGenerator
    pattern: /Generator$/,
    examples: [ ( function* () {} )(), ( async function () {} )() ],
  },
  intl: {
    // this is a singleton; not sure I've ever used it
    pattern: "Intl",
    examples: [ Intl ],
  },
  json: {
    // this is a singleton
    pattern: "JSON",
    examples: [ JSON ],
  },
  map: {
    pattern: /^(WeakMap|Map)$/,
    examples: [ new WeakMap(), new Map() ],
  },
  math: {
    // this is a singleton
    pattern: "Math",
    examples: [ Math ],
  },
  number: {
    pattern: "Number",
    examples: [ 666, 0x666, 0o666, 0b00110, NaN, Infinity, -0, Math.PI ],
  },
  object: {
    // this refers to plain objects vs the more generous "inherits from object"
    pattern: "Object",
    examples: [ {}, Object.create(new Map()), ],
  },
  promise: {
    pattern:"Promise",
    examples: [ new Promise() ],
  },
  regexp: {
    pattern: "RegExp",
    examples: [ new RegExp("send"), /noodz/i ],
  },
  set: {
    // WeakSet and Set
    pattern: /^(WeakSet|Set)$/,
    examples: [ new WeakSet(), new Set() ],
  },
  string: {
    pattern: "String",
    examples: [ "nick", 'c', `${1 + 2}` ],
  },
  symbol: {
    pattern: "Symbol",
    examples: [ Symbol("🍄"), Symbol.iterator ],
  },
}

/**
 * There a small number of primitives types which are all the non-object values.
 * Unlike objects, === compares primitives by value instead of by reference.
 */

const primitives = [
  types.string,
  types.boolean,
  types.number,
  types.bigint,
  types.symbol,
  types.undefined,
  types.null,
];

const primitive = {
  pattern: primitives.flatMap(({ pattern }) => pattern),
  examples: primitives.flatMap(({ examples }) => examples),
};

/**
 * We can create a number of type predicates derived from our definitions
 */

const predicates = {
  // for each type, match the input's type against the pattern
  ...map(types).each_value(({ pattern }) => x => pattern.match(type(x))),

  // for primitive, we have a more direct method with a typeof comb
  primitive: x => x === null || typeof x !== "object" && typeof x !== "function",

  // we use the same strategy to see if it's objecty (not a primitive)
  objecty: x => x !== null && typeof x === "object" || typeof x === "function",

  // we get the implicit truthiness of a value by coercing into a boolean
  truthy: x => Boolean(x),
  falsy: x => !Boolean(x),

  // nullish is just null or undefined, which more specific than truthy
  nullish: x => x === null || x === undefined,
};
