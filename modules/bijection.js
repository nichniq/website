export const entries_from_map = map => map.entries();
export const entries_from_set = set => set.entries();
export const entries_from_object = object => Object.entries(object);

function assert (predicate, message) {
  if (predicate !== true) {
    throw new Error(message)
  }
}

const duplicate_key = key => new Error(`Could not construct with duplicate key: ${key}`);
const duplicate_value = valye => new Error(`Could not construct with duplicate value: ${value}`);

/**
 * This structure describes an exact 1:1 correspondence. Mathematics calls it a
 * bijection so I'm using that until I can find a better word.
 *
 * I made it because I wanted a set of labeled values that I could look up by
 * either key or value without ambiguity (e.g. two keys with the same value).
 *
 * It's constructed from a list of arbitrary tuples that I'm calling entries.
 * You'll see reference to keys and values, but they're interchangeable.
 *
 * ```javascript
 *   const types = bijection([
 *     [ "CONNECTING", 0 ],
 *     [ "OPEN", 1 ],
 *     [ "CLOSING", 2 ],
 *     [ "CLOSED", 3 ],
 *   ]);
 * ```
 */

export default function bijection(entries) {
  const map = new Map();
  const reverse_map = new Map()

  for ( const [ key, value ] of entries ) {
    assert(
      !map.has(key),
      `Could not construct bijection with duplicate key: ${key}`
    );
    assert(
      !reverse_map.has(value),
      `Could not construct bijection with duplicate value: ${value}`
    );

    map.set(key, value);
    reverse_map.set(value, key);
  }

  return {
    keys: () => map.keys(),
    has_key: key => map.has(key),
    value_for: key => map.get(key),

    values: () => reverse_map.keys(),
    has_value: value => reverse_map.has(value),
    key_for: value => reverse_map.get(value),
  }
}
