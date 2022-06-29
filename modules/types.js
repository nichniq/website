const primitives = {
  string: x => typeof x === "string",
  boolean: x => typeof x === "boolean",
  number: x => typeof x === "number",
  bigint: x => typeof x === "bigint",
  symbol: x => typeof x === "symbol",
  undefined: x => x === undefined,
  null: x => x === null,
};

const objects = {
  object: x => x != null && x.constructor === Object,
  function: x => typeof x === "function",
  array: x => Array.isArray(x),
  regex: x => x != null && x.constructor === RegExp,
};

const groups = {
  primitive: x => x === null || typeof x !== "object" && typeof x !== "function",
  objecty: x => x !== null && typeof x === "object" || typeof x === "function",
  truthy: x => Boolean(x),
  falsy: x => !Boolean(x),
  nullish: x => x == null,
};

export const is = {
  ...primitives,
  ...objects,
  ...groups,
};

export const not = Object.fromEntries(
  Object.entries(is).map(
    ([ method, fn ]) => [ method, x => !fn(x) ]
  )
);

// TESTS AND ASSURACES

const values = {
  string: [ "", "a" ],
  boolean: [ true, false ],
  number: [ 0, 1, NaN, Infinity, -0 ],
  bigint: [ BigInt(1) ],
  symbol: Symbol(""),
  undefined: undefined,
  null: null,
};

for (const [ type, examples ] of Object.entries(values)) {
  for (const example of [ examples ].flat()) {
    for (const check of Object.keys(is)) {
      if (check === "primitive") {
        continue;
      }

      if (check === type) {
        if (is[check](example) === false) {
          throw new Error(`is.${check}(${JSON.stringify(example)}) ≠ false`);
        }
      }
    }
  }
}
